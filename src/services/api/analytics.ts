/**
 * Analytics API Service
 * Handles analytics and usage data API calls
 */

import { apiClient } from './base';
import type {
  AnalyticsQuery,
  AnalyticsResponse,
  QuotaUsage,
  PaginatedRequest,
  PaginatedResponse
} from './types';

export interface UsageLog {
  id: string;
  tenant_id: string;
  user_id?: string;
  credential_id?: string;
  provider: string;
  operation: string;
  status_code: number;
  response_time_ms: number;
  tokens_used?: number;
  cost_cents?: number;
  error_message?: string;
  from_cache?: boolean;
  created_at: string;
}

export interface CostBreakdown {
  provider: string;
  total_cost_cents: number;
  total_tokens: number;
  total_calls: number;
  average_cost_per_call: number;
  cost_by_operation: Record<string, {
    cost_cents: number;
    calls: number;
    tokens: number;
  }>;
}

export interface PerformanceMetrics {
  provider: string;
  average_response_time_ms: number;
  success_rate: number;
  total_calls: number;
  failed_calls: number;
  p95_response_time_ms: number;
  p99_response_time_ms: number;
}

export class AnalyticsAPI {
  // Usage Analytics
  async getUsageAnalytics(query: AnalyticsQuery): Promise<AnalyticsResponse> {
    const params = new URLSearchParams();
    params.set('start_date', query.start_date);
    params.set('end_date', query.end_date);
    if (query.provider) params.set('provider', query.provider);
    if (query.group_by) params.set('group_by', query.group_by);
    if (query.tenant_id) params.set('tenant_id', query.tenant_id);

    return apiClient.get<AnalyticsResponse>(`/analytics/usage?${params.toString()}`);
  }

  async getUsageLogs(params?: PaginatedRequest & {
    provider?: string;
    start_date?: string;
    end_date?: string;
    status?: 'success' | 'error';
  }): Promise<PaginatedResponse<UsageLog>> {
    const searchParams = new URLSearchParams();
    if (params?.provider) searchParams.set('provider', params.provider);
    if (params?.start_date) searchParams.set('start_date', params.start_date);
    if (params?.end_date) searchParams.set('end_date', params.end_date);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.cursor) searchParams.set('cursor', params.cursor);

    const query = searchParams.toString();
    return apiClient.get<PaginatedResponse<UsageLog>>(`/analytics/usage-logs${query ? `?${query}` : ''}`);
  }

  // Cost Analytics
  async getCostAnalysis(query?: {
    start_date?: string;
    end_date?: string;
    provider?: string;
  }): Promise<CostBreakdown[]> {
    const params = new URLSearchParams();
    if (query?.start_date) params.set('start_date', query.start_date);
    if (query?.end_date) params.set('end_date', query.end_date);
    if (query?.provider) params.set('provider', query.provider);

    const queryString = params.toString();
    return apiClient.get<CostBreakdown[]>(`/analytics/cost-analysis${queryString ? `?${queryString}` : ''}`);
  }

  async getCostTrends(query: {
    start_date: string;
    end_date: string;
    group_by: 'day' | 'week' | 'month';
    provider?: string;
  }): Promise<Array<{
    date: string;
    total_cost_cents: number;
    total_calls: number;
    cost_by_provider: Record<string, number>;
  }>> {
    const params = new URLSearchParams();
    params.set('start_date', query.start_date);
    params.set('end_date', query.end_date);
    params.set('group_by', query.group_by);
    if (query.provider) params.set('provider', query.provider);

    return apiClient.get<Array<{
      date: string;
      total_cost_cents: number;
      total_calls: number;
      cost_by_provider: Record<string, number>;
    }>>(`/analytics/cost-trends?${params.toString()}`);
  }

  // Performance Analytics
  async getPerformanceMetrics(query?: {
    start_date?: string;
    end_date?: string;
    provider?: string;
  }): Promise<PerformanceMetrics[]> {
    const params = new URLSearchParams();
    if (query?.start_date) params.set('start_date', query.start_date);
    if (query?.end_date) params.set('end_date', query.end_date);
    if (query?.provider) params.set('provider', query.provider);

    const queryString = params.toString();
    return apiClient.get<PerformanceMetrics[]>(`/analytics/performance${queryString ? `?${queryString}` : ''}`);
  }

  // Quota Analytics
  async getCurrentQuotas(): Promise<QuotaUsage[]> {
    return apiClient.get<QuotaUsage[]>('/analytics/quotas');
  }

  async getQuotaUsageHistory(query: {
    start_date: string;
    end_date: string;
    provider?: string;
  }): Promise<Array<{
    date: string;
    provider: string;
    tokens_used: number;
    requests_made: number;
    quota_percentage: number;
  }>> {
    const params = new URLSearchParams();
    params.set('start_date', query.start_date);
    params.set('end_date', query.end_date);
    if (query.provider) params.set('provider', query.provider);

    return apiClient.get<Array<{
      date: string;
      provider: string;
      tokens_used: number;
      requests_made: number;
      quota_percentage: number;
    }>>(`/analytics/quota-history?${params.toString()}`);
  }

  // Dashboard Analytics
  async getDashboardMetrics(period: 'today' | 'week' | 'month' | 'quarter'): Promise<{
    total_calls: number;
    total_cost_cents: number;
    total_tokens: number;
    success_rate: number;
    top_providers: Array<{
      provider: string;
      calls: number;
      cost_cents: number;
    }>;
    recent_activity: Array<{
      provider: string;
      operation: string;
      status: 'success' | 'error';
      timestamp: string;
    }>;
  }> {
    return apiClient.get<{
      total_calls: number;
      total_cost_cents: number;
      total_tokens: number;
      success_rate: number;
      top_providers: Array<{
        provider: string;
        calls: number;
        cost_cents: number;
      }>;
      recent_activity: Array<{
        provider: string;
        operation: string;
        status: 'success' | 'error';
        timestamp: string;
      }>;
    }>(`/analytics/dashboard?period=${period}`);
  }
}

export const analyticsAPI = new AnalyticsAPI();