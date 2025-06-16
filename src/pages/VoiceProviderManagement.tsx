
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card-modern';
import { Button } from '@/components/ui/button-modern';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Settings, Headphones, Zap, Mic, Volume2 } from 'lucide-react';

const VoiceProviderManagement = () => {
  const [providers, setProviders] = useState([
    { id: '1', name: 'ElevenLabs', status: 'connected', type: 'premium', description: 'High-quality AI voice synthesis' },
    { id: '2', name: 'Azure Speech', status: 'disconnected', type: 'standard', description: 'Microsoft\'s speech services' },
    { id: '3', name: 'Google Cloud', status: 'connected', type: 'standard', description: 'Google\'s text-to-speech API' },
  ]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Voice Provider Management</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="mt-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary-600 to-accent-orange bg-clip-text text-transparent">
                  Voice Provider Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Configure and manage voice synthesis providers for your AI agents.</p>
              </div>
            </div>
            <Button variant="gradient" leftIcon={<Zap className="h-4 w-4" />}>
              Add Provider
            </Button>
          </div>

          <Tabs defaultValue="providers" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-sm">
              <TabsTrigger value="providers" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Providers
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="providers" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map((provider) => (
                  <Card key={provider.id} variant="interactive" className="group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Volume2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{provider.name}</CardTitle>
                            <Badge variant={provider.status === 'connected' ? 'default' : 'secondary'} className="mt-1">
                              {provider.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="mt-2">{provider.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" leftIcon={<Settings className="h-4 w-4" />}>
                          Configure
                        </Button>
                        <Button size="sm" variant="outline" leftIcon={<Headphones className="h-4 w-4" />}>
                          Test
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Provider Settings
                  </CardTitle>
                  <CardDescription>Configure global voice provider preferences and fallback options.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-border bg-muted/30">
                      <h4 className="font-medium mb-2">Default Provider Priority</h4>
                      <p className="text-sm text-muted-foreground">Set the order of providers for voice synthesis requests.</p>
                    </div>
                    <div className="p-4 rounded-lg border border-border bg-muted/30">
                      <h4 className="font-medium mb-2">Quality Settings</h4>
                      <p className="text-sm text-muted-foreground">Configure voice quality and processing preferences.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VoiceProviderManagement;
