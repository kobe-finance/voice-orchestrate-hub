
/**
 * Integration API Client - Updated to work with current architecture
 */

import { IntegrationFormSchema } from '@/types/integration.types';

interface ApiResponse<T> {
  data?: T
  error?: string
}

class IntegrationAPIClient {
  private baseURL: string
  private supabaseUrl: string
  private supabaseAnonKey: string

  constructor() {
    this.supabaseUrl = 'https://cdhihqaylfogoztunvkab.supabase.co'
    this.supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkaGlocWF5bGZnb3p0dW52a2FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNDYwNDMsImV4cCI6MjA2NTgyMjA0M30.DddaHYS36l6jc17-_l_JoLKJ9BoCuzVZDGgv9pb20Us'
    this.baseURL = `${this.supabaseUrl}/functions/v1`
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const { supabase } = await import('@/integrations/supabase/client')
    const { data: { session } } = await supabase.auth.getSession()
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token || this.supabaseAnonKey}`,
      'apikey': this.supabaseAnonKey,
    }
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers = await this.getAuthHeaders()
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async getIntegrations(): Promise<any[]> {
    const { supabase } = await import('@/integrations/supabase/client')
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('is_active', true)
    
    if (error) throw error
    return data || []
  }

  async getCredentials(): Promise<any[]> {
    const { supabase } = await import('@/integrations/supabase/client')
    const { data, error } = await supabase
      .from('integration_credentials')
      .select('*')
    
    if (error) throw error
    return data || []
  }

  async getFormSchema(integrationId: string): Promise<IntegrationFormSchema> {
    return this.request<IntegrationFormSchema>(`/integration-form-schema/${integrationId}`)
  }

  async createCredential(data: any) {
    const { supabase } = await import('@/integrations/supabase/client')
    const { data: result, error } = await supabase
      .from('integration_credentials')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  async testCredential(credentialId: string): Promise<{ success: boolean; message?: string }> {
    return this.request('/test-integration-credential', {
      method: 'POST',
      body: JSON.stringify({ credential_id: credentialId }),
    })
  }

  async computeStatus(integrationId: string) {
    return this.request('/integration-status', {
      method: 'POST',
      body: JSON.stringify({ integration_id: integrationId }),
    })
  }
}

export const integrationAPI = new IntegrationAPIClient()
