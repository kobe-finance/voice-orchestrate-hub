
import React from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { Badge } from '@/components/ui/badge';
import { Shield, Server, Database } from 'lucide-react';

export const TenantIsolationIndicator: React.FC = () => {
  const { currentTenant } = useTenant();

  if (!currentTenant) return null;

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant="outline" 
        className="border bg-green-100 text-green-800 border-green-300"
      >
        <Shield className="h-3 w-3 mr-1" />
        Full Isolation
      </Badge>
      <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
        <span>•</span>
        <span>Dedicated infrastructure</span>
      </div>
      
      {/* Infrastructure Details */}
      <div className="hidden lg:flex items-center gap-2 ml-2">
        <div className="flex items-center gap-1 text-xs text-green-600">
          <Database className="h-3 w-3" />
          <span>DB: {currentTenant.infrastructure.dedicatedDatabase}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-blue-600">
          <Server className="h-3 w-3" />
          <span>Compute: {currentTenant.infrastructure.dedicatedCompute}</span>
        </div>
      </div>
    </div>
  );
};
