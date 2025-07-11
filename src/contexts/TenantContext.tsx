
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface TenantContextType {
  tenantId: string | null;
}

const TenantContext = React.createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  // Simple tenant ID provider - no complex logic
  const tenantId = user?.user_metadata?.tenant_id || null;

  const value: TenantContextType = {
    tenantId,
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
