
-- Create enum for onboarding steps
CREATE TYPE public.onboarding_step AS ENUM (
  'welcome',
  'business-profile', 
  'voice-agent-config',
  'integration-setup',
  'demo-call'
);

-- Create enum for business sizes
CREATE TYPE public.business_size AS ENUM (
  'startup',
  'small',
  'medium',
  'large',
  'enterprise'
);

-- Main onboarding tracking table
CREATE TABLE public.user_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  current_step onboarding_step DEFAULT 'welcome',
  completed_steps onboarding_step[] DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_reminder_sent TIMESTAMP WITH TIME ZONE,
  reminder_dismissed_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Business profile data (normalized for searchability)
CREATE TABLE public.onboarding_business_profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_name TEXT NOT NULL,
  industry TEXT,
  business_size business_size,
  website_url TEXT,
  phone_number TEXT,
  description TEXT,
  goals JSONB,
  target_audience JSONB,
  current_tools JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Voice agent configuration (JSON for complex nested data)
CREATE TABLE public.onboarding_voice_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  agent_name TEXT,
  voice_provider TEXT,
  voice_id TEXT,
  language TEXT DEFAULT 'en-US',
  personality_traits JSONB,
  conversation_style JSONB,
  response_guidelines JSONB,
  sample_conversations JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Integration configurations
CREATE TABLE public.onboarding_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  selected_integrations JSONB DEFAULT '[]',
  integration_configs JSONB DEFAULT '{}',
  priority_integrations JSONB DEFAULT '[]',
  custom_requirements JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Demo call data
CREATE TABLE public.onboarding_demo_call (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  demo_completed BOOLEAN DEFAULT false,
  demo_feedback JSONB,
  call_recording_url TEXT,
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  improvement_suggestions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Backup table for re-onboarding (stores previous settings)
CREATE TABLE public.onboarding_backups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  backup_data JSONB NOT NULL,
  backup_reason TEXT DEFAULT 're-onboarding',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_business_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_voice_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_demo_call ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_backups ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_onboarding
CREATE POLICY "Users can view their own onboarding status" 
  ON public.user_onboarding 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own onboarding record" 
  ON public.user_onboarding 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding status" 
  ON public.user_onboarding 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for business profile
CREATE POLICY "Users can view their own business profile" 
  ON public.onboarding_business_profile 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own business profile" 
  ON public.onboarding_business_profile 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business profile" 
  ON public.onboarding_business_profile 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for voice config
CREATE POLICY "Users can view their own voice config" 
  ON public.onboarding_voice_config 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own voice config" 
  ON public.onboarding_voice_config 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own voice config" 
  ON public.onboarding_voice_config 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for integrations
CREATE POLICY "Users can view their own integrations" 
  ON public.onboarding_integrations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own integrations" 
  ON public.onboarding_integrations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integrations" 
  ON public.onboarding_integrations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for demo call
CREATE POLICY "Users can view their own demo call data" 
  ON public.onboarding_demo_call 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own demo call data" 
  ON public.onboarding_demo_call 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own demo call data" 
  ON public.onboarding_demo_call 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for backups
CREATE POLICY "Users can view their own backups" 
  ON public.onboarding_backups 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own backups" 
  ON public.onboarding_backups 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_user_onboarding_updated_at
  BEFORE UPDATE ON public.user_onboarding
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_business_profile_updated_at
  BEFORE UPDATE ON public.onboarding_business_profile
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_voice_config_updated_at
  BEFORE UPDATE ON public.onboarding_voice_config
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_integrations_updated_at
  BEFORE UPDATE ON public.onboarding_integrations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_demo_call_updated_at
  BEFORE UPDATE ON public.onboarding_demo_call
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Helper function to get user onboarding status
CREATE OR REPLACE FUNCTION public.get_user_onboarding_status(user_uuid UUID)
RETURNS TABLE (
  is_completed BOOLEAN,
  current_step TEXT,
  completed_steps TEXT[],
  needs_reminder BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    uo.is_completed,
    uo.current_step::TEXT,
    ARRAY(SELECT unnest(uo.completed_steps)::TEXT),
    CASE 
      WHEN uo.is_completed = true THEN false
      WHEN uo.reminder_dismissed_until > now() THEN false
      WHEN uo.last_reminder_sent IS NULL THEN true
      WHEN uo.last_reminder_sent < (now() - INTERVAL '7 days') THEN true
      ELSE false
    END as needs_reminder
  FROM public.user_onboarding uo
  WHERE uo.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
