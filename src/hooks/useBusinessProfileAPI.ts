/**
 * Phase 2.4: API-based Business Profile Hook
 * 
 * Replaces direct Supabase queries with API calls
 * - Uses API client for all operations
 * - Removes business logic from frontend
 * - Pure data operations only
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/base';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

export interface BusinessProfileData {
  businessName?: string;
  industry?: string;
  businessSize?: string;
  websiteUrl?: string;
  phoneNumber?: string;
  description?: string;
}

interface BusinessProfile {
  id: string;
  user_id: string;
  business_name?: string;
  industry?: string;
  business_size?: string;
  website_url?: string;
  phone_number?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useBusinessProfileAPI = () => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Get business profile data via API
  const { data: businessProfile, isLoading } = useQuery({
    queryKey: ['business-profile-api', user?.id],
    queryFn: async (): Promise<BusinessProfile | null> => {
      if (!user?.id) return null;
      
      try {
        return await apiClient.get<BusinessProfile>(`/users/profile/business`);
      } catch (error: any) {
        // Return null if profile doesn't exist yet
        if (error.statusCode === 404) return null;
        throw error;
      }
    },
    enabled: !!user?.id && isAuthenticated,
  });

  // Save business profile via API
  const saveBusinessProfile = useMutation({
    mutationFn: async (data: BusinessProfileData): Promise<BusinessProfile> => {
      if (!user?.id) throw new Error('User not authenticated');
      
      return await apiClient.post<BusinessProfile>('/users/profile/business', {
        business_name: data.businessName,
        industry: data.industry,
        business_size: data.businessSize,
        website_url: data.websiteUrl,
        phone_number: data.phoneNumber,
        description: data.description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-profile-api'] });
      toast.success('Business profile saved successfully');
    },
    onError: (error: any) => {
      console.error('Error saving business profile:', error);
      toast.error('Error saving business profile');
    },
  });

  return {
    businessProfile,
    isLoading,
    saveBusinessProfile: saveBusinessProfile.mutateAsync,
    isSaving: saveBusinessProfile.isPending,
  };
};