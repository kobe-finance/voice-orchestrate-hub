
/**
 * Simple Integration API Client
 * This replaces direct Supabase queries with backend API calls
 */

interface ApiResponse<T> {
  data?: T
  error?: string
}

interface FormField {
  name: string
  type: string
  label: string
  placeholder?: string
  validation?: {
    required?: boolean
    pattern?: string
    minLength?: number
    message: string
  }
}

interface FormSchema {
  integration_id: string
  fields: FormField[]
}

interface IntegrationStatus {
  status: 'not_configured' | 'untested' | 'active' | 'error' | 'quota_exceeded'
  message: string
  last_tested_at?: string
  error_details?: any
}

class IntegrationAPIClient {
  private baseURL: string
  private supabaseUrl: string
  private supabaseAnonKey: string

  constructor() {
    // Use Supabase project URL for edge functions
    this.supabaseUrl = 'https://cdhihqaylf......supabase.co'
    this.supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    this.baseURL = `${this.supabaseUrl}/functions/v1`
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    // Get current session token
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

  // Get dynamic form schema for an integration
  async getFormSchema(integrationId: string): Promise<FormSchema> {
    return this.request<FormSchema>(`/integration-form-schema/${integrationId}`)
  }

  // Compute integration status using backend logic
  async computeStatus(integrationId: string): Promise<IntegrationStatus> {
    return this.request<IntegrationStatus>('/integration-status', {
      method: 'POST',
      body: JSON.stringify({ integration_id: integrationId }),
    })
  }

  // Test credential (existing function)
  async testCredential(credentialId: string): Promise<{ success: boolean; message?: string }> {
    return this.request<{ success: boolean; message?: string }>('/test-integration-credential', {
      method: 'POST',
      body: JSON.stringify({ credential_id: credentialId }),
    })
  }
}

export const integrationAPI = new IntegrationAPIClient()
