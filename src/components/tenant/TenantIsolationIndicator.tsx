
import React from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Globe, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const TenantIsolationIndicator: React.FC = () => {
  const { currentTenant } = useTenant();

  if (!currentTenant) return null;

  const getIsolationConfig = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return {
          level: 'Full Isolation',
          icon: Shield,
          color: 'bg-green-100 text-green-800 border-green-300',
          description: 'Dedicated infrastructure',
          priority: 'high'
        };
      case 'professional':
        return {
          level: 'Shared Isolation',
          icon: Lock,
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          description: 'Isolated data layer',
          priority: 'medium'
        };
      default:
        return {
          level: 'Basic Isolation',
          icon: Globe,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          description: 'Application-level isolation',
          priority: 'basic'
        };
    }
  };

  const config = getIsolationConfig(currentTenant.plan);
  const IconComponent = config.icon;

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant="outline" 
        className={cn("border text-xs", config.color)}
      >
        <IconComponent className="h-3 w-3 mr-1" />
        {config.level}
      </Badge>
      <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
        <span>•</span>
        <span>{config.description}</span>
      </div>
    </div>
  );
};
