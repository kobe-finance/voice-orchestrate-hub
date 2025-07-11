
import React from 'react';
import { useTenantData } from '@/hooks/useTenantAPI';
import { Badge } from '@/components/ui/badge';
import { Shield, Building2 } from 'lucide-react';

export const TenantIsolationIndicator: React.FC = () => {
  const { data: currentTenant } = useTenantData();

  if (!currentTenant) return null;

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant="outline" 
        className="border bg-green-100 text-green-800 border-green-300"
      >
        <Shield className="h-3 w-3 mr-1" />
        Isolated
      </Badge>
      <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
        <Building2 className="h-3 w-3" />
        <span>{currentTenant.name}</span>
      </div>
      
      {/* Tenant Status */}
      <div className="hidden lg:flex items-center gap-2 ml-2">
        <div className="flex items-center gap-1 text-xs text-green-600">
          <span>Tier: {currentTenant.subscription_tier || 'Free'}</span>
        </div>
      </div>
    </div>
  );
};
