
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  plan: 'starter' | 'professional' | 'enterprise';
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
}

interface TenantContextType {
  currentTenant: Tenant | null;
  availableTenants: Tenant[];
  isLoading: boolean;
  switchTenant: (tenantId: string) => Promise<void>;
  updateTenantSettings: (settings: Partial<Tenant['settings']>) => Promise<void>;
  getTenantQuotaUsage: () => {
    agents: { used: number; max: number; percentage: number };
    calls: { used: number; max: number; percentage: number };
    storage: { used: number; max: number; percentage: number };
  };
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

const TENANT_STORAGE_KEY = 'voiceorchestrate_current_tenant';

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, isAuthenticated } = useAuth();

  // Load tenant data when user authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      loadTenantData();
    } else {
      setCurrentTenant(null);
      setAvailableTenants([]);
    }
  }, [isAuthenticated, user]);

  const loadTenantData = async () => {
    setIsLoading(true);
    try {
      // Try to load from localStorage first
      const storedTenantId = localStorage.getItem(TENANT_STORAGE_KEY);
      
      // Simulate API call to get user's tenants
      const mockTenants: Tenant[] = [
        {
          id: 'tenant_1',
          name: 'Acme Plumbing Services',
          subdomain: 'acme-plumbing',
          logo: '/logos/acme-plumbing.png',
          primaryColor: '#2563EB',
          secondaryColor: '#DBEAFE',
          plan: 'professional',
          features: ['voice_agents', 'analytics', 'integrations', 'custom_branding'],
          settings: {
            timezone: 'America/New_York',
            currency: 'USD',
            dateFormat: 'MM/DD/YYYY',
            businessHours: {
              start: '08:00',
              end: '18:00',
              timezone: 'America/New_York',
            },
          },
          quotas: {
            maxAgents: 10,
            maxCallsPerMonth: 5000,
            maxStorageGB: 50,
            currentUsage: {
              agents: 3,
              callsThisMonth: 1247,
              storageUsedGB: 12.5,
            },
          },
        },
        {
          id: 'tenant_2',
          name: 'Elite HVAC Solutions',
          subdomain: 'elite-hvac',
          primaryColor: '#F97316',
          secondaryColor: '#FED7AA',
          plan: 'enterprise',
          features: ['voice_agents', 'analytics', 'integrations', 'custom_branding', 'api_access', 'white_label'],
          settings: {
            timezone: 'America/Los_Angeles',
            currency: 'USD',
            dateFormat: 'MM/DD/YYYY',
            businessHours: {
              start: '07:00',
              end: '19:00',
              timezone: 'America/Los_Angeles',
            },
          },
          quotas: {
            maxAgents: 50,
            maxCallsPerMonth: 25000,
            maxStorageGB: 500,
            currentUsage: {
              agents: 12,
              callsThisMonth: 3891,
              storageUsedGB: 156.7,
            },
          },
        },
      ];

      setAvailableTenants(mockTenants);
      
      // Set current tenant (from storage or user's primary tenant)
      const targetTenantId = storedTenantId || user?.tenantId || mockTenants[0]?.id;
      const targetTenant = mockTenants.find(t => t.id === targetTenantId) || mockTenants[0];
      
      if (targetTenant) {
        setCurrentTenant(targetTenant);
        localStorage.setItem(TENANT_STORAGE_KEY, targetTenant.id);
      }
    } catch (error) {
      console.error('Error loading tenant data:', error);
      toast.error('Failed to load tenant information');
    } finally {
      setIsLoading(false);
    }
  };

  const switchTenant = async (tenantId: string) => {
    if (!availableTenants.length) return;
    
    const tenant = availableTenants.find(t => t.id === tenantId);
    if (!tenant) {
      toast.error('Tenant not found');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to switch tenant context
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCurrentTenant(tenant);
      localStorage.setItem(TENANT_STORAGE_KEY, tenantId);
      toast.success(`Switched to ${tenant.name}`);
      
      // Reload the page to refresh all tenant-specific data
      window.location.reload();
    } catch (error) {
      console.error('Error switching tenant:', error);
      toast.error('Failed to switch tenant');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTenantSettings = async (settings: Partial<Tenant['settings']>) => {
    if (!currentTenant) return;

    setIsLoading(true);
    try {
      // Simulate API call to update tenant settings
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
    availableTenants,
    isLoading,
    switchTenant,
    updateTenantSettings,
    getTenantQuotaUsage,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
