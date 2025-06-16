
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Settings, CheckCircle } from 'lucide-react';

const CRMIntegration = () => {
  const [integrations, setIntegrations] = useState([
    { id: '1', name: 'Salesforce', connected: true, logo: '☁️' },
    { id: '2', name: 'HubSpot', connected: false, logo: '🧡' },
    { id: '3', name: 'Pipedrive', connected: true, logo: '📊' },
    { id: '4', name: 'Zoho CRM', connected: false, logo: '🔧' },
  ]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">CRM Integration</h1>
          <p className="text-muted-foreground">Connect your customer relationship management systems</p>
        </div>
        <Button>
          <Building2 className="mr-2 h-4 w-4" />
          Add Integration
        </Button>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations">CRM Systems</TabsTrigger>
          <TabsTrigger value="sync">Data Sync</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{integration.logo}</span>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                    </div>
                    {integration.connected ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Not Connected</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant={integration.connected ? "outline" : "default"} className="w-full">
                    {integration.connected ? (
                      <>
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </>
                    ) : (
                      'Connect'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Synchronization</CardTitle>
              <CardDescription>Configure how data syncs between systems</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Data sync settings will be configured here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>Global CRM integration preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Integration settings configuration will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMIntegration;
