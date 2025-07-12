
/**
 * Base HTTP client for all API communications
 * Handles authentication, error handling, and request/response processing
 */

import { 
  APIClientError, 
  createAPIError, 
  handleAPIError 
} from './errors';

export interface APIConfig {
  baseURL: string;
  timeout?: number;
  retryAttempts?: number;
}

export interface APIErrorData {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode: number;
}

export class APIClient {
  private baseURL: string;
  private timeout: number;
  private retryAttempts: number;

  constructor(config?: Partial<APIConfig>) {
    this.baseURL = this.getBaseURL(config?.baseURL);
    this.timeout = config?.timeout || 30000;
    this.retryAttempts = config?.retryAttempts || 1; // Reduce retries for development
    
    console.log('APIClient initialized with baseURL:', this.baseURL);
  }

  private getBaseURL(override?: string): string {
    if (override) return override;
    
    // Always use localhost for development - the backend should be running locally
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

  private async makeRequest<T>(
    method: string,
    endpoint: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = await this.getAuthHeaders();
    const url = `${this.baseURL}${endpoint}`;
    
    console.log(`API ${method} request to:`, url);
    
    const config: RequestInit = {
      method,
      headers: {
        ...headers,
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout),
      ...options,
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw createAPIError(
          response.status,
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          errorData.code,
          errorData.details
        );
      }

      // Handle empty responses (like DELETE)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      const handledError = handleAPIError(error);
      console.error(`API ${method} ${endpoint} failed:`, handledError);
      
      // Provide helpful error messages for common issues
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new APIClientError(
          0,
          'NETWORK_ERROR',
          'Unable to connect to server. Please check your internet connection.',
          { originalError: error.message }
        );
      }
      
      throw handledError;
    }
  }

  private async parseErrorResponse(response: Response): Promise<Partial<APIErrorData>> {
    try {
      const text = await response.text();
      if (!text) return {};
      
      const data = JSON.parse(text);
      return {
        code: data.code || 'UNKNOWN_ERROR',
        message: data.message || data.detail || 'An error occurred',
        details: data.details || data
      };
    } catch {
      return {
        message: response.statusText || 'Unknown error occurred'
      };
    }
  }

  // HTTP methods
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.makeRequest<T>('GET', endpoint, undefined, options);
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.makeRequest<T>('POST', endpoint, data, options);
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.makeRequest<T>('PUT', endpoint, data, options);
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.makeRequest<T>('PATCH', endpoint, data, options);
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.makeRequest<T>('DELETE', endpoint, undefined, options);
  }
}

// Global API client instance
export const apiClient = new APIClient();
