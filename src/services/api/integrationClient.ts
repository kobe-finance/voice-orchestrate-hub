
/**
 * Simple "dumb" API client for integration management
 * Contains zero business logic - only HTTP requests
 */
class IntegrationAPI {
  private baseURL: string;

  constructor() {
    // Try different possible backend URLs
    this.baseURL = this.getBackendURL();
    console.log('IntegrationAPI initialized with baseURL:', this.baseURL);
  }

  private getBackendURL(): string {
    // Check environment variable first
    if (import.meta.env.VITE_API_BASE_URL) {
      return import.meta.env.VITE_API_BASE_URL;
    }
    
    // For development, try different common patterns
    const currentHost = window.location.host;
    
    // If we're on a preview URL, try the same domain with /api/v1
    if (currentHost.includes('lovable.app')) {
      return `${window.location.protocol}//${currentHost}/api/v1`;
    }
    
    // Default to localhost for development
    return 'http://127.0.0.1:8000/api/v1';
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      return headers;
    } catch (error) {
      console.warn('Failed to get auth headers:', error);
      return {
        'Content-Type': 'application/json',
      };
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = await this.getAuthHeaders();
    const url = `${this.baseURL}${endpoint}`;
    
    console.log(`Making request to: ${url}`);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP ${response.status} for ${url}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Successful response from ${url}:`, data);
      return data;
    } catch (error) {
      console.error(`Request failed for ${url}:`, error);
      
      // Provide more helpful error messages
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to backend at ${url}. Please check if the backend server is running.`);
      }
      
      throw error;
    }
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
