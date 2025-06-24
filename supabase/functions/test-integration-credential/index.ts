
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TestCredentialRequest {
  credential_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { credential_id }: TestCredentialRequest = await req.json()

    // Get the credential and integration details
    const { data: credential, error: credentialError } = await supabase
      .from('integration_credentials')
      .select(`
        *,
        integration:integrations(*)
      `)
      .eq('id', credential_id)
      .single()

    if (credentialError || !credential) {
      throw new Error('Credential not found')
    }

    const integration = credential.integration
    const credentials = credential.encrypted_credentials
    const startTime = Date.now()

    // Update status to testing
    await supabase
      .from('integration_credentials')
      .update({
        last_test_status: 'testing',
        last_tested_at: new Date().toISOString()
      })
      .eq('id', credential_id)

    let testResult: { success: boolean; error?: string; responseTime?: number } = {
      success: false
    }

    try {
      // Test based on integration type
      switch (integration.slug) {
        case 'openai':
          testResult = await testOpenAI(credentials)
          break
        case 'claude':
          testResult = await testClaude(credentials)
          break
        case 'deepgram':
          testResult = await testDeepgram(credentials)
          break
        case 'google-gemini':
          testResult = await testGemini(credentials)
          break
        case 'deepseek':
          testResult = await testDeepSeek(credentials)
          break
        case 'grok':
          testResult = await testGrok(credentials)
          break
        case 'llama':
          testResult = await testLlama(credentials)
          break
        case 'salesforce':
          testResult = await testSalesforce(credentials)
          break
        case 'hubspot':
          testResult = await testHubSpot(credentials)
          break
        case 'twilio':
          testResult = await testTwilio(credentials)
          break
        case 'vonage':
          testResult = await testVonage(credentials)
          break
        case 'elevenlabs':
          testResult = await testElevenLabs(credentials)
          break
        default:
          throw new Error(`Testing not implemented for integration: ${integration.slug}`)
      }

      testResult.responseTime = Date.now() - startTime

      // Update credential with test result
      await supabase
        .from('integration_credentials')
        .update({
          last_test_status: testResult.success ? 'success' : 'failed',
          last_test_error: testResult.error ? { message: testResult.error } : null,
          last_tested_at: new Date().toISOString()
        })
        .eq('id', credential_id)

      // Log the test result
      await supabase
        .from('integration_test_logs')
        .insert({
          credential_id,
          test_type: 'connection',
          status: testResult.success ? 'success' : 'failed',
          response_time_ms: testResult.responseTime,
          error_details: testResult.error ? { message: testResult.error } : null,
          tested_by: credential.user_id
        })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      // Update credential with error
      await supabase
        .from('integration_credentials')
        .update({
          last_test_status: 'failed',
          last_test_error: { message: errorMessage },
          last_tested_at: new Date().toISOString()
        })
        .eq('id', credential_id)

      testResult = { success: false, error: errorMessage, responseTime: Date.now() - startTime }
    }

    return new Response(
      JSON.stringify({
        success: testResult.success,
        message: testResult.success ? 'Connection test successful' : testResult.error,
        responseTime: testResult.responseTime
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error testing credential:', error)
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

// Test function implementations
async function testOpenAI(credentials: any) {
  const response = await fetch('https://api.openai.com/v1/models', {
    headers: {
      'Authorization': `Bearer ${credentials.api_key}`,
      ...(credentials.organization_id && { 'OpenAI-Organization': credentials.organization_id })
    }
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API error: ${error}`)
  }

  return { success: true }
}

async function testClaude(credentials: any) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': credentials.api_key,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1,
      messages: [{ role: 'user', content: 'test' }]
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Claude API error: ${error}`)
  }

  return { success: true }
}

async function testDeepgram(credentials: any) {
  const response = await fetch('https://api.deepgram.com/v1/projects', {
    headers: {
      'Authorization': `Token ${credentials.api_key}`
    }
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Deepgram API error: ${error}`)
  }

  return { success: true }
}

async function testGemini(credentials: any) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${credentials.api_key}`)

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini API error: ${error}`)
  }

  return { success: true }
}

async function testDeepSeek(credentials: any) {
  const response = await fetch('https://api.deepseek.com/v1/models', {
    headers: {
      'Authorization': `Bearer ${credentials.api_key}`
    }
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`DeepSeek API error: ${error}`)
  }

  return { success: true }
}

async function testGrok(credentials: any) {
  const response = await fetch('https://api.x.ai/v1/models', {
    headers: {
      'Authorization': `Bearer ${credentials.api_key}`
    }
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Grok API error: ${error}`)
  }

  return { success: true }
}

async function testLlama(credentials: any) {
  const baseUrl = credentials.endpoint_url || 'https://api.together.xyz/v1'
  const response = await fetch(`${baseUrl}/models`, {
    headers: {
      'Authorization': `Bearer ${credentials.api_key}`
    }
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Llama API error: ${error}`)
  }

  return { success: true }
}

async function testSalesforce(credentials: any) {
  const response = await fetch(`${credentials.instance_url}/services/data/v59.0/limits`, {
    headers: {
      'Authorization': `Bearer ${credentials.access_token}`
    }
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Salesforce API error: ${error}`)
  }

  return { success: true }
}

async function testHubSpot(credentials: any) {
  const response = await fetch('https://api.hubapi.com/account-info/v3/details', {
    headers: {
      'Authorization': `Bearer ${credentials.api_key}`
    }
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`HubSpot API error: ${error}`)
  }

  return { success: true }
}

async function testTwilio(credentials: any) {
  const auth = btoa(`${credentials.account_sid}:${credentials.auth_token}`)
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${credentials.account_sid}.json`, {
    headers: {
      'Authorization': `Basic ${auth}`
    }
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Twilio API error: ${error}`)
  }

  return { success: true }
}

async function testVonage(credentials: any) {
  const response = await fetch(`https://rest.nexmo.com/account/get-balance?api_key=${credentials.api_key}&api_secret=${credentials.api_secret}`)

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Vonage API error: ${error}`)
  }

  return { success: true }
}

async function testElevenLabs(credentials: any) {
  const response = await fetch('https://api.elevenlabs.io/v1/user', {
    headers: {
      'xi-api-key': credentials.api_key
    }
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`ElevenLabs API error: ${error}`)
  }

  return { success: true }
}
