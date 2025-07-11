import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/contexts/TenantContext';

interface Organization {
  id: string;
  name: string;
  slug: string;
  subscription_tier: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useTenantData = () => {
  const { user } = useAuth();
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: async () => {
      if (!tenantId) throw new Error('No tenant ID');

      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', tenantId)
        .single();

      if (orgError) throw orgError;

      return {
        id: orgData.id,
        name: orgData.name,
        slug: orgData.slug,
        subscription_tier: orgData.subscription_tier || 'free',
        settings: (orgData.settings as Record<string, any>) || {},
        created_at: orgData.created_at,
        updated_at: orgData.updated_at,
      } as Organization;
    },
    enabled: !!tenantId,
  });
};

export const useUserRole = () => {
  const { user } = useAuth();
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: ['userRole', user?.id, tenantId],
    queryFn: async () => {
      if (!user?.id || !tenantId) throw new Error('Missing user or tenant ID');

      const { data: memberData, error: memberError } = await supabase
        .from('organization_members')
        .select('role')
        .eq('user_id', user.id)
        .eq('organization_id', tenantId)
        .eq('is_active', true)
        .single();

      if (memberError) {
        console.warn('Error fetching membership:', memberError);
        return 'member'; // Default role
      }

      return memberData.role;
    },
    enabled: !!user?.id && !!tenantId,
  });
};