
import React from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users, Crown, Shield, Globe, Lock } from 'lucide-react';

export const TenantSwitcher: React.FC = () => {
  const { currentTenant, availableTenants, switchTenant, isLoading } = useTenant();

  if (!currentTenant || availableTenants.length === 0) {
    return null;
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return <Crown className="h-3 w-3" />;
      case 'professional':
        return <Users className="h-3 w-3" />;
      default:
        return <Building2 className="h-3 w-3" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'professional':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getIsolationLevel = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return { level: 'Full Isolation', icon: <Shield className="h-3 w-3" />, color: 'text-green-600' };
      case 'professional':
        return { level: 'Shared Isolation', icon: <Lock className="h-3 w-3" />, color: 'text-blue-600' };
      default:
        return { level: 'Basic Isolation', icon: <Globe className="h-3 w-3" />, color: 'text-gray-600' };
    }
  };

  const isolation = getIsolationLevel(currentTenant.plan);

  return (
    <div className="space-y-3">
      <Select
        value={currentTenant.id}
        onValueChange={switchTenant}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <Building2 className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="truncate font-medium">{currentTenant.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="w-80">
          {availableTenants.map((tenant) => {
            const tenantIsolation = getIsolationLevel(tenant.plan);
            return (
              <SelectItem key={tenant.id} value={tenant.id} className="p-3">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-8 h-8 rounded bg-primary flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-medium truncate">{tenant.name}</div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs border ${getPlanColor(tenant.plan)}`}
                      >
                        {getPlanIcon(tenant.plan)}
                        {tenant.plan}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {tenant.subdomain}.voiceorchestrate.com
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${tenantIsolation.color} mt-1`}>
                      {tenantIsolation.icon}
                      {tenantIsolation.level}
                    </div>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {/* Tenant Isolation Indicator Card */}
      <Card className="bg-muted/50">
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Current Environment</span>
              <Badge 
                variant="outline" 
                className={`text-xs ${getPlanColor(currentTenant.plan)}`}
              >
                {getPlanIcon(currentTenant.plan)}
                {currentTenant.plan}
              </Badge>
            </div>
            <div className={`flex items-center gap-2 text-xs ${isolation.color}`}>
              {isolation.icon}
              <span className="font-medium">{isolation.level}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Subdomain: {currentTenant.subdomain}.voiceorchestrate.com
            </div>
            {currentTenant.plan === 'enterprise' && (
              <div className="flex items-center gap-1 text-xs text-green-600 mt-2 p-2 bg-green-50 rounded">
                <Shield className="h-3 w-3" />
                <span>Dedicated infrastructure & data isolation</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
