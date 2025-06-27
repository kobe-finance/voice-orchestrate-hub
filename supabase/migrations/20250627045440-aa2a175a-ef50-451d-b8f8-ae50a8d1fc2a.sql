
-- Hard delete kobeapidev@gmail.com user and all associated data
-- This will permanently remove the user, their organization, and all related records

DO $$
DECLARE
    target_user_id UUID;
    target_org_id UUID;
BEGIN
    -- Get the user ID for kobeapidev@gmail.com
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = 'kobeapidev@gmail.com';
    
    IF target_user_id IS NOT NULL THEN
        -- Get the organization ID they own
        SELECT organization_id INTO target_org_id
        FROM public.organization_members 
        WHERE user_id = target_user_id AND role = 'owner';
        
        -- Delete in proper order to avoid foreign key conflicts
        
        -- 1. Delete from integration-related tables
        DELETE FROM public.integration_audit_log 
        WHERE user_id = target_user_id;
        
        DELETE FROM public.user_integrations 
        WHERE user_id = target_user_id;
        
        DELETE FROM public.integration_credentials 
        WHERE user_id = target_user_id;
        
        -- 2. Delete organization memberships
        DELETE FROM public.organization_members 
        WHERE user_id = target_user_id;
        
        -- 3. Delete invitations created by or for this user
        DELETE FROM public.invitations 
        WHERE created_by = target_user_id OR email = 'kobeapidev@gmail.com';
        
        -- 4. Delete the organization if they owned one
        IF target_org_id IS NOT NULL THEN
            DELETE FROM public.organizations 
            WHERE id = target_org_id;
        END IF;
        
        -- 5. Delete user profile and business profile
        DELETE FROM public.profiles 
        WHERE id = target_user_id;
        
        DELETE FROM public.business_profiles 
        WHERE user_id = target_user_id;
        
        -- 6. Delete registration logs
        DELETE FROM public.registration_logs 
        WHERE user_id = target_user_id;
        
        -- 7. Finally delete the user from auth.users (this will cascade to auth-related tables)
        DELETE FROM auth.users 
        WHERE id = target_user_id;
        
        RAISE NOTICE 'Successfully deleted user kobeapidev@gmail.com and all associated data';
    ELSE
        RAISE NOTICE 'User kobeapidev@gmail.com not found';
    END IF;
END $$;
