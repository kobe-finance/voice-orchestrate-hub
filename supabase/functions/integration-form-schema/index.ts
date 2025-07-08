
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const integrationId = url.pathname.split('/').pop()

    if (!integrationId) {
      return new Response(
        JSON.stringify({ error: 'Integration ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get integration details
    const { data: integration, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('id', integrationId)
      .single()

    if (error || !integration) {
      return new Response(
        JSON.stringify({ error: 'Integration not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate form schema based on integration type
    const formSchema = generateFormSchema(integration)

    return new Response(
      JSON.stringify({
        integration_id: integrationId,
        fields: formSchema
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Form schema error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function generateFormSchema(integration: any): any[] {
  const baseFields = [
    {
      name: 'credential_name',
      type: 'text',
      label: 'Credential Name',
      placeholder: `My ${integration.name} Key`,
      validation: {
        required: true,
        minLength: 3,
        message: 'Credential name must be at least 3 characters'
      }
    }
  ]

  // Add integration-specific fields based on auth_type and slug
  switch (integration.slug) {
    case 'openai':
      baseFields.push({
        name: 'api_key',
        type: 'password',
        label: 'API Key',
        placeholder: 'sk-...',
        validation: {
          required: true,
          pattern: '^sk-[a-zA-Z0-9]{48}$',
          message: 'Must be a valid OpenAI API key starting with sk-'
        }
      })
      break

    case 'salesforce':
      baseFields.push(
        {
          name: 'access_token',
          type: 'password',
          label: 'Access Token',
          placeholder: 'Enter your Salesforce access token',
          validation: {
            required: true,
            message: 'Access token is required'
          }
        },
        {
          name: 'instance_url',
          type: 'url',
          label: 'Instance URL',
          placeholder: 'https://your-instance.salesforce.com',
          validation: {
            required: true,
            pattern: '^https://.*\\.salesforce\\.com$',
            message: 'Must be a valid Salesforce instance URL'
          }
        }
      )
      break

    case 'hubspot':
      baseFields.push({
        name: 'api_key',
        type: 'password',
        label: 'API Key',
        placeholder: 'pat-na1-...',
        validation: {
          required: true,
          pattern: '^pat-[a-z0-9-]+$',
          message: 'Must be a valid HubSpot private app token'
        }
      })
      break

    case 'twilio':
      baseFields.push(
        {
          name: 'account_sid',
          type: 'text',
          label: 'Account SID',
          placeholder: 'AC...',
          validation: {
            required: true,
            pattern: '^AC[a-z0-9]{32}$',
            message: 'Must be a valid Twilio Account SID'
          }
        },
        {
          name: 'auth_token',
          type: 'password',
          label: 'Auth Token',
          placeholder: 'Your auth token',
          validation: {
            required: true,
            minLength: 32,
            message: 'Auth token must be at least 32 characters'
          }
        }
      )
      break

    default:
      // Generic API key field for unknown integrations
      baseFields.push({
        name: 'api_key',
        type: 'password',
        label: 'API Key',
        placeholder: 'Enter your API key',
        validation: {
          required: true,
          message: 'API key is required'
        }
      })
  }

  return baseFields
}
