
-- First, let's create a simplified profiles table to preserve business data
CREATE TABLE public.business_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_name TEXT,
  industry TEXT,
  business_size TEXT,
  website_url TEXT,
  phone_number TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own business profile" 
  ON public.business_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own business profile" 
  ON public.business_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business profile" 
  ON public.business_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Migrate existing business profile data if any exists
INSERT INTO public.business_profiles (user_id, business_name, industry, business_size, website_url, phone_number, description, created_at, updated_at)
SELECT 
  user_id, 
  business_name, 
  industry, 
  business_size::TEXT, 
  website_url, 
  phone_number, 
  description, 
  created_at, 
  updated_at
FROM public.onboarding_business_profile
ON CONFLICT (user_id) DO NOTHING;

-- Add updated_at trigger
CREATE TRIGGER handle_business_profiles_updated_at
  BEFORE UPDATE ON public.business_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Now drop all onboarding-related tables and functions
DROP TABLE IF EXISTS public.onboarding_backups CASCADE;
DROP TABLE IF EXISTS public.onboarding_demo_call CASCADE;
DROP TABLE IF EXISTS public.onboarding_integrations CASCADE;
DROP TABLE IF EXISTS public.onboarding_voice_config CASCADE;
DROP TABLE IF EXISTS public.onboarding_business_profile CASCADE;
DROP TABLE IF EXISTS public.user_onboarding CASCADE;

-- Drop the onboarding-specific function
DROP FUNCTION IF EXISTS public.get_user_onboarding_status(uuid);

-- Drop the onboarding-specific enums
DROP TYPE IF EXISTS public.onboarding_step CASCADE;
DROP TYPE IF EXISTS public.business_size CASCADE;
