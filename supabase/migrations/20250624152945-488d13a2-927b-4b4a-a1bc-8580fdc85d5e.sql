
-- Add the 8 missing integrations to complete the marketplace catalog
INSERT INTO public.integrations (name, slug, category, description, icon_url, documentation_url, required_scopes, config_schema, is_active) VALUES
-- LLM Providers
(
  'DeepSeek',
  'deepseek',
  'llm',
  'High-performance AI models optimized for reasoning and code generation tasks.',
  '/integrations/deepseek-logo.png',
  'https://platform.deepseek.com/docs',
  '["api_access"]'::jsonb,
  '{
    "fields": [
      {
        "name": "api_key",
        "type": "string",
        "required": true,
        "label": "API Key",
        "description": "Your DeepSeek API key from platform.deepseek.com"
      }
    ]
  }'::jsonb,
  true
),
(
  'Grok (xAI)',
  'grok',
  'llm',
  'Real-time AI with access to current information and witty conversational abilities.',
  '/integrations/grok-logo.png',
  'https://docs.x.ai/docs',
  '["api_access"]'::jsonb,
  '{
    "fields": [
      {
        "name": "api_key",
        "type": "string",
        "required": true,
        "label": "API Key",
        "description": "Your xAI API key from console.x.ai"
      }
    ]
  }'::jsonb,
  true
),
(
  'Meta Llama',
  'llama',
  'llm',
  'Open-source large language models for research and commercial applications.',
  '/integrations/llama-logo.png',
  'https://ai.meta.com/llama/docs',
  '["api_access"]'::jsonb,
  '{
    "fields": [
      {
        "name": "api_key",
        "type": "string",
        "required": true,
        "label": "API Key",
        "description": "Your Meta AI API key or endpoint access token"
      },
      {
        "name": "endpoint_url",
        "type": "string",
        "required": false,
        "label": "Endpoint URL",
        "description": "Custom endpoint URL if using hosted Llama service"
      }
    ]
  }'::jsonb,
  true
),
-- CRM Systems
(
  'Salesforce',
  'salesforce',
  'crm',
  'Connect your voice agents with Salesforce CRM for seamless customer data management.',
  '/integrations/salesforce-logo.png',
  'https://developer.salesforce.com/docs/apis',
  '["crm_access", "contacts", "opportunities"]'::jsonb,
  '{
    "fields": [
      {
        "name": "instance_url",
        "type": "string",
        "required": true,
        "label": "Instance URL",
        "description": "Your Salesforce instance URL (e.g., https://yourcompany.salesforce.com)"
      },
      {
        "name": "access_token",
        "type": "string",
        "required": true,
        "label": "Access Token",
        "description": "OAuth access token or session ID"
      },
      {
        "name": "refresh_token",
        "type": "string",
        "required": false,
        "label": "Refresh Token",
        "description": "OAuth refresh token for automatic token renewal"
      }
    ]
  }'::jsonb,
  true
),
(
  'HubSpot',
  'hubspot',
  'crm',
  'Integrate with HubSpot CRM to sync contacts, deals, and conversation logs automatically.',
  '/integrations/hubspot-logo.png',
  'https://developers.hubspot.com/docs/api/overview',
  '["crm_access", "contacts", "deals"]'::jsonb,
  '{
    "fields": [
      {
        "name": "api_key",
        "type": "string",
        "required": true,
        "label": "Private App Access Token",
        "description": "Your HubSpot private app access token"
      },
      {
        "name": "portal_id",
        "type": "string",
        "required": false,
        "label": "Portal ID",
        "description": "Your HubSpot portal ID (optional)"
      }
    ]
  }'::jsonb,
  true
),
-- Telephony
(
  'Twilio',
  'twilio',
  'telephony',
  'Cloud communications platform for voice, messaging, and video capabilities.',
  '/integrations/twilio-logo.png',
  'https://www.twilio.com/docs/usage/api',
  '["voice", "messaging", "phone_numbers"]'::jsonb,
  '{
    "fields": [
      {
        "name": "account_sid",
        "type": "string",
        "required": true,
        "label": "Account SID",
        "description": "Your Twilio Account SID from console.twilio.com"
      },
      {
        "name": "auth_token",
        "type": "string",
        "required": true,
        "label": "Auth Token",
        "description": "Your Twilio Auth Token"
      },
      {
        "name": "phone_number",
        "type": "string",
        "required": false,
        "label": "Phone Number",
        "description": "Your Twilio phone number (e.g., +1234567890)"
      }
    ]
  }'::jsonb,
  true
),
(
  'Vonage',
  'vonage',
  'telephony',
  'Global communications APIs for voice, video, and messaging applications.',
  '/integrations/vonage-logo.png',
  'https://developer.vonage.com/api',
  '["voice", "messaging", "verify"]'::jsonb,
  '{
    "fields": [
      {
        "name": "api_key",
        "type": "string",
        "required": true,
        "label": "API Key",
        "description": "Your Vonage API key from dashboard.nexmo.com"
      },
      {
        "name": "api_secret",
        "type": "string",
        "required": true,
        "label": "API Secret",
        "description": "Your Vonage API secret"
      },
      {
        "name": "application_id",
        "type": "string",
        "required": false,
        "label": "Application ID",
        "description": "Vonage Application ID for voice applications"
      }
    ]
  }'::jsonb,
  true
),
-- Voice Providers
(
  'ElevenLabs',
  'elevenlabs',
  'voice',
  'Ultra-realistic AI voice generation with emotional nuance and multiple languages.',
  '/integrations/elevenlabs-logo.png',
  'https://docs.elevenlabs.io/api-reference',
  '["tts", "voice_cloning"]'::jsonb,
  '{
    "fields": [
      {
        "name": "api_key",
        "type": "string",
        "required": true,
        "label": "API Key",
        "description": "Your ElevenLabs API key from elevenlabs.io/speech-synthesis"
      },
      {
        "name": "voice_id",
        "type": "select",
        "required": false,
        "label": "Default Voice",
        "description": "Default voice to use for synthesis",
        "options": ["9BWtsMINqrJLrRacOk9x", "CwhRBWXzGAHq8TQ4Fs17", "EXAVITQu4vr4xnSDxMaL", "FGY2WhTYpPnrIDTdsKH5"],
        "default": "9BWtsMINqrJLrRacOk9x"
      }
    ]
  }'::jsonb,
  true
);
