
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Settings, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface CRMSystem {
  id: string;
  name: string;
  logo: string;
  connected: boolean;
  apiKey?: string;
  webhookUrl?: string;
  lastSync?: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
}

interface CRMConnectorProps {
  systems: CRMSystem[];
  onConnect: (systemId: string, credentials: any) => Promise<void>;
  onDisconnect: (systemId: string) => Promise<void>;
  onSync: (systemId: string) => Promise<void>;
}

export const CRMConnector: React.FC<CRMConnectorProps> = ({
  systems,
  onConnect,
  onDisconnect,
  onSync
}) => {
  const [selectedSystem, setSelectedSystem] = useState<CRMSystem | null>(null);
  const [credentials, setCredentials] = useState({ apiKey: '', webhookUrl: '' });
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!selectedSystem) return;
    
    setIsConnecting(true);
    try {
      await onConnect(selectedSystem.id, credentials);
      toast.success(`Connected to ${selectedSystem.name} successfully`);
      setCredentials({ apiKey: '', webhookUrl: '' });
    } catch (error) {
      toast.error(`Failed to connect to ${selectedSystem.name}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSync = async (system: CRMSystem) => {
    try {
      await onSync(system.id);
      toast.success(`Syncing ${system.name} data...`);
    } catch (error) {
      toast.error(`Failed to sync ${system.name}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {systems.map((system) => (
          <Card key={system.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{system.logo}</span>
                  <div>
                    <CardTitle className="text-lg">{system.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {system.status === 'connected' && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                      {system.status === 'error' && (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Error
                        </Badge>
                      )}
                      {system.status === 'syncing' && (
                        <Badge variant="secondary">
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          Syncing
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {system.connected && (
                  <div className="text-sm text-gray-600">
                    <p>Last sync: {system.lastSync || 'Never'}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  {system.connected ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSync(system)}
                        disabled={system.status === 'syncing'}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDisconnect(system.id)}
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setSelectedSystem(system)}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedSystem && (
        <Card>
          <CardHeader>
            <CardTitle>Connect to {selectedSystem.name}</CardTitle>
            <CardDescription>
              Enter your API credentials to connect your {selectedSystem.name} account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your API key"
                  value={credentials.apiKey}
                  onChange={(e) => setCredentials(prev => ({ ...prev, apiKey: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
                <Input
                  id="webhookUrl"
                  placeholder="https://your-webhook-url.com"
                  value={credentials.webhookUrl}
                  onChange={(e) => setCredentials(prev => ({ ...prev, webhookUrl: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleConnect} disabled={isConnecting || !credentials.apiKey}>
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </Button>
                <Button variant="outline" onClick={() => setSelectedSystem(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
