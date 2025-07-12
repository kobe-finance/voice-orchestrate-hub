
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { backendService, BackendUser } from '@/services/backendService';
import { toast } from '@/components/ui/sonner';

interface UseBackendAuthReturn {
  backendUser: BackendUser | null;
  isBackendConnected: boolean;
  isLoading: boolean;
  refreshBackendUser: () => Promise<void>;
  updateBackendProfile: (updates: Partial<BackendUser>) => Promise<boolean>;
}

export const useBackendAuth = (): UseBackendAuthReturn => {
  const { user: supabaseUser, isAuthenticated } = useAuth();
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const refreshBackendUser = async () => {
    if (!isAuthenticated || !supabaseUser) {
      setBackendUser(null);
      setIsBackendConnected(false);
      return;
    }

    setIsLoading(true);
    try {
      const user = await backendService.getUserProfile();
      setBackendUser(user);
      setIsBackendConnected(true);
    } catch (error) {
      console.error('Backend user fetch error:', error instanceof Error ? error.message : 'Unknown error');
      setIsBackendConnected(false);
      setBackendUser(null);
      
      // Only show error toast if it's not a network/connection issue
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (!errorMessage.includes('Network error') && !errorMessage.includes('fetch')) {
        toast.error('Failed to sync with backend service');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateBackendProfile = async (updates: Partial<BackendUser>): Promise<boolean> => {
    if (!isAuthenticated || !backendUser) {
      return false;
    }

    try {
      const updatedUser = await backendService.updateUserProfile(updates);
      setBackendUser(updatedUser);
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  // Sync with backend when Supabase auth state changes
  useEffect(() => {
    if (isAuthenticated && supabaseUser) {
      refreshBackendUser();
    } else {
      setBackendUser(null);
      setIsBackendConnected(false);
    }
  }, [isAuthenticated, supabaseUser?.id]);

  // Health check on mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await backendService.healthCheck();
        if (response.status === 'ok') {
          console.log('Backend service is healthy');
        }
      } catch (error) {
        console.log('Backend service health check failed:', error);
      }
    };

    checkBackendHealth();
  }, []);

  return {
    backendUser,
    isBackendConnected,
    isLoading,
    refreshBackendUser,
    updateBackendProfile,
  };
};
