
interface ApiResponse<T> {
  data: T;
  error: string | null;
}

interface Integration {
  id: string;
  name: string;
  slug: string;
  auth_type: string;
  description?: string;
  logo_url?: string;
}

interface IntegrationCredential {
  credential_id: string;
  integration_id: string;
  credential_name: string;
  last_test_status: 'success' | 'failed' | 'untested';
  created_at?: string;
  updated_at?: string;
}

interface CreateCredentialRequest {
  integration_id: string;
  credential_name: string;
  credentials: Record<string, string>;
}

interface TestCredentialResponse {
  status: 'success' | 'failed';
  error_details: string | null;
}

class CredentialService {
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

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    // Handle HTTP errors
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result: ApiResponse<T> = await response.json();
    
    // Handle application-level errors
    if (result.error) {
      throw new Error(result.error);
    }

    return result.data;
  }

  async getAvailableIntegrations(): Promise<Integration[]> {
    return this.makeRequest<Integration[]>('/integrations/');
  }

  async getUserCredentials(): Promise<IntegrationCredential[]> {
    return this.makeRequest<IntegrationCredential[]>('/integrations/credentials/');
  }

  async createCredential(data: CreateCredentialRequest): Promise<IntegrationCredential> {
    return this.makeRequest<IntegrationCredential>('/integrations/credentials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async testCredential(credentialId: string): Promise<TestCredentialResponse> {
    return this.makeRequest<TestCredentialResponse>(`/integrations/credentials/test/${credentialId}`, {
      method: 'POST',
    });
  }

  async deleteCredential(credentialId: string): Promise<void> {
    await this.makeRequest<void>(`/integrations/credentials/${credentialId}`, {
      method: 'DELETE',
    });
  }
}

export const credentialService = new CredentialService();
export type { Integration, IntegrationCredential, CreateCredentialRequest, TestCredentialResponse };
