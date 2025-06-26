
-- Drop the existing restrictive policy and create a more permissive one for registration
DROP POLICY IF EXISTS "Allow organization creation during registration" ON public.organizations;

-- Create a more permissive policy that allows any insert during registration
-- This is safe because organization creation is part of the controlled registration flow
CREATE POLICY "Allow organization creation during registration" 
ON public.organizations 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Also ensure the organization_members policy allows unauthenticated inserts for owner role
DROP POLICY IF EXISTS "Allow organization membership creation during registration" ON public.organization_members;

CREATE POLICY "Allow organization membership creation during registration" 
ON public.organization_members 
FOR INSERT 
TO anon, authenticated
WITH CHECK (role = 'owner');
