
-- Phase 1: Database-Level Atomic Registration Implementation

-- Create the atomic registration function
CREATE OR REPLACE FUNCTION public.complete_user_registration()
RETURNS TRIGGER AS $$
DECLARE
  v_org_id UUID;
  v_base_slug TEXT;
  v_final_slug TEXT;
  v_counter INTEGER := 0;
  v_company_name TEXT;
BEGIN
  -- Extract company name from metadata or generate default
  v_company_name := COALESCE(
    NEW.raw_user_meta_data->>'company_name',
    split_part(NEW.email, '@', 1) || '''s Workspace'
  );
  
  -- Generate base slug (URL-safe)
  v_base_slug := lower(regexp_replace(v_company_name, '[^a-zA-Z0-9]+', '-', 'g'));
  v_base_slug := regexp_replace(v_base_slug, '^-|-$', '', 'g'); -- Remove leading/trailing dashes
  
  -- Handle empty slug case
  IF v_base_slug = '' THEN
    v_base_slug := 'organization';
  END IF;
  
  -- Start with base slug
  v_final_slug := v_base_slug;
  
  -- Handle collisions with incrementing numbers (cleaner than UUID)
  WHILE EXISTS (SELECT 1 FROM organizations WHERE slug = v_final_slug) LOOP
    v_counter := v_counter + 1;
    v_final_slug := v_base_slug || '-' || v_counter::text;
  END LOOP;
  
  -- Create organization
  INSERT INTO organizations (name, slug, created_at, updated_at)
  VALUES (v_company_name, v_final_slug, NOW(), NOW())
  RETURNING id INTO v_org_id;
  
  -- Create owner membership
  INSERT INTO organization_members (user_id, organization_id, role, joined_at, is_active)
  VALUES (NEW.id, v_org_id, 'owner', NOW(), true);
  
  -- Update user metadata with comprehensive tenant information
  NEW.raw_user_meta_data := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object(
      'tenant_id', v_org_id,
      'default_organization', v_org_id,
      'onboarding_completed', false,
      'registration_source', 'self_service',
      'registration_completed_at', NOW()::text,
      'role', 'owner'
    );
  
  -- Log successful registration for monitoring
  INSERT INTO registration_logs (user_id, action, details)
  VALUES (NEW.id, 'atomic_registration_completed', jsonb_build_object(
    'org_id', v_org_id,
    'org_slug', v_final_slug,
    'org_name', v_company_name
  ));
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error for debugging
  INSERT INTO registration_logs (user_id, action, details)
  VALUES (NEW.id, 'registration_failed', jsonb_build_object(
    'error_message', SQLERRM,
    'error_state', SQLSTATE,
    'company_name', v_company_name
  ));
  
  -- Re-raise the exception to fail the user creation
  RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create registration monitoring table
CREATE TABLE IF NOT EXISTS registration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on registration logs
ALTER TABLE registration_logs ENABLE ROW LEVEL SECURITY;

-- Policy for registration logs (admin access only)
CREATE POLICY "Admin can view registration logs" ON registration_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.user_id = auth.uid() 
      AND om.role IN ('owner', 'admin')
      AND om.is_active = true
    )
  );

-- Create the trigger for new user registrations
CREATE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION complete_user_registration();

-- Create test function to verify the trigger works
CREATE OR REPLACE FUNCTION public.test_registration_trigger()
RETURNS TEXT AS $$
DECLARE
  v_test_user_id UUID;
  v_test_email TEXT;
  v_result TEXT := '';
BEGIN
  -- Generate unique test email
  v_test_email := 'test-' || gen_random_uuid() || '@example.com';
  
  -- Insert test user (this should trigger organization creation)
  INSERT INTO auth.users (
    id, 
    email, 
    raw_user_meta_data,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    v_test_email,
    '{"first_name": "Test", "last_name": "User", "company_name": "Test Company"}'::jsonb,
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
  ) RETURNING id INTO v_test_user_id;
  
  -- Verify organization was created
  IF EXISTS (
    SELECT 1 FROM organization_members om
    JOIN organizations o ON o.id = om.organization_id
    WHERE om.user_id = v_test_user_id 
    AND om.role = 'owner'
    AND o.name = 'Test Company'
  ) THEN
    v_result := 'SUCCESS: Trigger created organization and membership correctly';
  ELSE
    v_result := 'FAILED: Organization or membership not created';
  END IF;
  
  -- Cleanup test data
  DELETE FROM auth.users WHERE id = v_test_user_id;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
