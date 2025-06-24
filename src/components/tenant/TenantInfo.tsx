
import React from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Shield, Database, Server, HardDrive } from 'lucide-react';

export const TenantInfo: React.FC = () => {
  const { currentTenant } = useTenant();

  if (!currentTenant) return null;

  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Tenant Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <div className="font-medium">{currentTenant.name}</div>
                <div className="text-xs text-muted-foreground">
                  {currentTenant.subdomain}.voiceorchestrate.com
                </div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-300">
              <Shield className="h-3 w-3 mr-1" />
              Enterprise
            </Badge>
          </div>

          {/* Infrastructure Isolation Details */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">
              Dedicated Infrastructure
            </div>
            
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                <Database className="h-3 w-3 text-green-600" />
                <span className="font-medium">Database:</span>
                <span className="text-green-700">{currentTenant.infrastructure.dedicatedDatabase}</span>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                <Server className="h-3 w-3 text-blue-600" />
                <span className="font-medium">Compute:</span>
                <span className="text-blue-700">{currentTenant.infrastructure.dedicatedCompute}</span>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                <HardDrive className="h-3 w-3 text-purple-600" />
                <span className="font-medium">Storage:</span>
                <span className="text-purple-700">{currentTenant.infrastructure.dedicatedStorage}</span>
              </div>
            </div>
          </div>

          {/* Zero Trust Badge */}
          <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded border border-emerald-200">
            <Shield className="h-4 w-4 text-emerald-600" />
            <div className="flex-1">
              <div className="text-sm font-medium text-emerald-800">Zero-Trust Architecture</div>
              <div className="text-xs text-emerald-600">Complete data and infrastructure isolation</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
