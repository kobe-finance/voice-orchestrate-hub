
import { supabase } from '@/integrations/supabase/client';

interface BackendUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
  isEmailVerified: boolean;
}

interface BackendResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class BackendService {
  private baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-api.com/api/v1' 
    : 'http://localhost:8000/api/v1';

  private async getAuthHeaders(): Promise<Record<string, string>> {
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
  ): Promise<BackendResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
          data: undefined,
        };
      }

      return { data };
    } catch (error) {
      console.error('Backend service error:', error);
      return {
        error: error instanceof Error ? error.message : 'Network error occurred',
        data: undefined,
      };
    }
  }

  // User Profile Methods
  async getUserProfile(): Promise<BackendResponse<BackendUser>> {
    return this.makeRequest<BackendUser>('/users/me');
  }

  async updateUserProfile(updates: Partial<BackendUser>): Promise<BackendResponse<BackendUser>> {
    return this.makeRequest<BackendUser>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Business Logic Methods (examples)
  async getUserDashboardData(): Promise<BackendResponse<any>> {
    return this.makeRequest<any>('/dashboard');
  }

  async getVoiceAgents(): Promise<BackendResponse<any[]>> {
    return this.makeRequest<any[]>('/voice-agents');
  }

  async createVoiceAgent(agentData: any): Promise<BackendResponse<any>> {
    return this.makeRequest<any>('/voice-agents', {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
  }

  // Health check to verify backend connectivity
  async healthCheck(): Promise<BackendResponse<{ status: string }>> {
    return this.makeRequest<{ status: string }>('/health');
  }
}

export const backendService = new BackendService();
export type { BackendUser, BackendResponse };
