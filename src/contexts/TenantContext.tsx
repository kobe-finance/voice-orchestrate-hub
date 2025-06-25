
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface Organization {
  id: string;
  name: string;
  slug: string;
  subscription_tier: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface OrganizationMember {
  id: string;
  user_id: string;
  organization_id: string;
  role: string;
  joined_at: string;
  is_active: boolean;
}

interface TenantContextType {
  currentTenant: Organization | null;
  userRole: string | null;
  isLoading: boolean;
  error: string | null;
  refetchTenant: () => Promise<void>;
}

const TenantContext = React.createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTenant, setCurrentTenant] = React.useState<Organization | null>(null);
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const { user, isAuthenticated } = useAuth();

  // Load tenant data when user authenticates or tenant_id changes
  React.useEffect(() => {
    if (isAuthenticated && user?.user_metadata?.tenant_id) {
      fetchTenantData();
    } else {
      setCurrentTenant(null);
      setUserRole(null);
      setError(null);
    }
  }, [isAuthenticated, user?.user_metadata?.tenant_id]);

  const fetchTenantData = async () => {
    if (!user?.user_metadata?.tenant_id) {
      setError('No tenant assigned to user');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch organization data
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', user.user_metadata.tenant_id)
        .single();

      if (orgError) {
        console.error('Error fetching organization:', orgError);
        setError('Failed to load organization data');
        return;
      }

      // Fetch user's role in the organization
      const { data: memberData, error: memberError } = await supabase
        .from('organization_members')
        .select('role')
        .eq('user_id', user.id)
        .eq('organization_id', user.user_metadata.tenant_id)
        .eq('is_active', true)
        .single();

      if (memberError) {
        console.error('Error fetching membership:', memberError);
        setUserRole('member'); // Default role if not found
      } else {
        setUserRole(memberData.role);
      }

      // Convert the database organization to our interface type
      const organization: Organization = {
        id: orgData.id,
        name: orgData.name,
        slug: orgData.slug,
        subscription_tier: orgData.subscription_tier || 'free',
        settings: (orgData.settings as Record<string, any>) || {},
        created_at: orgData.created_at,
        updated_at: orgData.updated_at,
      };

      setCurrentTenant(organization);
      console.log('Tenant data loaded:', organization);
      
    } catch (error) {
      console.error('Error loading tenant data:', error);
      setError('Failed to load tenant information');
      toast.error('Failed to load organization information');
    } finally {
      setIsLoading(false);
    }
  };

  const refetchTenant = async () => {
    await fetchTenantData();
  };

  const value: TenantContextType = {
    currentTenant,
    userRole,
    isLoading,
    error,
    refetchTenant,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

export const useTenant = (): TenantContextType => {
  const context = React.useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
