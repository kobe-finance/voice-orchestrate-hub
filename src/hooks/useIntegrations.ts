
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import type { 
  Integration, 
  IntegrationCredential, 
  UserIntegration,
  convertDatabaseIntegration,
  convertDatabaseUserIntegration
} from '@/types/integration';

export const useIntegrations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get tenant_id from user metadata
  const tenantId = user?.user_metadata?.tenant_id;

  // Get all available integrations
  const { data: availableIntegrations, isLoading: loadingIntegrations } = useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      
      // Convert database types to frontend types
      const { convertDatabaseIntegration } = await import('@/types/integration');
      return data.map(convertDatabaseIntegration);
    },
  });

  // Get user's credentials with real-time updates
  const { data: userCredentials, isLoading: loadingCredentials } = useQuery({
    queryKey: ['integration-credentials', tenantId],
    queryFn: async () => {
      if (!tenantId) return [];
      
      const { data, error } = await supabase
        .from('integration_credentials')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as IntegrationCredential[];
    },
    enabled: !!tenantId,
    refetchInterval: false, // Disable polling since we have real-time subscriptions
  });

  // Get user's installed integrations with real-time updates
  const { data: userIntegrations, isLoading: loadingUserIntegrations } = useQuery({
    queryKey: ['user-integrations', tenantId],
    queryFn: async () => {
      if (!tenantId) return [];
      
      const { data, error } = await supabase
        .from('user_integrations')
        .select(`
          *,
          integration:integrations(*),
          credential:integration_credentials(*)
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert database types to frontend types
      const { convertDatabaseUserIntegration } = await import('@/types/integration');
      return data.map(convertDatabaseUserIntegration);
    },
    enabled: !!tenantId,
    refetchInterval: false, // Disable polling since we have real-time subscriptions
  });

  // Enhanced add credential with optimistic updates
  const addCredential = useMutation({
    mutationFn: async (data: {
      integration_id: string;
      credential_name: string;
      credentials: Record<string, string>;
      credential_type: string;
    }) => {
      if (!user?.id || !tenantId) throw new Error('User not authenticated or no tenant');

      const { error } = await supabase
        .from('integration_credentials')
        .insert({
          user_id: user.id,
          tenant_id: tenantId, // Added missing tenant_id
          integration_id: data.integration_id,
          credential_name: data.credential_name,
          encrypted_credentials: data.credentials,
          credential_type: data.credential_type,
          created_by: user.id,
        });

      if (error) throw error;
    },
    onMutate: async (newCredential) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['integration-credentials'] });

      // Snapshot previous value
      const previousCredentials = queryClient.getQueryData(['integration-credentials', tenantId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['integration-credentials', tenantId], (old: IntegrationCredential[] = []) => [
        {
          id: 'temp-' + Date.now(),
          user_id: user?.id || '',
          tenant_id: tenantId || '',
          integration_id: newCredential.integration_id,
          credential_name: newCredential.credential_name,
          encrypted_credentials: newCredential.credentials,
          credential_type: newCredential.credential_type,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_test_status: 'not_tested',
          last_tested_at: null,
          last_test_error: null,
          expires_at: null,
          created_by: user?.id || '',
        } as IntegrationCredential,
        ...old
      ]);

      return { previousCredentials };
    },
    onError: (err, newCredential, context) => {
      // Rollback on error
      if (context?.previousCredentials) {
        queryClient.setQueryData(['integration-credentials', tenantId], context.previousCredentials);
      }
      toast({ 
        title: 'Error adding credential',
        variant: 'destructive'
      });
      console.error('Error adding credential:', err);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['integration-credentials'] });
    },
  });

  // Delete credential
  const deleteCredential = useMutation({
    mutationFn: async (credentialId: string) => {
      const { error } = await supabase
        .from('integration_credentials')
        .delete()
        .eq('id', credentialId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integration-credentials'] });
      toast({ title: 'Credential deleted successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error deleting credential',
        variant: 'destructive'
      });
      console.error('Error deleting credential:', error);
    },
  });

  // Test credential with optimistic updates
  const testCredential = useMutation({
    mutationFn: async (credentialId: string) => {
      const result = await api.integrations.testCredential({
        credential_id: credentialId
      });

      return result;
    },
    onMutate: async (credentialId) => {
      // Optimistically update status to 'testing'
      await queryClient.cancelQueries({ queryKey: ['integration-credentials'] });
      
      const previousCredentials = queryClient.getQueryData(['integration-credentials', tenantId]);
      
      queryClient.setQueryData(['integration-credentials', tenantId], (old: IntegrationCredential[] = []) =>
        old.map(cred =>
          cred.id === credentialId
            ? { ...cred, last_test_status: 'testing' as const }
            : cred
        )
      );

      return { previousCredentials };
    },
    onError: (err, credentialId, context) => {
      // Rollback on error
      if (context?.previousCredentials) {
        queryClient.setQueryData(['integration-credentials', tenantId], context.previousCredentials);
      }
      toast({ 
        title: 'Error testing connection',
        variant: 'destructive'
      });
      console.error('Error testing credential:', err);
    },
  });

  // Install integration with optimistic updates
  const installIntegration = useMutation({
    mutationFn: async ({ integrationId, credentialId }: { integrationId: string; credentialId: string }) => {
      const result = await api.integrations.installIntegration({
        integration_id: integrationId,
        credential_id: credentialId
      });

      return result;
    },
    onMutate: async ({ integrationId, credentialId }) => {
      // Optimistically add installing integration
      await queryClient.cancelQueries({ queryKey: ['user-integrations'] });
      
      const previousIntegrations = queryClient.getQueryData(['user-integrations', tenantId]);
      
      // Find the integration and credential details
      const integration = availableIntegrations?.find(i => i.id === integrationId);
      const credential = userCredentials?.find(c => c.id === credentialId);
      
      if (integration && credential) {
        queryClient.setQueryData(['user-integrations', tenantId], (old: any[] = []) => [
          {
            id: 'temp-install-' + Date.now(),
            user_id: user?.id,
            tenant_id: tenantId,
            integration_id: integrationId,
            credential_id: credentialId,
            status: 'installing',
            config: null,
            installed_at: null,
            installed_by: user?.id,
            last_sync_at: null,
            sync_status: null,
            error_count: 0,
            metadata: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            integration,
            credential,
          },
          ...old
        ]);
      }

      return { previousIntegrations };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousIntegrations) {
        queryClient.setQueryData(['user-integrations', tenantId], context.previousIntegrations);
      }
      toast({ 
        title: 'Error installing integration',
        variant: 'destructive'
      });
      console.error('Error installing integration:', err);
    },
  });

  // Uninstall integration
  const uninstallIntegration = useMutation({
    mutationFn: async (userIntegrationId: string) => {
      const result = await api.integrations.uninstallIntegration(userIntegrationId);

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-integrations'] });
      toast({ title: 'Integration uninstalled successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error uninstalling integration',
        variant: 'destructive'
      });
      console.error('Error uninstalling integration:', error);
    },
  });

  return {
    availableIntegrations: availableIntegrations || [],
    userCredentials: userCredentials || [],
    userIntegrations: userIntegrations || [],
    isLoading: loadingIntegrations || loadingCredentials || loadingUserIntegrations,
    addCredential: addCredential.mutateAsync,
    deleteCredential: deleteCredential.mutateAsync,
    testCredential: testCredential.mutateAsync,
    installIntegration: installIntegration.mutateAsync,
    uninstallIntegration: uninstallIntegration.mutateAsync,
    isAddingCredential: addCredential.isPending,
    isDeletingCredential: deleteCredential.isPending,
    isTestingCredential: testCredential.isPending,
    isInstallingIntegration: installIntegration.isPending,
    isUninstallingIntegration: uninstallIntegration.isPending,
  };
};
