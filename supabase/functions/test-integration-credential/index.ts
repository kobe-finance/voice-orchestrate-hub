
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
    const { credential_id } = await req.json();

    if (!credential_id) {
      throw new Error('credential_id is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the credential with integration details
    const { data: credential, error: credentialError } = await supabase
      .from('integration_credentials')
      .select(`
        *,
        integration:integrations(*)
      `)
      .eq('id', credential_id)
      .single();

    if (credentialError || !credential) {
      throw new Error('Credential not found');
    }

    const startTime = Date.now();
    let testResult = { success: false, error: null, responseTimeMs: 0 };

    try {
      // Test the credential based on integration type
      const integration = credential.integration;
      const credentials = credential.encrypted_credentials as Record<string, string>;

      switch (integration.slug) {
        case 'openai':
          testResult = await testOpenAICredential(credentials);
          break;
        case 'claude':
          testResult = await testClaudeCredential(credentials);
          break;
        case 'deepgram':
          testResult = await testDeepgramCredential(credentials);
          break;
        case 'google-gemini':
          testResult = await testGeminiCredential(credentials);
          break;
        default:
          throw new Error(`Testing not implemented for ${integration.name}`);
      }

      testResult.responseTimeMs = Date.now() - startTime;
    } catch (error) {
      testResult = {
        success: false,
        error: error.message,
        responseTimeMs: Date.now() - startTime
      };
    }

    // Update credential test status
    const { error: updateError } = await supabase
      .from('integration_credentials')
      .update({
        last_tested_at: new Date().toISOString(),
        last_test_status: testResult.success ? 'success' : 'failed',
        last_test_error: testResult.error ? { message: testResult.error } : null
      })
      .eq('id', credential_id);

    if (updateError) {
      console.error('Error updating credential status:', updateError);
    }

    // Log the test result
    const { error: logError } = await supabase
      .from('integration_test_logs')
      .insert({
        credential_id,
        test_type: 'connection_test',
        status: testResult.success ? 'success' : 'failed',
        response_time_ms: testResult.responseTimeMs,
        error_details: testResult.error ? { message: testResult.error } : null,
        tested_by: credential.user_id
      });

    if (logError) {
      console.error('Error logging test result:', logError);
    }

    return new Response(
      JSON.stringify({
        success: testResult.success,
        responseTimeMs: testResult.responseTimeMs,
        error: testResult.error
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in test-integration-credential:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Test functions for each integration
async function testOpenAICredential(credentials: Record<string, string>) {
  const response = await fetch('https://api.openai.com/v1/models', {
    headers: {
      'Authorization': `Bearer ${credentials.api_key}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API test failed');
  }

  return { success: true, error: null, responseTimeMs: 0 };
}

async function testClaudeCredential(credentials: Record<string, string>) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': credentials.api_key,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Test' }]
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Claude API test failed');
  }

  return { success: true, error: null, responseTimeMs: 0 };
}

async function testDeepgramCredential(credentials: Record<string, string>) {
  const response = await fetch('https://api.deepgram.com/v1/projects', {
    headers: {
      'Authorization': `Token ${credentials.api_key}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Deepgram API test failed');
  }

  return { success: true, error: null, responseTimeMs: 0 };
}

async function testGeminiCredential(credentials: Record<string, string>) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${credentials.api_key}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Gemini API test failed');
  }

  return { success: true, error: null, responseTimeMs: 0 };
}
