
-- Check current RLS policies on organizations table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('organizations', 'organization_members')
ORDER BY tablename, policyname;

-- Check if RLS is enabled on both tables (corrected query)
SELECT schemaname, tablename, rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('organizations', 'organization_members');
