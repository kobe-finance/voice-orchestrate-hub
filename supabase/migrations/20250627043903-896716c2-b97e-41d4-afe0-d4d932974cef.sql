
-- Clean removal of problematic trigger approach
BEGIN;

-- Remove the trigger that's causing transaction rollbacks
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.complete_user_registration();

-- Create utility function for migrations and cleanup (not used in normal flow)
CREATE OR REPLACE FUNCTION public.create_organization_for_user(
  p_user_id UUID,
  p_email TEXT,
  p_company_name TEXT
) RETURNS UUID AS $$
DECLARE
  v_org_id UUID;
  v_org_slug TEXT;
  v_counter INTEGER := 0;
BEGIN
  -- Generate base slug
  v_org_slug := lower(regexp_replace(p_company_name, '[^a-zA-Z0-9]+', '-', 'g'));
  v_org_slug := regexp_replace(v_org_slug, '^-|-$', '', 'g');
  
  -- Handle empty slug
  IF v_org_slug = '' THEN
    v_org_slug := 'organization';
  END IF;
  
  -- Ensure unique slug with counter
  WHILE EXISTS (SELECT 1 FROM organizations WHERE slug = v_org_slug) LOOP
    v_counter := v_counter + 1;
    v_org_slug := regexp_replace(p_company_name, '[^a-zA-Z0-9]+', '-', 'g') || '-' || v_counter::text;
  END LOOP;
  
  -- Create organization
  INSERT INTO organizations (name, slug)
  VALUES (p_company_name, v_org_slug)
  RETURNING id INTO v_org_id;
  
  -- Create owner membership
  INSERT INTO organization_members (user_id, organization_id, role)
  VALUES (p_user_id, v_org_id, 'owner');
  
  -- Log success for monitoring
  INSERT INTO registration_logs (user_id, action, details)
  VALUES (p_user_id, 'manual_organization_created', jsonb_build_object(
    'org_id', v_org_id,
    'org_slug', v_org_slug,
    'org_name', p_company_name
  ));
  
  RETURN v_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create utility function to ensure users have organizations (for orphaned users)
CREATE OR REPLACE FUNCTION public.ensure_user_has_organization(p_user_id UUID)
RETURNS UUID AS $$
DECLARE
  v_org_id UUID;
  v_user_email TEXT;
  v_company_name TEXT;
BEGIN
  -- Check if user already has organization
  SELECT organization_id INTO v_org_id
  FROM organization_members 
  WHERE user_id = p_user_id AND is_active = true
  LIMIT 1;
  
  IF v_org_id IS NOT NULL THEN
    RETURN v_org_id;
  END IF;
  
  -- Get user email for default organization name
  SELECT email INTO v_user_email
  FROM auth.users 
  WHERE id = p_user_id;
  
  v_company_name := split_part(v_user_email, '@', 1) || '''s Workspace';
  
  -- Create organization for orphaned user
  SELECT create_organization_for_user(p_user_id, v_user_email, v_company_name) INTO v_org_id;
  
  RETURN v_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;
