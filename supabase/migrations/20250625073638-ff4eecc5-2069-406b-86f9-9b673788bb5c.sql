
-- Phase 1: Create Organizations Schema and Migrate Existing Data

-- 1. Create organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  settings JSONB DEFAULT '{}'::jsonb
);

-- 2. Create organization_members table
CREATE TABLE public.organization_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id, organization_id)
);

-- 3. Create invitations table for future invitation system
CREATE TABLE public.invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Enable RLS on all new tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for organizations
CREATE POLICY "Users can view their organization" 
  ON public.organizations 
  FOR SELECT 
  USING (
    id IN (
      SELECT organization_id 
      FROM public.organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Organization owners can update their organization" 
  ON public.organizations 
  FOR UPDATE 
  USING (
    id IN (
      SELECT organization_id 
      FROM public.organization_members 
      WHERE user_id = auth.uid() AND role = 'owner' AND is_active = true
    )
  );

-- 6. Create RLS policies for organization_members
CREATE POLICY "Users can view members of their organization" 
  ON public.organization_members 
  FOR SELECT 
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Organization admins can manage members" 
  ON public.organization_members 
  FOR ALL 
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.organization_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin') 
      AND is_active = true
    )
  );

-- 7. Create RLS policies for invitations
CREATE POLICY "Organization admins can manage invitations" 
  ON public.invitations 
  FOR ALL 
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.organization_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin') 
      AND is_active = true
    )
  );

-- 8. Add updated_at triggers
CREATE TRIGGER handle_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. Create default organization for existing data
INSERT INTO public.organizations (id, name, slug, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Default Organization',
  'default',
  NOW()
);

-- 10. Add tenant_id to existing tables that don't have it
ALTER TABLE public.integration_credentials 
  ADD COLUMN IF NOT EXISTS tenant_id UUID;

ALTER TABLE public.user_integrations 
  ADD COLUMN IF NOT EXISTS tenant_id UUID;

ALTER TABLE public.integration_audit_log 
  ADD COLUMN IF NOT EXISTS tenant_id UUID;

-- 11. Update existing records with default organization
UPDATE public.integration_credentials 
  SET tenant_id = '00000000-0000-0000-0000-000000000001'
  WHERE tenant_id IS NULL;

UPDATE public.user_integrations 
  SET tenant_id = '00000000-0000-0000-0000-000000000001'
  WHERE tenant_id IS NULL;

UPDATE public.integration_audit_log 
  SET tenant_id = '00000000-0000-0000-0000-000000000001'
  WHERE tenant_id IS NULL;

-- 12. Make tenant_id NOT NULL after updating existing data
ALTER TABLE public.integration_credentials 
  ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE public.user_integrations 
  ALTER COLUMN tenant_id SET NOT NULL;

-- 13. Assign existing users to default organization
INSERT INTO public.organization_members (user_id, organization_id, role)
SELECT id, '00000000-0000-0000-0000-000000000001', 'admin'
FROM auth.users
WHERE id NOT IN (
  SELECT user_id FROM public.organization_members
);

-- 14. Update existing user metadata to include tenant_id
UPDATE auth.users
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
  jsonb_build_object('tenant_id', '00000000-0000-0000-0000-000000000001')
WHERE raw_user_meta_data->>'tenant_id' IS NULL;

-- 15. Update RLS policies on existing tables to use tenant isolation
DROP POLICY IF EXISTS "Users can view their own integration credentials" ON public.integration_credentials;
DROP POLICY IF EXISTS "Users can create their own integration credentials" ON public.integration_credentials;
DROP POLICY IF EXISTS "Users can update their own integration credentials" ON public.integration_credentials;
DROP POLICY IF EXISTS "Users can delete their own integration credentials" ON public.integration_credentials;

CREATE POLICY "Tenant isolation for integration credentials" 
  ON public.integration_credentials 
  FOR ALL 
  USING (
    tenant_id = COALESCE(
      (auth.jwt()->>'tenant_id')::uuid,
      (auth.jwt()->'user_metadata'->>'tenant_id')::uuid
    )
    AND EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE user_id = auth.uid()
      AND organization_id = tenant_id
      AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Users can view their own user integrations" ON public.user_integrations;
DROP POLICY IF EXISTS "Users can create their own user integrations" ON public.user_integrations;
DROP POLICY IF EXISTS "Users can update their own user integrations" ON public.user_integrations;
DROP POLICY IF EXISTS "Users can delete their own user integrations" ON public.user_integrations;

CREATE POLICY "Tenant isolation for user integrations" 
  ON public.user_integrations 
  FOR ALL 
  USING (
    tenant_id = COALESCE(
      (auth.jwt()->>'tenant_id')::uuid,
      (auth.jwt()->'user_metadata'->>'tenant_id')::uuid
    )
    AND EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE user_id = auth.uid()
      AND organization_id = tenant_id
      AND is_active = true
    )
  );

CREATE POLICY "Tenant isolation for integration audit log" 
  ON public.integration_audit_log 
  FOR ALL 
  USING (
    tenant_id = COALESCE(
      (auth.jwt()->>'tenant_id')::uuid,
      (auth.jwt()->'user_metadata'->>'tenant_id')::uuid
    )
  );
