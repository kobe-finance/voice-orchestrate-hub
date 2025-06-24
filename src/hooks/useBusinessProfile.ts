
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface BusinessProfileData {
  businessName?: string;
  industry?: string;
  businessSize?: string;
  websiteUrl?: string;
  phoneNumber?: string;
  description?: string;
}

export const useBusinessProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Get business profile data
  const { data: businessProfile, isLoading } = useQuery({
    queryKey: ['business-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && isAuthenticated,
  });

  // Save business profile
  const saveBusinessProfile = useMutation({
    mutationFn: async (data: BusinessProfileData) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('business_profiles')
        .upsert({
          user_id: user.id,
          business_name: data.businessName,
          industry: data.industry,
          business_size: data.businessSize,
          website_url: data.websiteUrl,
          phone_number: data.phoneNumber,
          description: data.description,
        }, { onConflict: 'user_id' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-profile'] });
      toast({ title: 'Business profile saved successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error saving business profile',
        variant: 'destructive'
      });
    },
  });

  return {
    businessProfile,
    isLoading,
    saveBusinessProfile: saveBusinessProfile.mutateAsync,
    isSaving: saveBusinessProfile.isPending,
  };
};
