/**
 * Phase 2.4: API-based Analytics Hook
 * 
 * Replaces complex analytics logic with pure API calls
 * - Uses analyticsAPI for all operations
 * - No business logic or calculations
 * - Pure data queries only
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analyticsAPI } from '@/services/api/analytics';
import { useAuth } from '@/hooks/useAuth';
import type { AnalyticsQuery, AnalyticsResponse } from '@/services/api/types';

export const useAnalyticsAPI = () => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Get usage analytics with query parameters
  const getUsageAnalytics = (query: AnalyticsQuery) => {
    return useQuery({
      queryKey: ['analytics-usage-api', query],
      queryFn: async (): Promise<AnalyticsResponse> => {
        return await analyticsAPI.getUsageAnalytics(query);
      },
      enabled: !!isAuthenticated && !!user?.user_metadata?.tenant_id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Get cost analytics
  const getCostAnalytics = (query?: { start_date?: string; end_date?: string; provider?: string }) => {
    return useQuery({
      queryKey: ['analytics-cost-api', query],
      queryFn: async () => {
        return await analyticsAPI.getCostAnalysis(query);
      },
      enabled: !!isAuthenticated && !!user?.user_metadata?.tenant_id,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Get performance metrics
  const getPerformanceMetrics = (query?: { start_date?: string; end_date?: string; provider?: string }) => {
    return useQuery({
      queryKey: ['analytics-performance-api', query],
      queryFn: async () => {
        return await analyticsAPI.getPerformanceMetrics(query);
      },
      enabled: !!isAuthenticated && !!user?.user_metadata?.tenant_id,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Get dashboard metrics
  const getDashboardMetrics = (period: 'today' | 'week' | 'month' | 'quarter') => {
    return useQuery({
      queryKey: ['analytics-dashboard-api', period],
      queryFn: async () => {
        return await analyticsAPI.getDashboardMetrics(period);
      },
      enabled: !!isAuthenticated && !!user?.user_metadata?.tenant_id,
      staleTime: 2 * 60 * 1000, // 2 minutes for dashboard
    });
  };

  return {
    getUsageAnalytics,
    getCostAnalytics,
    getPerformanceMetrics,
    getDashboardMetrics,
  };
};