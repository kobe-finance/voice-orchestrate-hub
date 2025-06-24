
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  plan: 'enterprise';
  features: string[];
  settings: {
    timezone: string;
    currency: string;
    dateFormat: string;
    businessHours: {
      start: string;
      end: string;
      timezone: string;
    };
  };
  quotas: {
    maxAgents: number;
    maxCallsPerMonth: number;
    maxStorageGB: number;
    currentUsage: {
      agents: number;
      callsThisMonth: number;
      storageUsedGB: number;
    };
  };
  infrastructure: {
    dedicatedDatabase: string;
    dedicatedStorage: string;
    dedicatedCompute: string;
    isolationLevel: 'full';
  };
}

interface TenantContextType {
  currentTenant: Tenant | null;
  isLoading: boolean;
  updateTenantSettings: (settings: Partial<Tenant['settings']>) => Promise<void>;
  getTenantQuotaUsage: () => {
    agents: { used: number; max: number; percentage: number };
    calls: { used: number; max: number; percentage: number };
    storage: { used: number; max: number; percentage: number };
  };
}

const TenantContext = React.createContext<TenantContextType | undefined>(undefined);

const TENANT_STORAGE_KEY = 'voiceorchestrate_current_tenant';

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTenant, setCurrentTenant] = React.useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const { user, isAuthenticated } = useAuth();

  // Load tenant data when user authenticates
  React.useEffect(() => {
    if (isAuthenticated && user) {
      loadTenantData();
    } else {
      setCurrentTenant(null);
    }
  }, [isAuthenticated, user]);

  const loadTenantData = async () => {
    setIsLoading(true);
    try {
      // Get user's dedicated tenant - each user belongs to exactly one tenant
      const userTenantId = user?.user_metadata?.tenant_id;
      
      if (!userTenantId) {
        throw new Error('User must be assigned to a tenant');
      }

      // In a real implementation, this would fetch from a dedicated tenant API
      // Each tenant has completely isolated infrastructure
      const dedicatedTenant: Tenant = {
        id: userTenantId,
        name: user?.user_metadata?.tenant_name || 'Enterprise Organization',
        subdomain: user?.user_metadata?.subdomain || 'enterprise',
        logo: user?.user_metadata?.tenant_logo,
        primaryColor: '#2563EB',
        secondaryColor: '#DBEAFE',
        plan: 'enterprise',
        features: [
          'voice_agents', 
          'analytics', 
          'integrations', 
          'custom_branding', 
          'api_access', 
          'white_label',
          'dedicated_infrastructure',
          'full_isolation'
        ],
        settings: {
          timezone: user?.user_metadata?.timezone || 'America/New_York',
          currency: 'USD',
          dateFormat: 'MM/DD/YYYY',
          businessHours: {
            start: '08:00',
            end: '18:00',
            timezone: user?.user_metadata?.timezone || 'America/New_York',
          },
        },
        quotas: {
          maxAgents: 100, // Enterprise unlimited represented as high number
          maxCallsPerMonth: 100000,
          maxStorageGB: 1000,
          currentUsage: {
            agents: 0, // This would come from tenant-specific API
            callsThisMonth: 0,
            storageUsedGB: 0,
          },
        },
        infrastructure: {
          dedicatedDatabase: `db-${userTenantId}`,
          dedicatedStorage: `storage-${userTenantId}`,
          dedicatedCompute: `compute-${userTenantId}`,
          isolationLevel: 'full',
        },
      };

      setCurrentTenant(dedicatedTenant);
      localStorage.setItem(TENANT_STORAGE_KEY, userTenantId);
      
    } catch (error) {
      console.error('Error loading tenant data:', error);
      toast.error('Failed to load tenant information');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTenantSettings = async (settings: Partial<Tenant['settings']>) => {
    if (!currentTenant) return;

    setIsLoading(true);
    try {
      // API call to tenant-specific infrastructure
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedTenant = {
        ...currentTenant,
        settings: {
          ...currentTenant.settings,
          ...settings,
        },
      };
      
      setCurrentTenant(updatedTenant);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating tenant settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const getTenantQuotaUsage = () => {
    if (!currentTenant) {
      return {
        agents: { used: 0, max: 0, percentage: 0 },
        calls: { used: 0, max: 0, percentage: 0 },
        storage: { used: 0, max: 0, percentage: 0 },
      };
    }

    const { quotas } = currentTenant;
    return {
      agents: {
        used: quotas.currentUsage.agents,
        max: quotas.maxAgents,
        percentage: Math.round((quotas.currentUsage.agents / quotas.maxAgents) * 100),
      },
      calls: {
        used: quotas.currentUsage.callsThisMonth,
        max: quotas.maxCallsPerMonth,
        percentage: Math.round((quotas.currentUsage.callsThisMonth / quotas.maxCallsPerMonth) * 100),
      },
      storage: {
        used: quotas.currentUsage.storageUsedGB,
        max: quotas.maxStorageGB,
        percentage: Math.round((quotas.currentUsage.storageUsedGB / quotas.maxStorageGB) * 100),
      },
    };
  };

  const value: TenantContextType = {
    currentTenant,
    isLoading,
    updateTenantSettings,
    getTenantQuotaUsage,
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
