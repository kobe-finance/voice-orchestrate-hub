
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { credentialService } from '@/services/credentialService';
import type { Integration, IntegrationCredential, CreateCredentialRequest } from '@/services/credentialService';

export const useCredentialManagement = () => {
  const queryClient = useQueryClient();
  const [isTestingCredential, setIsTestingCredential] = useState<string | null>(null);
  const [isAddingCredential, setIsAddingCredential] = useState(false);

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

  // Enhanced create credential with auto-test
  const createCredentialMutation = useMutation({
    mutationFn: async (data: CreateCredentialRequest) => {
      setIsAddingCredential(true);
      
      try {
        // Step 1: Add credential
        toast.loading('Saving credential...', { id: 'credential-operation' });
        const credential = await credentialService.createCredential(data);
        
        // Step 2: Auto-test the credential
        toast.loading('Testing connection...', { id: 'credential-operation' });
        setIsTestingCredential(credential.credential_id);
        
        const testResult = await credentialService.testCredential(credential.credential_id);
        
        if (testResult.status === 'success') {
          toast.success('Credential added and verified successfully!', { id: 'credential-operation' });
        } else {
          toast.error(`Credential added but connection failed: ${testResult.error_details || 'Unknown error'}`, { id: 'credential-operation' });
        }
        
        return credential;
      } finally {
        setIsAddingCredential(false);
        setIsTestingCredential(null);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-credentials'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to add credential: ${error.message}`, { id: 'credential-operation' });
      setIsAddingCredential(false);
      setIsTestingCredential(null);
    },
  });

  // Manual test credential mutation
  const testCredentialMutation = useMutation({
    mutationFn: async (credentialId: string) => {
      setIsTestingCredential(credentialId);
      toast.loading('Testing connection...', { id: `test-${credentialId}` });
      
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
        toast.success('Connection test successful!', { id: `test-${credentialId}` });
      } else {
        toast.error(`Connection test failed: ${result.error_details || 'Unknown error'}`, { id: `test-${credentialId}` });
      }
    },
    onError: (error: Error, credentialId) => {
      toast.error(`Connection test failed: ${error.message}`, { id: `test-${credentialId}` });
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
    isAddingCredential,
    isTestingCredential,
    isDeletingCredential: deleteCredentialMutation.isPending,
    
    // Actions
    addCredential: createCredentialMutation.mutateAsync,
    testCredential: testCredentialMutation.mutateAsync,
    deleteCredential: deleteCredentialMutation.mutateAsync,
  };
};
