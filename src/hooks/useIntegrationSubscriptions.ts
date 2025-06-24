
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export const useIntegrationSubscriptions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const subscriptionsRef = useRef<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to credential updates
    const credentialsSubscription = supabase
      .channel('integration-credentials-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'integration_credentials',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Credential change:', payload);
          
          // Invalidate and refetch credentials
          queryClient.invalidateQueries({ queryKey: ['integration-credentials'] });
          
          // Show toast for test status updates
          if (payload.eventType === 'UPDATE' && payload.new.last_test_status !== payload.old?.last_test_status) {
            const status = payload.new.last_test_status;
            if (status === 'success') {
              toast({ title: 'Connection test successful' });
            } else if (status === 'failed') {
              toast({ 
                title: 'Connection test failed',
                variant: 'destructive'
              });
            }
          }
        }
      )
      .subscribe();

    // Subscribe to user integration updates
    const userIntegrationsSubscription = supabase
      .channel('user-integrations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_integrations',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('User integration change:', payload);
          
          // Invalidate and refetch user integrations
          queryClient.invalidateQueries({ queryKey: ['user-integrations'] });
          
          // Show toast for status updates
          if (payload.eventType === 'INSERT') {
            toast({ title: 'Integration installed successfully' });
          } else if (payload.eventType === 'DELETE') {
            toast({ title: 'Integration uninstalled successfully' });
          } else if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old?.status) {
            const status = payload.new.status;
            const statusMessages = {
              active: 'Integration activated',
              paused: 'Integration paused',
              error: 'Integration error occurred'
            };
            
            if (statusMessages[status as keyof typeof statusMessages]) {
              toast({ 
                title: statusMessages[status as keyof typeof statusMessages],
                variant: status === 'error' ? 'destructive' : 'default'
              });
            }
          }
        }
      )
      .subscribe();

    // Store subscriptions for cleanup
    subscriptionsRef.current = [credentialsSubscription, userIntegrationsSubscription];

    // Cleanup function
    return () => {
      subscriptionsRef.current.forEach(subscription => {
        supabase.removeChannel(subscription);
      });
      subscriptionsRef.current = [];
    };
  }, [user?.id, queryClient]);

  return {
    isSubscribed: subscriptionsRef.current.length > 0
  };
};
