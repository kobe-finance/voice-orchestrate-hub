/**
 * Modern Integration Hook - API-Based (Phase 2)
 * Simple hook that only makes API calls - zero business logic
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage, handleAPIError } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import type {
  Integration,
  IntegrationCredential,
  UserIntegration,
  CreateCredentialRequest,
  TestCredentialRequest,
  InstallIntegrationRequest
} from '@/services/api/types';

export interface UseIntegrationsAPIReturn {
  // Data
  integrations: Integration[];
  credentials: IntegrationCredential[];
  userIntegrations: UserIntegration[];
  
  // Loading states
  isLoadingIntegrations: boolean;
  isLoadingCredentials: boolean;
  isLoadingUserIntegrations: boolean;
  
  // Mutations
  createCredential: {
    mutate: (data: CreateCredentialRequest) => void;
    isLoading: boolean;
  };
  testCredential: {
    mutate: (data: TestCredentialRequest) => void;
    isLoading: boolean;
  };
  installIntegration: {
    mutate: (data: InstallIntegrationRequest) => void;
    isLoading: boolean;
  };
  uninstallIntegration: {
    mutate: (userIntegrationId: string) => void;
    isLoading: boolean;
  };
  deleteCredential: {
    mutate: (credentialId: string) => void;
    isLoading: boolean;
  };
}

export const useIntegrationsAPI = (): UseIntegrationsAPIReturn => {
  const queryClient = useQueryClient();

  // Data Queries - Pure API calls
  const {
    data: integrations = [],
    isLoading: isLoadingIntegrations,
  } = useQuery({
    queryKey: ['api-integrations'],
    queryFn: () => api.integrations.getIntegrations(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: credentials = [],
    isLoading: isLoadingCredentials,
  } = useQuery({
    queryKey: ['api-credentials'],
    queryFn: () => api.integrations.getCredentials(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  const {
    data: userIntegrations = [],
    isLoading: isLoadingUserIntegrations,
  } = useQuery({
    queryKey: ['api-user-integrations'],
    queryFn: () => api.integrations.getUserIntegrations(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Mutation: Create Credential
  const createCredentialMutation = useMutation({
    mutationFn: (data: CreateCredentialRequest) => 
      api.integrations.createCredential(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-credentials'] });
      toast.success('Credential created successfully');
    },
    onError: (error) => {
      console.error('Create credential failed:', error);
      toast.error(getErrorMessage(handleAPIError(error)));
    },
  });

  // Mutation: Test Credential
  const testCredentialMutation = useMutation({
    mutationFn: (data: TestCredentialRequest) => 
      api.integrations.testCredential(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['api-credentials'] });
      if (result.success) {
        toast.success('Connection test successful');
      } else {
        toast.error(`Test failed: ${result.error_details?.message || 'Unknown error'}`);
      }
    },
    onError: (error) => {
      console.error('Test credential failed:', error);
      toast.error(getErrorMessage(handleAPIError(error)));
    },
  });

  // Mutation: Install Integration
  const installIntegrationMutation = useMutation({
    mutationFn: (data: InstallIntegrationRequest) => 
      api.integrations.installIntegration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-user-integrations'] });
      toast.success('Integration installed successfully');
    },
    onError: (error) => {
      console.error('Install integration failed:', error);
      toast.error(getErrorMessage(handleAPIError(error)));
    },
  });

  // Mutation: Uninstall Integration
  const uninstallIntegrationMutation = useMutation({
    mutationFn: (userIntegrationId: string) => 
      api.integrations.uninstallIntegration(userIntegrationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-user-integrations'] });
      toast.success('Integration uninstalled successfully');
    },
    onError: (error) => {
      console.error('Uninstall integration failed:', error);
      toast.error(getErrorMessage(handleAPIError(error)));
    },
  });

  // Mutation: Delete Credential
  const deleteCredentialMutation = useMutation({
    mutationFn: (credentialId: string) => 
      api.integrations.deleteCredential(credentialId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-credentials'] });
      queryClient.invalidateQueries({ queryKey: ['api-user-integrations'] });
      toast.success('Credential deleted successfully');
    },
    onError: (error) => {
      console.error('Delete credential failed:', error);
      toast.error(getErrorMessage(handleAPIError(error)));
    },
  });

  return {
    // Data
    integrations,
    credentials,
    userIntegrations,
    
    // Loading states
    isLoadingIntegrations,
    isLoadingCredentials,
    isLoadingUserIntegrations,
    
    // Mutations (wrapped for easier consumption)
    createCredential: {
      mutate: createCredentialMutation.mutate,
      isLoading: createCredentialMutation.isPending,
    },
    testCredential: {
      mutate: testCredentialMutation.mutate,
      isLoading: testCredentialMutation.isPending,
    },
    installIntegration: {
      mutate: installIntegrationMutation.mutate,
      isLoading: installIntegrationMutation.isPending,
    },
    uninstallIntegration: {
      mutate: uninstallIntegrationMutation.mutate,
      isLoading: uninstallIntegrationMutation.isPending,
    },
    deleteCredential: {
      mutate: deleteCredentialMutation.mutate,
      isLoading: deleteCredentialMutation.isPending,
    },
  };
};