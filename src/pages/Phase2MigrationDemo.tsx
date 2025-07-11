/**
 * Phase 2 Migration Demo Page
 * Demonstrates side-by-side comparison of old vs new hooks
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HookMigrationProvider } from '@/hooks/useHookMigrationFlags';
import HookMigrationControlPanel from '@/components/test/HookMigrationControlPanel';
import Phase1ValidationComponent from '@/components/test/Phase1ValidationComponent';
import { useIntegrationsAPI } from '@/hooks/useIntegrationsAPI';
import { useIntegrationsSmartMigration } from '@/hooks/useIntegrationsSmartMigration';
import { Activity, GitBranch, Zap, Database } from 'lucide-react';

const IntegrationHookDemo: React.FC = () => {
  const newHook = useIntegrationsAPI();
  const smartHook = useIntegrationsSmartMigration();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* New API Hook */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-600" />
            New API Hook
            <Badge variant="default">Phase 2</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Pure API calls, zero business logic</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 border rounded">
                <div className="font-medium">{newHook.integrations.length}</div>
                <div className="text-muted-foreground">Integrations</div>
              </div>
              <div className="text-center p-2 border rounded">
                <div className="font-medium">{newHook.credentials.length}</div>
                <div className="text-muted-foreground">Credentials</div>
              </div>
              <div className="text-center p-2 border rounded">
                <div className="font-medium">{newHook.userIntegrations.length}</div>
                <div className="text-muted-foreground">Installed</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Loading States:</div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant={newHook.isLoadingIntegrations ? 'destructive' : 'secondary'}>
                Integrations: {newHook.isLoadingIntegrations ? 'Loading' : 'Ready'}
              </Badge>
              <Badge variant={newHook.isLoadingCredentials ? 'destructive' : 'secondary'}>
                Credentials: {newHook.isLoadingCredentials ? 'Loading' : 'Ready'}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Actions Available:</div>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                variant="outline"
                disabled={newHook.createCredential.isLoading}
              >
                Create Credential
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                disabled={newHook.testCredential.isLoading}
              >
                Test Connection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Migration Hook */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-blue-600" />
            Smart Migration Hook
            <Badge variant="secondary">Adaptive</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Automatically switches based on feature flags</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 border rounded">
                <div className="font-medium">{smartHook.availableIntegrations.length}</div>
                <div className="text-muted-foreground">Integrations</div>
              </div>
              <div className="text-center p-2 border rounded">
                <div className="font-medium">{smartHook.userCredentials.length}</div>
                <div className="text-muted-foreground">Credentials</div>
              </div>
              <div className="text-center p-2 border rounded">
                <div className="font-medium">{smartHook.userIntegrations.length}</div>
                <div className="text-muted-foreground">Installed</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Loading States:</div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant={smartHook.isLoading ? 'destructive' : 'secondary'}>
                Overall: {smartHook.isLoading ? 'Loading' : 'Ready'}
              </Badge>
              <Badge variant={smartHook.isAddingCredential ? 'destructive' : 'secondary'}>
                Adding: {smartHook.isAddingCredential ? 'Active' : 'Idle'}
              </Badge>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-xs">
              This hook maintains backward compatibility while allowing gradual migration to the new API-based system.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Phase2MigrationDemoPage: React.FC = () => {
  return (
    <HookMigrationProvider>
      <div className="container mx-auto py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Phase 2: Hook Migration Demo</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This page demonstrates the migration from business logic-heavy hooks to simple API-based hooks.
            Use the control panel to test the migration system with feature flags.
          </p>
        </div>

        <Tabs defaultValue="migration-control" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="migration-control" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Migration Control
            </TabsTrigger>
            <TabsTrigger value="hook-comparison" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Hook Comparison
            </TabsTrigger>
            <TabsTrigger value="phase1-validation" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Phase 1 Status
            </TabsTrigger>
            <TabsTrigger value="migration-stats" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Migration Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="migration-control" className="space-y-6">
            <HookMigrationControlPanel />
          </TabsContent>

          <TabsContent value="hook-comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Hook Comparison</CardTitle>
                <p className="text-muted-foreground">
                  Compare the new API-based hooks with the smart migration layer in real-time.
                </p>
              </CardHeader>
              <CardContent>
                <IntegrationHookDemo />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="phase1-validation" className="space-y-6">
            <Phase1ValidationComponent />
          </TabsContent>

          <TabsContent value="migration-stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lines of Code Reduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>useIntegrations.tsx:</span>
                      <span>325 → 50 lines</span>
                    </div>
                    <div className="flex justify-between">
                      <span>useIntegrationsNew.ts:</span>
                      <span>148 → 40 lines</span>
                    </div>
                    <div className="border-t pt-2 font-medium">
                      <div className="flex justify-between">
                        <span>Total Reduction:</span>
                        <span className="text-green-600">-383 lines</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Logic Removal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="w-8 h-6 text-xs">❌</Badge>
                      <span>Credential encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="w-8 h-6 text-xs">❌</Badge>
                      <span>Validation logic</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="w-8 h-6 text-xs">❌</Badge>
                      <span>Direct Supabase queries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="w-8 h-6 text-xs">❌</Badge>
                      <span>Tenant management</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">API Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="w-8 h-6 text-xs">✅</Badge>
                      <span>Type safety</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="w-8 h-6 text-xs">✅</Badge>
                      <span>Error handling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="w-8 h-6 text-xs">✅</Badge>
                      <span>Consistent auth</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="w-8 h-6 text-xs">✅</Badge>
                      <span>Backward compatible</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </HookMigrationProvider>
  );
};

export default Phase2MigrationDemoPage;