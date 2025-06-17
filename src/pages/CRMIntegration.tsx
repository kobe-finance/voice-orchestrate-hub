
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Database, Settings, Activity } from 'lucide-react';
import { CRMConnector } from '@/components/crm/CRMConnector';
import { toast } from 'sonner';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';

const CRMIntegration = () => {
  const [integrations, setIntegrations] = useState([
    { 
      id: '1', 
      name: 'Salesforce', 
      connected: false, 
      logo: '☁️',
      status: 'disconnected' as const,
      lastSync: undefined
    },
    { 
      id: '2', 
      name: 'HubSpot', 
      connected: false, 
      logo: '🧡',
      status: 'disconnected' as const,
      lastSync: undefined
    },
    { 
      id: '3', 
      name: 'Pipedrive', 
      connected: true, 
      logo: '📊',
      status: 'connected' as const,
      lastSync: '2 hours ago'
    },
    { 
      id: '4', 
      name: 'Zoho CRM', 
      connected: false, 
      logo: '🔧',
      status: 'disconnected' as const,
      lastSync: undefined
    },
  ]);

  const [syncStats] = useState({
    totalContacts: 1247,
    totalDeals: 89,
    recentActivity: 23,
    lastFullSync: '2024-01-15 14:30:00'
  });

  const handleConnect = async (systemId: string, credentials: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIntegrations(prev => 
      prev.map(system => 
        system.id === systemId 
          ? { ...system, connected: true, status: 'connected' as const, lastSync: 'Just now' }
          : system
      )
    );
  };

  const handleDisconnect = async (systemId: string) => {
    setIntegrations(prev => 
      prev.map(system => 
        system.id === systemId 
          ? { ...system, connected: false, status: 'disconnected' as const, lastSync: undefined }
          : system
      )
    );
    toast.success('CRM system disconnected');
  };

  const handleSync = async (systemId: string) => {
    setIntegrations(prev => 
      prev.map(system => 
        system.id === systemId 
          ? { ...system, status: 'syncing' as const }
          : system
      )
    );

    // Simulate sync
    setTimeout(() => {
      setIntegrations(prev => 
        prev.map(system => 
          system.id === systemId 
            ? { ...system, status: 'connected' as const, lastSync: 'Just now' }
            : system
        )
      );
    }, 3000);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>CRM Integration</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <CRMConnector 
            systems={integrations}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onSync={handleSync}
          />
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{syncStats.totalContacts}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{syncStats.totalDeals}</div>
                <p className="text-xs text-muted-foreground">
                  +5 new this week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{syncStats.recentActivity}</div>
                <p className="text-xs text-muted-foreground">
                  In the last 24 hours
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold">2 hours ago</div>
                <p className="text-xs text-muted-foreground">
                  Auto-sync enabled
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sync History</CardTitle>
              <CardDescription>Recent synchronization activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Pipedrive Sync</p>
                    <p className="text-sm text-muted-foreground">15 contacts updated, 3 new deals</p>
                  </div>
                  <div className="text-sm text-muted-foreground">2 hours ago</div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">HubSpot Sync</p>
                    <p className="text-sm text-muted-foreground">42 contacts updated, 1 new company</p>
                  </div>
                  <div className="text-sm text-muted-foreground">1 day ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CRM Analytics</CardTitle>
              <CardDescription>Insights from your connected CRM systems</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">CRM analytics dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>Configure sync frequency and data mapping</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Integration settings will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMIntegration;
