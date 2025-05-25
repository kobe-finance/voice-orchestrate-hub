
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, ExternalLink, Check, AlertCircle } from 'lucide-react';

const CRMIntegration = () => {
  const [connectedCRMs, setConnectedCRMs] = useState([
    { id: 'salesforce', name: 'Salesforce', connected: true, status: 'active' },
    { id: 'hubspot', name: 'HubSpot', connected: false, status: 'inactive' }
  ]);

  const crmOptions = [
    { id: 'salesforce', name: 'Salesforce', description: 'Connect to Salesforce CRM', logo: '🏢' },
    { id: 'hubspot', name: 'HubSpot', description: 'Integrate with HubSpot CRM', logo: '🎯' },
    { id: 'pipedrive', name: 'Pipedrive', description: 'Sync with Pipedrive', logo: '📊' },
    { id: 'zoho', name: 'Zoho CRM', description: 'Connect to Zoho CRM', logo: '🔧' }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">CRM Integration</h1>
          <p className="text-muted-foreground">Connect and manage your CRM integrations</p>
        </div>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations">Available Integrations</TabsTrigger>
          <TabsTrigger value="connected">Connected CRMs</TabsTrigger>
          <TabsTrigger value="settings">Sync Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {crmOptions.map((crm) => {
              const isConnected = connectedCRMs.find(c => c.id === crm.id)?.connected;
              return (
                <Card key={crm.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{crm.logo}</span>
                        <div>
                          <CardTitle className="text-lg">{crm.name}</CardTitle>
                          <CardDescription>{crm.description}</CardDescription>
                        </div>
                      </div>
                      {isConnected ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Not Connected</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant={isConnected ? "outline" : "default"} 
                      className="w-full"
                    >
                      {isConnected ? "Manage" : "Connect"}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="connected" className="space-y-4">
          <div className="space-y-4">
            {connectedCRMs.filter(crm => crm.connected).map((crm) => (
              <Card key={crm.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{crm.name}</CardTitle>
                      <CardDescription>Last sync: 2 hours ago</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {crm.status}
                      </Badge>
                      <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>Contacts Synced</Label>
                      <p className="font-medium">1,247</p>
                    </div>
                    <div>
                      <Label>Last Activity</Label>
                      <p className="font-medium">Today, 2:30 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sync Settings</CardTitle>
              <CardDescription>Configure how data syncs between systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-sync contacts</Label>
                  <p className="text-sm text-muted-foreground">Automatically sync new contacts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Sync call logs</Label>
                  <p className="text-sm text-muted-foreground">Create activities for completed calls</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Sync interval</Label>
                <select className="w-full p-2 border rounded">
                  <option>Every 15 minutes</option>
                  <option>Every hour</option>
                  <option>Every 4 hours</option>
                  <option>Daily</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMIntegration;
