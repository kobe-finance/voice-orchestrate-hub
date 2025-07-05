
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Integration, IntegrationCredential, CreateCredentialRequest } from '@/services/credentialService';

export const useCredentialManagement = () => {
  const queryClient = useQueryClient();
  const [isTestingCredential, setIsTestingCredential] = useState<string | null>(null);
  const [isAddingCredential, setIsAddingCredential] = useState(false);

  // Fetch available integrations
  const { data: availableIntegrations = [], isLoading: loadingIntegrations } = useQuery({
    queryKey: ['available-integrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as Integration[];
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
      return data as IntegrationCredential[];
    },
  });

  // Enhanced create credential with auto-test
  const createCredentialMutation = useMutation({
    mutationFn: async (data: CreateCredentialRequest) => {
      setIsAddingCredential(true);
      
      try {
        // Step 1: Add credential
        toast.loading('Saving credential...', { id: 'credential-operation' });
        
        const { data: credential, error } = await supabase
          .from('integration_credentials')
          .insert({
            integration_id: data.integration_id,
            credential_name: data.credential_name,
            encrypted_credentials: data.credentials,
            credential_type: data.credential_type || 'api_key',
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Step 2: Auto-test the credential
        toast.loading('Testing connection...', { id: 'credential-operation' });
        setIsTestingCredential(credential.id);
        
        const { data: testResult, error: testError } = await supabase.functions.invoke('test-integration-credential', {
          body: { credential_id: credential.id }
        });
        
        if (testError) {
          console.error('Test error:', testError);
          toast.error(`Credential added but connection test failed: ${testError.message}`, { id: 'credential-operation' });
        } else if (testResult?.success) {
          toast.success('Credential added and verified successfully!', { id: 'credential-operation' });
        } else {
          toast.error(`Credential added but connection failed: ${testResult?.message || 'Unknown error'}`, { id: 'credential-operation' });
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
        const { data: result, error } = await supabase.functions.invoke('test-integration-credential', {
          body: { credential_id: credentialId }
        });
        
        if (error) throw error;
        return { credentialId, result };
      } finally {
        setIsTestingCredential(null);
      }
    },
    onSuccess: ({ credentialId, result }) => {
      queryClient.invalidateQueries({ queryKey: ['user-credentials'] });
      if (result?.success) {
        toast.success('Connection test successful!', { id: `test-${credentialId}` });
      } else {
        toast.error(`Connection test failed: ${result?.message || 'Unknown error'}`, { id: `test-${credentialId}` });
      }
    },
    onError: (error: Error, credentialId) => {
      toast.error(`Connection test failed: ${error.message}`, { id: `test-${credentialId}` });
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
    isAddingCredential,
    isTestingCredential,
    isDeletingCredential: deleteCredentialMutation.isPending,
    
    // Actions
    addCredential: createCredentialMutation.mutateAsync,
    testCredential: testCredentialMutation.mutateAsync,
    deleteCredential: deleteCredentialMutation.mutateAsync,
  };
};
