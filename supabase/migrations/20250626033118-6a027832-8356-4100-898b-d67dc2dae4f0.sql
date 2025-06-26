
-- Step 1: Drop all existing policies to start fresh
DROP POLICY IF EXISTS "registration_insert_organizations" ON public.organizations;
DROP POLICY IF EXISTS "registration_insert_memberships" ON public.organization_members;
DROP POLICY IF EXISTS "authenticated_select_organizations" ON public.organizations;
DROP POLICY IF EXISTS "authenticated_select_members" ON public.organization_members;
DROP POLICY IF EXISTS "authenticated_update_organizations" ON public.organizations;
DROP POLICY IF EXISTS "authenticated_manage_members" ON public.organization_members;

-- Drop any other policies that might exist from previous migrations
DROP POLICY IF EXISTS "Allow organization creation during registration" ON public.organizations;
DROP POLICY IF EXISTS "Allow organization membership creation during registration" ON public.organization_members;
DROP POLICY IF EXISTS "Users can view organizations they belong to" ON public.organizations;
DROP POLICY IF EXISTS "Organization owners can update their organization" ON public.organizations;
DROP POLICY IF EXISTS "Users can view members of organizations they belong to" ON public.organization_members;
DROP POLICY IF EXISTS "Users can insert organization members if they are admin/owner" ON public.organization_members;
DROP POLICY IF EXISTS "Users can update organization members if they are admin/owner" ON public.organization_members;
DROP POLICY IF EXISTS "Users can delete organization members if they are admin/owner" ON public.organization_members;

-- Step 2: Ensure RLS is enabled on both tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Step 3: Create clean, working policies
CREATE POLICY "registration_insert_organizations" 
ON public.organizations 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "registration_insert_memberships" 
ON public.organization_members 
FOR INSERT 
TO anon, authenticated
WITH CHECK (role = 'owner');

CREATE POLICY "authenticated_select_organizations" 
ON public.organizations 
FOR SELECT 
TO authenticated
USING (public.user_belongs_to_organization(id));

CREATE POLICY "authenticated_select_members" 
ON public.organization_members 
FOR SELECT 
TO authenticated
USING (public.user_belongs_to_organization(organization_id));

CREATE POLICY "authenticated_update_organizations" 
ON public.organizations 
FOR UPDATE 
TO authenticated
USING (public.user_can_manage_organization(id));

CREATE POLICY "authenticated_manage_members" 
ON public.organization_members 
FOR ALL 
TO authenticated
USING (public.user_can_manage_organization(organization_id));
