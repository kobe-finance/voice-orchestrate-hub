
/**
 * Simple "dumb" API client for integration management
 * Contains zero business logic - only HTTP requests
 */
class IntegrationAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    return headers;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Fetches all available provider integrations
  async getIntegrations() {
    return this.makeRequest('/integrations');
  }

  // Fetches the JSON schema for a provider's credential form
  async getFormSchema(providerId: string) {
    return this.makeRequest(`/integrations/${providerId}/form-schema`);
  }

  // Creates a new credential for a tenant
  async addCredential(data: any) {
    return this.makeRequest('/integrations/credentials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Deletes a credential
  async deleteCredential(credentialId: string) {
    return this.makeRequest(`/integrations/credentials/${credentialId}`, {
      method: 'DELETE',
    });
  }

  // Tests a credential's validity
  async testCredential(credentialId: string) {
    return this.makeRequest(`/integrations/credentials/${credentialId}/test`, {
      method: 'POST',
    });
  }

  // Lists all credentials for the authenticated tenant
  async getCredentials() {
    return this.makeRequest('/integrations/credentials');
  }

  // Makes an API call through the orchestrator
  async dispatch(provider: string, operation: string, payload: any) {
    return this.makeRequest('/dispatch', {
      method: 'POST',
      body: JSON.stringify({ provider, operation, payload }),
    });
  }

  // Fetches usage analytics data
  async getUsageAnalytics(params: URLSearchParams) {
    return this.makeRequest(`/analytics/usage?${params.toString()}`);
  }

  // Provides recommendations for cost optimization
  async getCostAnalysis() {
    return this.makeRequest('/analytics/cost-analysis');
  }

  // Retrieves the configured quota limits for a credential
  async getCredentialQuota(credentialId: string) {
    return this.makeRequest(`/integrations/credentials/${credentialId}/quota`);
  }

  // Sets or updates the quota limits for a credential
  async setCredentialQuota(credentialId: string, quotaData: any) {
    return this.makeRequest(`/integrations/credentials/${credentialId}/quota`, {
      method: 'POST',
      body: JSON.stringify(quotaData),
    });
  }
}

// Export singleton instance
export const integrationAPI = new IntegrationAPI();
export default integrationAPI;
