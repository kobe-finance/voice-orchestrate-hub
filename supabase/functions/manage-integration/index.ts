
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, integration_id, credential_id, user_integration_id, config } = await req.json();

    if (!action) {
      throw new Error('action is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid authentication');
    }

    let result;

    switch (action) {
      case 'install':
        result = await installIntegration(supabase, user.id, integration_id, credential_id, config);
        break;
      case 'uninstall':
        result = await uninstallIntegration(supabase, user.id, user_integration_id);
        break;
      case 'pause':
        result = await pauseIntegration(supabase, user.id, user_integration_id);
        break;
      case 'resume':
        result = await resumeIntegration(supabase, user.id, user_integration_id);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Log the action
    await supabase.from('integration_audit_log').insert({
      user_id: user.id,
      integration_id,
      action,
      details: { credential_id, user_integration_id, config },
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent') || 'unknown'
    });

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in manage-integration:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function installIntegration(supabase: any, userId: string, integrationId: string, credentialId: string, config: any) {
  // Verify the credential belongs to the user and is working
  const { data: credential, error: credentialError } = await supabase
    .from('integration_credentials')
    .select('*')
    .eq('id', credentialId)
    .eq('user_id', userId)
    .eq('last_test_status', 'success')
    .single();

  if (credentialError || !credential) {
    throw new Error('Valid credential required for installation');
  }

  // Check if integration is already installed
  const { data: existing } = await supabase
    .from('user_integrations')
    .select('id')
    .eq('user_id', userId)
    .eq('integration_id', integrationId)
    .single();

  if (existing) {
    throw new Error('Integration already installed');
  }

  // Install the integration
  const { data, error } = await supabase
    .from('user_integrations')
    .insert({
      user_id: userId,
      integration_id: integrationId,
      credential_id: credentialId,
      status: 'active',
      config: config || {},
      installed_at: new Date().toISOString(),
      installed_by: userId
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to install integration: ${error.message}`);
  }

  return { success: true, user_integration: data };
}

async function uninstallIntegration(supabase: any, userId: string, userIntegrationId: string) {
  // Verify the integration belongs to the user
  const { data: integration, error: integrationError } = await supabase
    .from('user_integrations')
    .select('*')
    .eq('id', userIntegrationId)
    .eq('user_id', userId)
    .single();

  if (integrationError || !integration) {
    throw new Error('Integration not found or access denied');
  }

  // Delete the integration
  const { error } = await supabase
    .from('user_integrations')
    .delete()
    .eq('id', userIntegrationId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to uninstall integration: ${error.message}`);
  }

  return { success: true, message: 'Integration uninstalled successfully' };
}

async function pauseIntegration(supabase: any, userId: string, userIntegrationId: string) {
  const { data, error } = await supabase
    .from('user_integrations')
    .update({ status: 'paused' })
    .eq('id', userIntegrationId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to pause integration: ${error.message}`);
  }

  return { success: true, user_integration: data };
}

async function resumeIntegration(supabase: any, userId: string, userIntegrationId: string) {
  const { data, error } = await supabase
    .from('user_integrations')
    .update({ status: 'active' })
    .eq('id', userIntegrationId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to resume integration: ${error.message}`);
  }

  return { success: true, user_integration: data };
}
