
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

  // Get user's credentials
  const { data: userCredentials, isLoading: loadingCredentials } = useQuery({
    queryKey: ['integration-credentials', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('integration_credentials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as IntegrationCredential[];
    },
    enabled: !!user?.id,
  });

  // Get user's installed integrations
  const { data: userIntegrations, isLoading: loadingUserIntegrations } = useQuery({
    queryKey: ['user-integrations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_integrations')
        .select(`
          *,
          integration:integrations(*),
          credential:integration_credentials(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert database types to frontend types
      const { convertDatabaseUserIntegration } = await import('@/types/integration');
      return data.map(convertDatabaseUserIntegration);
    },
    enabled: !!user?.id,
  });

  // Add new credential
  const addCredential = useMutation({
    mutationFn: async (data: {
      integration_id: string;
      credential_name: string;
      credentials: Record<string, string>;
      credential_type: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('integration_credentials')
        .insert({
          user_id: user.id,
          integration_id: data.integration_id,
          credential_name: data.credential_name,
          encrypted_credentials: data.credentials,
          credential_type: data.credential_type,
          created_by: user.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integration-credentials'] });
      toast({ title: 'Credential added successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error adding credential',
        variant: 'destructive'
      });
      console.error('Error adding credential:', error);
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

  // Test credential connection
  const testCredential = useMutation({
    mutationFn: async (credentialId: string) => {
      const { data, error } = await supabase.functions.invoke('test-integration-credential', {
        body: { credential_id: credentialId }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['integration-credentials'] });
      if (data.success) {
        toast({ title: 'Connection test successful' });
      } else {
        toast({ 
          title: 'Connection test failed',
          variant: 'destructive'
        });
      }
    },
    onError: (error) => {
      toast({ 
        title: 'Error testing connection',
        variant: 'destructive'
      });
      console.error('Error testing credential:', error);
    },
  });

  // Install integration
  const installIntegration = useMutation({
    mutationFn: async ({ integrationId, credentialId }: { integrationId: string; credentialId: string }) => {
      const { data, error } = await supabase.functions.invoke('manage-integration', {
        body: { 
          action: 'install',
          integration_id: integrationId,
          credential_id: credentialId
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-integrations'] });
      toast({ title: 'Integration installed successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error installing integration',
        variant: 'destructive'
      });
      console.error('Error installing integration:', error);
    },
  });

  // Uninstall integration
  const uninstallIntegration = useMutation({
    mutationFn: async (userIntegrationId: string) => {
      const { data, error } = await supabase.functions.invoke('manage-integration', {
        body: { 
          action: 'uninstall',
          user_integration_id: userIntegrationId
        }
      });

      if (error) throw error;
      return data;
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
