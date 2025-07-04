
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { integrationAPI } from '@/services/api/integrationClient';

/**
 * Simplified "dumb" integration hook
 * Only fetches data - no business logic
 */
export const useIntegrationsNew = () => {
  const queryClient = useQueryClient();

  // Fetch available integrations
  const { data: availableIntegrations = [], isLoading: loadingIntegrations } = useQuery({
    queryKey: ['integrations'],
    queryFn: integrationAPI.getIntegrations,
  });

  // Fetch user credentials
  const { data: userCredentials = [], isLoading: loadingCredentials } = useQuery({
    queryKey: ['user-credentials'],
    queryFn: integrationAPI.getCredentials,
  });

  // Create credential mutation
  const addCredentialMutation = useMutation({
    mutationFn: integrationAPI.addCredential,
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
    mutationFn: integrationAPI.testCredential,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-credentials'] });
      toast.success('Connection test successful');
    },
    onError: (error: Error) => {
      toast.error(`Connection test failed: ${error.message}`);
    },
  });

  // Delete credential mutation
  const deleteCredentialMutation = useMutation({
    mutationFn: integrationAPI.deleteCredential,
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
