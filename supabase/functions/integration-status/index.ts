
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StatusRequest {
  integration_id: string
  tenant_id?: string
}

interface IntegrationStatus {
  status: 'not_configured' | 'untested' | 'active' | 'error' | 'quota_exceeded'
  message: string
  last_tested_at?: string
  error_details?: any
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

    const { integration_id, tenant_id }: StatusRequest = await req.json()

    if (!integration_id) {
      return new Response(
        JSON.stringify({ error: 'integration_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's tenant
    const { data: orgMemberships } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1)

    if (!orgMemberships || orgMemberships.length === 0) {
      return new Response(
        JSON.stringify({ error: 'User not associated with any organization' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userTenantId = orgMemberships[0].organization_id

    // Compute integration status
    const status = await computeIntegrationStatus(supabase, userTenantId, integration_id)

    return new Response(
      JSON.stringify(status),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Status computation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function computeIntegrationStatus(
  supabase: any,
  tenantId: string,
  integrationId: string
): Promise<IntegrationStatus> {
  
  // Check if credentials exist
  const { data: credentials, error: credError } = await supabase
    .from('integration_credentials')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('integration_id', integrationId)
    .order('created_at', { ascending: false })

  if (credError) {
    return {
      status: 'error',
      message: `Database error: ${credError.message}`
    }
  }

  if (!credentials || credentials.length === 0) {
    return {
      status: 'not_configured',
      message: 'No credentials found for this integration'
    }
  }

  const latestCredential = credentials[0]

  // Check last test results
  if (!latestCredential.last_tested_at) {
    return {
      status: 'untested',
      message: 'Credentials have not been tested yet'
    }
  }

  if (latestCredential.last_test_status === 'failed') {
    return {
      status: 'error',
      message: latestCredential.last_test_error?.message || 'Last connection test failed',
      last_tested_at: latestCredential.last_tested_at,
      error_details: latestCredential.last_test_error
    }
  }

  if (latestCredential.last_test_status === 'success') {
    // Check if credentials might be expired (if we have expiry info)
    if (latestCredential.expires_at) {
      const expiryDate = new Date(latestCredential.expires_at)
      const now = new Date()
      
      if (expiryDate <= now) {
        return {
          status: 'error',
          message: 'Credentials have expired',
          last_tested_at: latestCredential.last_tested_at
        }
      }
    }

    // Check recent usage for quota limits
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: usage } = await supabase
      .from('api_usage_logs')
      .select('tokens_used, cost_cents')
      .eq('credential_id', latestCredential.id)
      .gte('created_at', thirtyDaysAgo.toISOString())

    // Basic quota check (this would be more sophisticated in production)
    if (usage && usage.length > 0) {
      const totalTokens = usage.reduce((sum: number, log: any) => sum + (log.tokens_used || 0), 0)
      const totalCost = usage.reduce((sum: number, log: any) => sum + (log.cost_cents || 0), 0)

      // Simple quota limits (would be configurable per tenant)
      const MONTHLY_TOKEN_LIMIT = 1000000 // 1M tokens
      const MONTHLY_COST_LIMIT = 10000   // $100

      if (totalTokens > MONTHLY_TOKEN_LIMIT) {
        return {
          status: 'quota_exceeded',
          message: `Monthly token quota exceeded (${totalTokens.toLocaleString()} tokens used)`,
          last_tested_at: latestCredential.last_tested_at
        }
      }

      if (totalCost > MONTHLY_COST_LIMIT) {
        return {
          status: 'quota_exceeded',
          message: `Monthly cost quota exceeded ($${(totalCost / 100).toFixed(2)} spent)`,
          last_tested_at: latestCredential.last_tested_at
        }
      }
    }

    return {
      status: 'active',
      message: 'Integration is active and ready to use',
      last_tested_at: latestCredential.last_tested_at
    }
  }

  return {
    status: 'error',
    message: 'Unknown status',
    last_tested_at: latestCredential.last_tested_at
  }
}
