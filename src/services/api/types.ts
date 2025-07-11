/**
 * Comprehensive API type definitions
 * Consolidates all API request/response types
 */

// Common API patterns
export interface PaginatedRequest {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    cursor?: string;
  };
}

export interface APIResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

// Integration Types
export interface Integration {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  auth_type: string;
  icon_url?: string;
  documentation_url?: string;
  is_active: boolean;
  credentials_schema?: Record<string, any>;
  config_schema?: Record<string, any>;
  required_scopes?: string[];
  created_at: string;
  updated_at: string;
}

export interface IntegrationCredential {
  id: string;
  tenant_id: string;
  user_id: string;
  integration_id: string;
  credential_name: string;
  credential_type: string;
  last_test_status: 'success' | 'failed' | 'not_tested';
  last_tested_at?: string;
  last_test_error?: Record<string, any>;
  expires_at?: string;
  custom_quota_limits?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface CreateCredentialRequest {
  integration_id: string;
  credential_name: string;
  credential_type: string;
  credentials: Record<string, any>;
  expires_at?: string;
  custom_quota_limits?: Record<string, any>;
}

export interface TestCredentialRequest {
  credential_id: string;
  test_type?: string;
}

export interface TestCredentialResponse {
  success: boolean;
  response_time_ms?: number;
  error_details?: Record<string, any>;
  test_type: string;
  tested_at: string;
}

export interface UserIntegration {
  id: string;
  tenant_id: string;
  user_id: string;
  integration_id: string;
  credential_id: string;
  status: 'installing' | 'active' | 'failed' | 'inactive';
  config?: Record<string, any>;
  metadata?: Record<string, any>;
  sync_status?: string;
  last_sync_at?: string;
  error_count?: number;
  installed_at?: string;
  installed_by?: string;
  created_at: string;
  updated_at: string;
}

export interface InstallIntegrationRequest {
  integration_id: string;
  credential_id: string;
  config?: Record<string, any>;
}

// Organization/Tenant Types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  settings?: Record<string, any>;
  subscription_tier?: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  user_id: string;
  organization_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  is_active: boolean;
  joined_at: string;
  invited_by?: string;
}

export interface CreateOrganizationRequest {
  name: string;
  slug?: string;
  settings?: Record<string, any>;
}

export interface TenantContext {
  tenant_id: string;
  tenant_name: string;
  user_role: string;
  organization: Organization;
  quotas: TenantQuota;
  features: string[];
}

export interface TenantQuota {
  provider: string;
  daily_tokens?: number;
  monthly_tokens?: number;
  per_minute_requests?: number;
  used_today?: number;
  used_this_month?: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
}

// Voice Agent Types
export interface VoiceAgent {
  id: string;
  name: string;
  description?: string;
  voice_id?: string;
  tenant_id: string;
  is_active: boolean;
  configuration: VoiceAgentConfig;
  created_at: string;
  updated_at: string;
}

export interface VoiceAgentConfig {
  language?: string;
  tone?: string;
  personality?: string;
  instructions?: string;
  fallback_responses?: string[];
  integrations?: string[];
}

export interface CreateVoiceAgentRequest {
  name: string;
  description?: string;
  voice_id?: string;
  configuration: VoiceAgentConfig;
}

// Analytics Types
export interface AnalyticsQuery {
  start_date: string;
  end_date: string;
  provider?: string;
  group_by?: 'day' | 'week' | 'month';
  tenant_id?: string;
}

export interface AnalyticsResponse {
  summary: {
    total_calls: number;
    total_tokens: number;
    total_cost_cents: number;
    average_response_time_ms: number;
  };
  usage_over_time: Array<{
    date: string;
    calls: number;
    tokens: number;
    cost_cents: number;
  }>;
  by_provider: Record<string, {
    calls: number;
    tokens: number;
    cost_cents: number;
  }>;
}

// Dispatch/Orchestration Types
export interface DispatchRequest {
  provider: string;
  operation: string;
  payload: Record<string, any>;
  credential_id?: string;
}

export interface DispatchResponse {
  success: boolean;
  result?: any;
  error?: string;
  provider: string;
  operation: string;
  response_time_ms: number;
  tokens_used?: number;
  cost_cents?: number;
}

// Error Types
export interface APIErrorData {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode: number;
}

export interface ValidationErrorData {
  field: string;
  message: string;
  code: string;
}

// Quota Types
export interface QuotaUsage {
  provider: string;
  period: 'daily' | 'monthly';
  used: number;
  limit: number;
  percentage: number;
  reset_at: string;
}

export interface SetQuotaRequest {
  provider: string;
  daily_tokens?: number;
  monthly_tokens?: number;
  per_minute_requests?: number;
}