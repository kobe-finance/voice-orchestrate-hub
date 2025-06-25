
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';
import type { Integration, IntegrationCredential, UserIntegration } from '@/types/integration';

interface UseIntegrationsReturn {
  // Data
  availableIntegrations: Integration[];
  userCredentials: IntegrationCredential[];
  userIntegrations: UserIntegration[];
  
  // Loading states
  isLoading: boolean;
  isAddingCredential: boolean;
  isTestingCredential: boolean;
  isInstallingIntegration: boolean;
  isUninstallingIntegration: boolean;
  
  // Actions
  addCredential: (data: {
    integrationId: string;
    credentialName: string;
    credentials: Record<string, any>;
    credentialType: string;
  }) => Promise<void>;
  testCredential: (credentialId: string) => Promise<void>;
  installIntegration: (data: { integrationId: string; credentialId: string }) => Promise<void>;
  uninstallIntegration: (userIntegrationId: string) => Promise<void>;
}

export const useIntegrations = (): UseIntegrationsReturn => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isAddingCredential, setIsAddingCredential] = useState(false);
  const [isTestingCredential, setIsTestingCredential] = useState(false);
  const [isInstallingIntegration, setIsInstallingIntegration] = useState(false);
  const [isUninstallingIntegration, setIsUninstallingIntegration] = useState(false);

  // Get tenant_id from user metadata
  const tenantId = user?.user_metadata?.tenant_id;

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
      return data as Integration[];
    },
    enabled: !!user,
  });

  // Fetch user credentials
  const { data: userCredentials = [], isLoading: loadingCredentials } = useQuery({
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
    enabled: !!user && !!tenantId,
  });

  // Fetch user integrations with related data
  const { data: userIntegrations = [], isLoading: loadingUserIntegrations } = useQuery({
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
      return data as UserIntegration[];
    },
    enabled: !!user && !!tenantId,
  });

  // Add credential mutation
  const addCredentialMutation = useMutation({
    mutationFn: async (data: {
      integrationId: string;
      credentialName: string;
      credentials: Record<string, any>;
      credentialType: string;
    }) => {
      if (!tenantId) throw new Error('No tenant ID available');
      
      const { data: result, error } = await supabase
        .from('integration_credentials')
        .insert({
          tenant_id: tenantId,
          user_id: user!.id,
          integration_id: data.integrationId,
          credential_name: data.credentialName,
          encrypted_credentials: data.credentials,
          credential_type: data.credentialType,
          created_by: user!.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integration-credentials', tenantId] });
      toast.success('Credential added successfully');
    },
    onError: (error) => {
      console.error('Add credential error:', error);
      toast.error('Failed to add credential');
    },
  });

  // Test credential mutation
  const testCredentialMutation = useMutation({
    mutationFn: async (credentialId: string) => {
      const response = await fetch('/api/integrations/test-credential', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({ credential_id: credentialId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Test failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integration-credentials', tenantId] });
      toast.success('Credential test successful');
    },
    onError: (error) => {
      console.error('Test credential error:', error);
      toast.error(`Credential test failed: ${error.message}`);
    },
  });

  // Install integration mutation
  const installIntegrationMutation = useMutation({
    mutationFn: async (data: { integrationId: string; credentialId: string }) => {
      const response = await fetch('/api/integrations/manage-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          action: 'install',
          integration_id: data.integrationId,
          credential_id: data.credentialId,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Installation failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-integrations', tenantId] });
      toast.success('Integration installed successfully');
    },
    onError: (error) => {
      console.error('Install integration error:', error);
      toast.error(`Installation failed: ${error.message}`);
    },
  });

  // Uninstall integration mutation
  const uninstallIntegrationMutation = useMutation({
    mutationFn: async (userIntegrationId: string) => {
      const response = await fetch('/api/integrations/manage-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          action: 'uninstall',
          user_integration_id: userIntegrationId,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Uninstallation failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-integrations', tenantId] });
      toast.success('Integration uninstalled successfully');
    },
    onError: (error) => {
      console.error('Uninstall integration error:', error);
      toast.error(`Uninstallation failed: ${error.message}`);
    },
  });

  // Action handlers
  const addCredential = async (data: {
    integrationId: string;
    credentialName: string;
    credentials: Record<string, any>;
    credentialType: string;
  }) => {
    setIsAddingCredential(true);
    try {
      await addCredentialMutation.mutateAsync(data);
    } finally {
      setIsAddingCredential(false);
    }
  };

  const testCredential = async (credentialId: string) => {
    setIsTestingCredential(true);
    try {
      await testCredentialMutation.mutateAsync(credentialId);
    } finally {
      setIsTestingCredential(false);
    }
  };

  const installIntegration = async (data: { integrationId: string; credentialId: string }) => {
    setIsInstallingIntegration(true);
    try {
      await installIntegrationMutation.mutateAsync(data);
    } finally {
      setIsInstallingIntegration(false);
    }
  };

  const uninstallIntegration = async (userIntegrationId: string) => {
    setIsUninstallingIntegration(true);
    try {
      await uninstallIntegrationMutation.mutateAsync(userIntegrationId);
    } finally {
      setIsUninstallingIntegration(false);
    }
  };

  return {
    // Data
    availableIntegrations,
    userCredentials,
    userIntegrations,
    
    // Loading states
    isLoading: loadingIntegrations || loadingCredentials || loadingUserIntegrations,
    isAddingCredential,
    isTestingCredential,
    isInstallingIntegration,
    isUninstallingIntegration,
    
    // Actions
    addCredential,
    testCredential,
    installIntegration,
    uninstallIntegration,
  };
};
