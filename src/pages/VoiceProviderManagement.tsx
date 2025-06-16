
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Headphones, Zap } from 'lucide-react';

const VoiceProviderManagement = () => {
  const [providers, setProviders] = useState([
    { id: '1', name: 'ElevenLabs', status: 'connected', type: 'premium' },
    { id: '2', name: 'Azure Speech', status: 'disconnected', type: 'standard' },
    { id: '3', name: 'Google Cloud', status: 'connected', type: 'standard' },
  ]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Voice Provider Management</h1>
          <p className="text-muted-foreground">Configure and manage voice synthesis providers</p>
        </div>
        <Button>
          <Zap className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </div>

      <Tabs defaultValue="providers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((provider) => (
              <Card key={provider.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                    <Badge variant={provider.status === 'connected' ? 'default' : 'secondary'}>
                      {provider.status}
                    </Badge>
                  </div>
                  <CardDescription>{provider.type} provider</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      <Headphones className="h-4 w-4 mr-1" />
                      Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Provider Settings</CardTitle>
              <CardDescription>Configure global voice provider preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Provider settings configuration will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VoiceProviderManagement;
