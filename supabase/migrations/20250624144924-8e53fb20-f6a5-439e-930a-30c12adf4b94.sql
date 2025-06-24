
-- Create the integrations master catalog table
CREATE TABLE public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  category VARCHAR NOT NULL,
  description TEXT,
  icon_url VARCHAR,
  documentation_url VARCHAR,
  required_scopes JSONB,
  config_schema JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the integration credentials table
CREATE TABLE public.integration_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_id UUID NOT NULL REFERENCES public.integrations(id) ON DELETE CASCADE,
  credential_name VARCHAR NOT NULL,
  encrypted_credentials JSONB NOT NULL,
  credential_type VARCHAR NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  last_tested_at TIMESTAMP WITH TIME ZONE,
  last_test_status VARCHAR DEFAULT 'not_tested',
  last_test_error JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  UNIQUE(user_id, integration_id, credential_name)
);

-- Create the user integrations table
CREATE TABLE public.user_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_id UUID NOT NULL REFERENCES public.integrations(id) ON DELETE CASCADE,
  credential_id UUID NOT NULL REFERENCES public.integration_credentials(id) ON DELETE CASCADE,
  status VARCHAR NOT NULL DEFAULT 'installing',
  config JSONB,
  installed_at TIMESTAMP WITH TIME ZONE,
  installed_by UUID REFERENCES auth.users(id),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_status VARCHAR,
  error_count INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, integration_id)
);

-- Create the integration audit log table
CREATE TABLE public.integration_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_id UUID REFERENCES public.integrations(id),
  action VARCHAR NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the integration test logs table
CREATE TABLE public.integration_test_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credential_id UUID NOT NULL REFERENCES public.integration_credentials(id) ON DELETE CASCADE,
  test_type VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  response_time_ms INTEGER,
  error_details JSONB,
  tested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tested_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_test_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tenant isolation and user access

-- Integrations table - public read access for authenticated users
CREATE POLICY "Authenticated users can view integrations" 
  ON public.integrations 
  FOR SELECT 
  TO authenticated
  USING (is_active = true);

-- Integration credentials - users can only access their own credentials
CREATE POLICY "Users can view their own credentials" 
  ON public.integration_credentials 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own credentials" 
  ON public.integration_credentials 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credentials" 
  ON public.integration_credentials 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own credentials" 
  ON public.integration_credentials 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- User integrations - users can only access their own integrations
CREATE POLICY "Users can view their own integrations" 
  ON public.user_integrations 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own integrations" 
  ON public.user_integrations 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integrations" 
  ON public.user_integrations 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integrations" 
  ON public.user_integrations 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Audit log - users can only view their own audit entries
CREATE POLICY "Users can view their own audit log" 
  ON public.integration_audit_log 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create audit log entries" 
  ON public.integration_audit_log 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Test logs - users can only access logs for their credentials
CREATE POLICY "Users can view test logs for their credentials" 
  ON public.integration_test_logs 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.integration_credentials 
      WHERE id = credential_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create test logs for their credentials" 
  ON public.integration_test_logs 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.integration_credentials 
      WHERE id = credential_id AND user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_credentials_user_integration 
  ON public.integration_credentials(user_id, integration_id);

CREATE INDEX idx_user_integrations_status 
  ON public.user_integrations(user_id, status);

CREATE INDEX idx_audit_log_user_date 
  ON public.integration_audit_log(user_id, created_at DESC);

CREATE INDEX idx_test_logs_credential 
  ON public.integration_test_logs(credential_id, tested_at DESC);

CREATE INDEX idx_integrations_category 
  ON public.integrations(category, is_active);

-- Add updated_at triggers for tables that need them
CREATE TRIGGER handle_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_integration_credentials_updated_at
  BEFORE UPDATE ON public.integration_credentials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_user_integrations_updated_at
  BEFORE UPDATE ON public.user_integrations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert seed data for priority integrations
INSERT INTO public.integrations (name, slug, category, description, icon_url, documentation_url, required_scopes, config_schema, is_active) VALUES
(
  'OpenAI GPT',
  'openai',
  'llm',
  'Connect to OpenAI''s GPT models for advanced language processing and conversation capabilities.',
  '/integrations/openai-logo.png',
  'https://platform.openai.com/docs/api-reference',
  '["api_access"]'::jsonb,
  '{
    "fields": [
      {
        "name": "api_key",
        "type": "string",
        "required": true,
        "label": "API Key",
        "description": "Your OpenAI API key from platform.openai.com"
      },
      {
        "name": "organization_id",
        "type": "string",
        "required": false,
        "label": "Organization ID",
        "description": "Optional organization ID for team accounts"
      }
    ]
  }'::jsonb,
  true
),
(
  'Anthropic Claude',
  'claude',
  'llm',
  'Integrate with Anthropic''s Claude AI for sophisticated reasoning and analysis capabilities.',
  '/integrations/claude-logo.png',
  'https://docs.anthropic.com/claude/reference',
  '["api_access"]'::jsonb,
  '{
    "fields": [
      {
        "name": "api_key",
        "type": "string",
        "required": true,
        "label": "API Key",
        "description": "Your Anthropic API key from console.anthropic.com"
      }
    ]
  }'::jsonb,
  true
),
(
  'Deepgram Speech-to-Text',
  'deepgram',
  'voice',
  'Connect to Deepgram for high-accuracy speech recognition and transcription services.',
  '/integrations/deepgram-logo.png',
  'https://developers.deepgram.com/docs',
  '["speech_recognition"]'::jsonb,
  '{
    "fields": [
      {
        "name": "api_key",
        "type": "string",
        "required": true,
        "label": "API Key",
        "description": "Your Deepgram API key from console.deepgram.com"
      },
      {
        "name": "model",
        "type": "select",
        "required": false,
        "label": "Model",
        "description": "Speech model to use",
        "options": ["nova-2", "enhanced", "base"],
        "default": "nova-2"
      }
    ]
  }'::jsonb,
  true
),
(
  'Google Gemini',
  'google-gemini',
  'llm',
  'Integrate with Google''s Gemini AI for multimodal AI capabilities including text, image, and code generation.',
  '/integrations/gemini-logo.png',
  'https://ai.google.dev/docs',
  '["ai_platform"]'::jsonb,
  '{
    "fields": [
      {
        "name": "api_key",
        "type": "string",
        "required": true,
        "label": "API Key",
        "description": "Your Google AI Studio API key"
      },
      {
        "name": "project_id",
        "type": "string",
        "required": false,
        "label": "Project ID",
        "description": "Google Cloud Project ID (optional)"
      }
    ]
  }'::jsonb,
  true
);
