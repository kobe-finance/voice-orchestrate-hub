
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { supabase } from '@/integrations/supabase/client';

/**
 * Simplified "dumb" integration hook
 * Only fetches data - no business logic
 */
export const useIntegrationsNew = () => {
  const queryClient = useQueryClient();

  // Fetch available integrations
  const { data: availableIntegrations = [], isLoading: loadingIntegrations } = useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch user credentials
  const { data: userCredentials = [], isLoading: loadingCredentials } = useQuery({
    queryKey: ['user-credentials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('integration_credentials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Create credential mutation
  const addCredentialMutation = useMutation({
    mutationFn: async (data: any) => {
      // Get current user and tenant info
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user's tenant ID from their metadata or organizations
      const { data: orgMemberships } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(1);

      if (!orgMemberships || orgMemberships.length === 0) {
        throw new Error('User does not belong to any organization');
      }

      const tenantId = orgMemberships[0].organization_id;

      const { data: result, error } = await supabase
        .from('integration_credentials')
        .insert({
          integration_id: data.integration_id,
          credential_name: data.credential_name,
          encrypted_credentials: data.credentials,
          credential_type: data.credential_type || 'api_key',
          tenant_id: tenantId,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-credentials'] });
      toast.success('Credential added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add credential: ${error.message}`);
    },
  });

  // Test credential mutation
  const testCredentialMutation = useMutation({
    mutationFn: async (credentialId: string) => {
      const result = await api.integrations.testCredential({
        credential_id: credentialId
      });

      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['user-credentials'] });
      if (result?.success) {
        toast.success('Connection test successful');
      } else {
        toast.error(`Connection test failed: ${result?.error_details?.message || 'Unknown error'}`);
      }
    },
    onError: (error: Error) => {
      toast.error(`Connection test failed: ${error.message}`);
    },
  });

  // Delete credential mutation
  const deleteCredentialMutation = useMutation({
    mutationFn: async (credentialId: string) => {
      const { error } = await supabase
        .from('integration_credentials')
        .delete()
        .eq('id', credentialId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-credentials'] });
      toast.success('Credential deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete credential: ${error.message}`);
    },
  });

  return {
    // Data
    availableIntegrations,
    userCredentials,
    
    // Loading states
    isLoading: loadingIntegrations || loadingCredentials,
    isAddingCredential: addCredentialMutation.isPending,
    isTestingCredential: testCredentialMutation.isPending,
    isDeletingCredential: deleteCredentialMutation.isPending,
    
    // Actions (simple pass-through)
    addCredential: addCredentialMutation.mutateAsync,
    testCredential: testCredentialMutation.mutateAsync,
    deleteCredential: deleteCredentialMutation.mutateAsync,
  };
};
