
/**
 * Backend Service - Simplified API client
 * Handles communication with the FastAPI backend
 */

import { supabase } from '@/integrations/supabase/client';

// Use consistent localhost URL for development
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

console.log('Backend service configured for:', API_BASE_URL);

export interface BackendUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

class BackendService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
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

  private async makeRequest<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<T> {
    const headers = await this.getAuthHeaders();
    const url = `${this.baseURL}${endpoint}`;
    
    console.log(`Making ${method} request to:`, url);

    try {
      const config: RequestInit = {
        method,
        headers,
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Handle empty responses
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error('Backend service error:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to backend server. Make sure it\'s running on http://127.0.0.1:8000');
      }
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.makeRequest<{ status: string }>('GET', '/health');
  }

  // User profile
  async getUserProfile(): Promise<BackendUser> {
    return this.makeRequest<BackendUser>('GET', '/users/me');
  }

  // Update user profile
  async updateUserProfile(updates: Partial<BackendUser>): Promise<BackendUser> {
    return this.makeRequest<BackendUser>('PUT', '/users/me', updates);
  }
}

export const backendService = new BackendService();
