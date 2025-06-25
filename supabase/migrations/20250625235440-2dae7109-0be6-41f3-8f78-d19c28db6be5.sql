
-- First, let's drop the existing problematic policies
DROP POLICY IF EXISTS "Users can view members of their organization" ON public.organization_members;
DROP POLICY IF EXISTS "Organization admins can manage members" ON public.organization_members;

-- Create a security definer function to get user's organization memberships
-- This breaks the recursion by running with elevated privileges
CREATE OR REPLACE FUNCTION public.get_user_organizations()
RETURNS TABLE(organization_id uuid, role text)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT om.organization_id, om.role
  FROM public.organization_members om
  WHERE om.user_id = auth.uid() AND om.is_active = true;
$$;

-- Create a helper function to check if user belongs to an organization
CREATE OR REPLACE FUNCTION public.user_belongs_to_organization(org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = auth.uid() 
    AND organization_id = org_id 
    AND is_active = true
  );
$$;

-- Create a helper function to check if user has admin/owner role in organization
CREATE OR REPLACE FUNCTION public.user_can_manage_organization(org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = auth.uid() 
    AND organization_id = org_id 
    AND role IN ('owner', 'admin')
    AND is_active = true
  );
$$;

-- Now create new, non-recursive RLS policies for organization_members
CREATE POLICY "Users can view members of organizations they belong to" 
  ON public.organization_members 
  FOR SELECT 
  USING (public.user_belongs_to_organization(organization_id));

CREATE POLICY "Users can insert organization members if they are admin/owner" 
  ON public.organization_members 
  FOR INSERT 
  WITH CHECK (public.user_can_manage_organization(organization_id));

CREATE POLICY "Users can update organization members if they are admin/owner" 
  ON public.organization_members 
  FOR UPDATE 
  USING (public.user_can_manage_organization(organization_id));

CREATE POLICY "Users can delete organization members if they are admin/owner" 
  ON public.organization_members 
  FOR DELETE 
  USING (public.user_can_manage_organization(organization_id));

-- Also fix the organizations table policies to use the helper function
DROP POLICY IF EXISTS "Users can view their organization" ON public.organizations;
DROP POLICY IF EXISTS "Organization owners can update their organization" ON public.organizations;

CREATE POLICY "Users can view organizations they belong to" 
  ON public.organizations 
  FOR SELECT 
  USING (public.user_belongs_to_organization(id));

CREATE POLICY "Organization owners can update their organization" 
  ON public.organizations 
  FOR UPDATE 
  USING (public.user_can_manage_organization(id));

-- Fix invitations table policies
DROP POLICY IF EXISTS "Organization admins can manage invitations" ON public.invitations;

CREATE POLICY "Organization admins can manage invitations" 
  ON public.invitations 
  FOR ALL 
  USING (public.user_can_manage_organization(organization_id));
