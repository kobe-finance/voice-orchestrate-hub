
-- Add only the missing RLS policies for registration
-- Check if organizations table has RLS enabled, enable if not
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public' 
        AND c.relname = 'organizations' 
        AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Add registration policies only if they don't exist
DO $$
BEGIN
    -- Policy for organization creation during registration
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'organizations' 
        AND policyname = 'Allow organization creation during registration'
    ) THEN
        CREATE POLICY "Allow organization creation during registration" 
        ON public.organizations 
        FOR INSERT 
        WITH CHECK (true);
    END IF;
    
    -- Policy for organization membership creation during registration
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'organization_members' 
        AND policyname = 'Allow organization membership creation during registration'
    ) THEN
        CREATE POLICY "Allow organization membership creation during registration" 
        ON public.organization_members 
        FOR INSERT 
        WITH CHECK (role = 'owner');
    END IF;
    
    -- Policies for authenticated users to view and manage organizations
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'organizations' 
        AND policyname = 'Users can view organizations they belong to'
    ) THEN
        CREATE POLICY "Users can view organizations they belong to" 
        ON public.organizations 
        FOR SELECT 
        USING (public.user_belongs_to_organization(id));
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'organizations' 
        AND policyname = 'Organization owners can update their organization'
    ) THEN
        CREATE POLICY "Organization owners can update their organization" 
        ON public.organizations 
        FOR UPDATE 
        USING (public.user_can_manage_organization(id));
    END IF;
END $$;
