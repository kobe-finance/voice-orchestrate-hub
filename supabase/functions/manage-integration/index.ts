
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InstallRequest {
  action: 'install';
  integration_id: string;
  credential_id: string;
}

interface UninstallRequest {
  action: 'uninstall';
  user_integration_id: string;
}

type ManageRequest = InstallRequest | UninstallRequest;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Get user from auth token
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Invalid authentication')
    }

    const request: ManageRequest = await req.json()

    if (request.action === 'install') {
      // Verify credential belongs to user
      const { data: credential, error: credentialError } = await supabase
        .from('integration_credentials')
        .select('*, integration:integrations(*)')
        .eq('id', request.credential_id)
        .eq('user_id', user.id)
        .single()

      if (credentialError || !credential) {
        throw new Error('Credential not found or unauthorized')
      }

      // Check if integration is already installed
      const { data: existingInstallation } = await supabase
        .from('user_integrations')
        .select('id')
        .eq('user_id', user.id)
        .eq('integration_id', request.integration_id)
        .single()

      if (existingInstallation) {
        throw new Error('Integration already installed')
      }

      // Create user integration
      const { data: userIntegration, error: installError } = await supabase
        .from('user_integrations')
        .insert({
          user_id: user.id,
          integration_id: request.integration_id,
          credential_id: request.credential_id,
          status: 'installing',
          installed_by: user.id,
          installed_at: new Date().toISOString()
        })
        .select()
        .single()

      if (installError) {
        throw new Error(`Failed to install integration: ${installError.message}`)
      }

      // Perform integration-specific setup
      try {
        await setupIntegration(credential.integration.slug, credential.encrypted_credentials, user.id)
        
        // Update status to active
        await supabase
          .from('user_integrations')
          .update({ 
            status: 'active',
            installed_at: new Date().toISOString()
          })
          .eq('id', userIntegration.id)

      } catch (setupError) {
        // Update status to error
        await supabase
          .from('user_integrations')
          .update({ 
            status: 'error',
            metadata: { 
              error: setupError instanceof Error ? setupError.message : 'Setup failed' 
            }
          })
          .eq('id', userIntegration.id)

        throw setupError
      }

      // Log the installation
      await supabase
        .from('integration_audit_log')
        .insert({
          user_id: user.id,
          integration_id: request.integration_id,
          action: 'install',
          details: { credential_id: request.credential_id }
        })

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Integration installed successfully',
          user_integration_id: userIntegration.id 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else if (request.action === 'uninstall') {
      // Verify user integration belongs to user
      const { data: userIntegration, error: userIntegrationError } = await supabase
        .from('user_integrations')
        .select('*, integration:integrations(*)')
        .eq('id', request.user_integration_id)
        .eq('user_id', user.id)
        .single()

      if (userIntegrationError || !userIntegration) {
        throw new Error('User integration not found or unauthorized')
      }

      // Perform integration-specific cleanup
      try {
        await cleanupIntegration(userIntegration.integration.slug, user.id)
      } catch (cleanupError) {
        console.warn('Cleanup failed:', cleanupError)
        // Continue with uninstall even if cleanup fails
      }

      // Delete user integration
      const { error: deleteError } = await supabase
        .from('user_integrations')
        .delete()
        .eq('id', request.user_integration_id)

      if (deleteError) {
        throw new Error(`Failed to uninstall integration: ${deleteError.message}`)
      }

      // Log the uninstallation
      await supabase
        .from('integration_audit_log')
        .insert({
          user_id: user.id,
          integration_id: userIntegration.integration_id,
          action: 'uninstall',
          details: { user_integration_id: request.user_integration_id }
        })

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Integration uninstalled successfully' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error('Invalid action')

  } catch (error) {
    console.error('Error managing integration:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

// Integration-specific setup functions
async function setupIntegration(integrationSlug: string, credentials: any, userId: string) {
  switch (integrationSlug) {
    case 'openai':
    case 'claude':
    case 'deepgram':
    case 'google-gemini':
    case 'deepseek':
    case 'grok':
    case 'llama':
    case 'elevenlabs':
      // LLM and Voice providers typically don't require special setup
      console.log(`Setting up ${integrationSlug} for user ${userId}`)
      break

    case 'salesforce':
      // Could initialize webhook subscriptions, etc.
      console.log(`Setting up Salesforce integration for user ${userId}`)
      break

    case 'hubspot':
      // Could initialize webhook subscriptions, etc.
      console.log(`Setting up HubSpot integration for user ${userId}`)
      break

    case 'twilio':
      // Could configure webhooks, phone numbers, etc.
      console.log(`Setting up Twilio integration for user ${userId}`)
      break

    case 'vonage':
      // Could configure webhooks, applications, etc.
      console.log(`Setting up Vonage integration for user ${userId}`)
      break

    default:
      console.log(`No specific setup required for ${integrationSlug}`)
  }
}

async function cleanupIntegration(integrationSlug: string, userId: string) {
  switch (integrationSlug) {
    case 'salesforce':
    case 'hubspot':
    case 'twilio':
    case 'vonage':
      // Could remove webhooks, subscriptions, etc.
      console.log(`Cleaning up ${integrationSlug} for user ${userId}`)
      break

    default:
      console.log(`No specific cleanup required for ${integrationSlug}`)
  }
}
