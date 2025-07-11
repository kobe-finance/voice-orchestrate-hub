/**
 * Phase 2.2: API-based Tenant/Organization Hook
 * 
 * Replaces business logic from TenantContext with pure API calls
 * - Removes direct Supabase queries
 * - Uses organizationsAPI for all operations
 * - Maintains same interface for seamless migration
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationsAPI } from '@/services/api/organizations';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';
import type { Organization, TenantContext as APITenantContext } from '@/services/api/types';

interface UseTenantAPIReturn {
  currentTenant: Organization | null;
  userRole: string | null;
  isLoading: boolean;
  error: string | null;
  refetchTenant: () => Promise<void>;
  updateTenantSettings: (settings: Record<string, any>) => Promise<Organization>;
  switchTenant: (tenantId: string) => Promise<APITenantContext>;
}

export const useTenantAPI = (): UseTenantAPIReturn => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Get tenant context from API
  const { 
    data: tenantContext, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['tenant-context', user?.user_metadata?.tenant_id],
    queryFn: async () => {
      return await organizationsAPI.getCurrentTenantContext();
    },
    enabled: !!isAuthenticated && !!user?.user_metadata?.tenant_id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Switch tenant mutation
  const switchTenantMutation = useMutation({
    mutationFn: async (tenantId: string) => {
      return await organizationsAPI.switchTenant(tenantId);
    },
    onSuccess: (newContext) => {
      queryClient.setQueryData(['tenant-context', newContext.organization.id], newContext);
      queryClient.invalidateQueries({ queryKey: ['tenant-context'] });
      toast.success(`Switched to ${newContext.organization.name}`);
    },
    onError: (error: any) => {
      toast.error(`Failed to switch tenant: ${error.message}`);
    },
  });

  // Update tenant settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: Record<string, any>) => {
      if (!tenantContext?.organization.id) {
        throw new Error('No active tenant');
      }
      return await organizationsAPI.updateSettings(tenantContext.organization.id, settings);
    },
    onSuccess: (updatedOrg) => {
      // Update cached tenant context
      if (tenantContext) {
        const updatedContext = {
          ...tenantContext,
          organization: updatedOrg,
        };
        queryClient.setQueryData(['tenant-context', updatedOrg.id], updatedContext);
      }
      toast.success('Settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update settings: ${error.message}`);
    },
  });

  const refetchTenant = async () => {
    await refetch();
  };

  return {
    currentTenant: tenantContext?.organization || null,
    userRole: tenantContext?.user_role || null,
    isLoading,
    error: error ? String(error) : null,
    refetchTenant,
    updateTenantSettings: updateSettingsMutation.mutateAsync,
    switchTenant: switchTenantMutation.mutateAsync,
  };
};