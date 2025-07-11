/**
 * Base HTTP client for all API communications
 * Handles authentication, error handling, and request/response processing
 */

export interface APIConfig {
  baseURL: string;
  timeout?: number;
  retryAttempts?: number;
}

export interface APIError {
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
    this.retryAttempts = config?.retryAttempts || 3;
  }

  private getBaseURL(override?: string): string {
    if (override) return override;
    
    // For development, use localhost
    if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
      return 'http://127.0.0.1:8000/api/v1';
    }
    
    // For production, use environment variable or fallback
    return import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
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

    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          const errorData = await this.parseErrorResponse(response);
          throw new APIClientError(
            errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            response.status,
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
        lastError = error as Error;
        
        // Don't retry client errors (4xx) or APIClientError
        if (error instanceof APIClientError && error.statusCode < 500) {
          throw error;
        }
        
        // Don't retry on last attempt
        if (attempt === this.retryAttempts) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    
    throw lastError!;
  }

  private async parseErrorResponse(response: Response): Promise<Partial<APIError>> {
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

export class APIClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'APIClientError';
  }
}

// Global API client instance
export const apiClient = new APIClient();