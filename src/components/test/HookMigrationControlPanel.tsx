/**
 * Phase 2 Migration Control Panel Component
 * UI for managing hook migration feature flags
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Flag, CheckCircle, XCircle } from 'lucide-react';
import { useHookMigrationFlags } from '@/hooks/useHookMigrationFlags';

export const HookMigrationControlPanel: React.FC = () => {
  const { flags, toggleFlag, enableAll, disableAll } = useHookMigrationFlags();

  const migrationItems = [
    {
      key: 'useNewIntegrationsAPI' as const,
      title: 'Integrations API',
      description: 'Use new API-based integration hooks instead of direct Supabase queries',
      status: flags.useNewIntegrationsAPI ? 'active' : 'legacy',
    },
    {
      key: 'useNewOrganizationsAPI' as const,
      title: 'Organizations API',
      description: 'Use new tenant/organization management API hooks',
      status: flags.useNewOrganizationsAPI ? 'active' : 'legacy',
    },
    {
      key: 'useNewAnalyticsAPI' as const,
      title: 'Analytics API',
      description: 'Use new analytics and usage data API hooks',
      status: flags.useNewAnalyticsAPI ? 'active' : 'legacy',
    },
    {
      key: 'useNewAgentsAPI' as const,
      title: 'Agents API',
      description: 'Use new voice agent management API hooks',
      status: flags.useNewAgentsAPI ? 'active' : 'legacy',
    },
    {
      key: 'useNewAuthAPI' as const,
      title: 'Authentication API',
      description: 'Use new authentication API hooks',
      status: flags.useNewAuthAPI ? 'active' : 'legacy',
    },
  ];

  const activeCount = Object.values(flags).filter(Boolean).length;
  const totalCount = Object.keys(flags).length;
  const migrationProgress = (activeCount / totalCount) * 100;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Phase 2: Hook Migration Control Panel
          <Badge variant={migrationProgress === 100 ? 'default' : 'secondary'}>
            {activeCount}/{totalCount} Migrated
          </Badge>
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${migrationProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Migration Progress: {migrationProgress.toFixed(0)}%
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={enableAll}
              disabled={migrationProgress === 100}
            >
              Enable All
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={disableAll}
              disabled={migrationProgress === 0}
            >
              Disable All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {migrationItems.map((item) => (
            <div 
              key={item.key}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {flags[item.key] ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <Flag className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge 
                  variant={item.status === 'active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {item.status === 'active' ? 'API Mode' : 'Legacy Mode'}
                </Badge>
                <Switch
                  checked={flags[item.key]}
                  onCheckedChange={() => toggleFlag(item.key)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Phase 2 Migration Benefits:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>✅ Reduced hook complexity (325→50 lines)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>✅ Centralized error handling</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>✅ Eliminated business logic in frontend</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>✅ Type-safe API operations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>✅ Consistent authentication flow</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>✅ Backward compatibility maintained</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-800 text-sm">
            <strong>Migration Strategy:</strong> Enable flags gradually to test each hook replacement. 
            The smart migration layer ensures backward compatibility while allowing incremental testing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HookMigrationControlPanel;