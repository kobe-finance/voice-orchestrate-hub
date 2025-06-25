
import React from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Shield, Users, Settings } from 'lucide-react';

export const TenantInfo: React.FC = () => {
  const { currentTenant, userRole } = useTenant();

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
                  {currentTenant.slug}
                </div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-300">
              <Shield className="h-3 w-3 mr-1" />
              {currentTenant.subscription_tier || 'Free'}
            </Badge>
          </div>

          {/* User Role */}
          {userRole && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
              <Users className="h-3 w-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">
                Your role: {userRole}
              </span>
            </div>
          )}

          {/* Organization Settings */}
          <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
            <Settings className="h-3 w-3 text-purple-600" />
            <span className="text-xs text-purple-700">
              Organization ID: {currentTenant.id.slice(0, 8)}...
            </span>
          </div>

          {/* Tenant Isolation Badge */}
          <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded border border-emerald-200">
            <Shield className="h-4 w-4 text-emerald-600" />
            <div className="flex-1">
              <div className="text-sm font-medium text-emerald-800">Multi-Tenant Architecture</div>
              <div className="text-xs text-emerald-600">Complete data isolation between organizations</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
