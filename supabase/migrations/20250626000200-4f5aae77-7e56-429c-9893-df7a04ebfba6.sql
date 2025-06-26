
-- Add a policy to allow organization creation during registration
-- This policy allows INSERT operations on organizations table without authentication
-- since organizations are created during the user registration process
CREATE POLICY "Allow organization creation during registration" 
  ON public.organizations 
  FOR INSERT 
  WITH CHECK (true);

-- Also need to allow unauthenticated users to insert into organization_members
-- during the registration process when they become the owner
CREATE POLICY "Allow organization membership creation during registration" 
  ON public.organization_members 
  FOR INSERT 
  WITH CHECK (role = 'owner');
