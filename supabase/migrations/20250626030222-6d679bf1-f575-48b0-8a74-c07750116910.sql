
-- Clean slate approach: Drop all existing policies and rebuild with minimal, explicit permissions

-- Step 1: Drop ALL existing organization policies to eliminate conflicts
DROP POLICY IF EXISTS "Allow organization creation during registration" ON public.organizations;
DROP POLICY IF EXISTS "Users can view organizations they belong to" ON public.organizations;
DROP POLICY IF EXISTS "Organization owners can update their organization" ON public.organizations;

-- Step 2: Drop ALL existing organization_members policies
DROP POLICY IF EXISTS "Allow organization membership creation during registration" ON public.organization_members;
DROP POLICY IF EXISTS "Users can view members of organizations they belong to" ON public.organization_members;
DROP POLICY IF EXISTS "Users can insert organization members if they are admin/owner" ON public.organization_members;
DROP POLICY IF EXISTS "Users can update organization members if they are admin/owner" ON public.organization_members;
DROP POLICY IF EXISTS "Users can delete organization members if they are admin/owner" ON public.organization_members;

-- Step 3: Create ONE simple, explicit policy for organization registration
-- This allows ANY user (anon or authenticated) to create organizations during registration
CREATE POLICY "registration_insert_organizations" 
ON public.organizations 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Step 4: Create ONE simple policy for organization membership during registration
-- This allows ANY user to create owner memberships during registration
CREATE POLICY "registration_insert_memberships" 
ON public.organization_members 
FOR INSERT 
TO anon, authenticated
WITH CHECK (role = 'owner');

-- Step 5: Add back minimal SELECT policies for authenticated users only
-- Organizations: Users can view organizations they belong to
CREATE POLICY "authenticated_select_organizations" 
ON public.organizations 
FOR SELECT 
TO authenticated
USING (public.user_belongs_to_organization(id));

-- Organization members: Users can view members of their organizations
CREATE POLICY "authenticated_select_members" 
ON public.organization_members 
FOR SELECT 
TO authenticated
USING (public.user_belongs_to_organization(organization_id));

-- Step 6: Add back minimal UPDATE/DELETE policies for authenticated users only
-- Only organization owners/admins can update organizations
CREATE POLICY "authenticated_update_organizations" 
ON public.organizations 
FOR UPDATE 
TO authenticated
USING (public.user_can_manage_organization(id));

-- Only organization owners/admins can manage members
CREATE POLICY "authenticated_manage_members" 
ON public.organization_members 
FOR ALL 
TO authenticated
USING (public.user_can_manage_organization(organization_id));
