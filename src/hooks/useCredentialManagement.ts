
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { credentialService } from '@/services/credentialService';
import type { Integration, IntegrationCredential, CreateCredentialRequest } from '@/services/credentialService';

export const useCredentialManagement = () => {
  const queryClient = useQueryClient();
  const [isTestingCredential, setIsTestingCredential] = useState<string | null>(null);

  // Fetch available integrations
  const { data: availableIntegrations = [], isLoading: loadingIntegrations } = useQuery({
    queryKey: ['available-integrations'],
    queryFn: credentialService.getAvailableIntegrations,
  });

  // Fetch user credentials
  const { data: userCredentials = [], isLoading: loadingCredentials } = useQuery({
    queryKey: ['user-credentials'],
    queryFn: credentialService.getUserCredentials,
  });

  // Create credential mutation
  const createCredentialMutation = useMutation({
    mutationFn: credentialService.createCredential,
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
      setIsTestingCredential(credentialId);
      try {
        const result = await credentialService.testCredential(credentialId);
        return { credentialId, result };
      } finally {
        setIsTestingCredential(null);
      }
    },
    onSuccess: ({ credentialId, result }) => {
      queryClient.invalidateQueries({ queryKey: ['user-credentials'] });
      if (result.status === 'success') {
        toast.success('Connection test successful');
      } else {
        toast.error(`Connection test failed: ${result.error_details || 'Unknown error'}`);
      }
    },
    onError: (error: Error) => {
      setIsTestingCredential(null);
      toast.error(`Connection test failed: ${error.message}`);
    },
  });

  // Delete credential mutation
  const deleteCredentialMutation = useMutation({
    mutationFn: credentialService.deleteCredential,
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
    isAddingCredential: createCredentialMutation.isPending,
    isTestingCredential,
    isDeletingCredential: deleteCredentialMutation.isPending,
    
    // Actions
    addCredential: createCredentialMutation.mutateAsync,
    testCredential: testCredentialMutation.mutateAsync,
    deleteCredential: deleteCredentialMutation.mutateAsync,
  };
};
