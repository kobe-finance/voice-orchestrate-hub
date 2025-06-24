
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import type { Integration, IntegrationCredential, UserIntegration } from '@/types/integration';

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
      return data as Integration[];
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
      return data;
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
          encrypted_credentials: data.credentials, // Will be encrypted by Python backend
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
        description: error.message,
        variant: 'destructive'
      });
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
        description: error.message,
        variant: 'destructive'
      });
    },
  });

  return {
    availableIntegrations: availableIntegrations || [],
    userCredentials: userCredentials || [],
    userIntegrations: userIntegrations || [],
    isLoading: loadingIntegrations || loadingCredentials || loadingUserIntegrations,
    addCredential: addCredential.mutateAsync,
    deleteCredential: deleteCredential.mutateAsync,
    isAddingCredential: addCredential.isPending,
    isDeletingCredential: deleteCredential.isPending,
  };
};
