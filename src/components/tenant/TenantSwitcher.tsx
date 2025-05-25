
import React from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Crown } from 'lucide-react';

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
        return 'bg-amber-100 text-amber-800';
      case 'professional':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentTenant.id}
        onValueChange={switchTenant}
        disabled={isLoading}
      >
        <SelectTrigger className="w-64">
          <SelectValue>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <Building2 className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="truncate">{currentTenant.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableTenants.map((tenant) => (
            <SelectItem key={tenant.id} value={tenant.id}>
              <div className="flex items-center gap-2 w-full">
                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                  <Building2 className="h-3 w-3 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{tenant.name}</div>
                  <div className="text-sm text-muted-foreground">{tenant.subdomain}.voiceorchestrate.com</div>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getPlanColor(tenant.plan)}`}
                >
                  {getPlanIcon(tenant.plan)}
                  {tenant.plan}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
