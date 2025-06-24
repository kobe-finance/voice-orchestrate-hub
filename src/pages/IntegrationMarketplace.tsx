
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Store, Settings, CheckCircle } from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';
import { useIntegrations } from '@/hooks/useIntegrations';
import IntegrationCard from '@/components/integrations/IntegrationCard';

const IntegrationMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const {
    availableIntegrations,
    userCredentials,
    userIntegrations,
    isLoading,
    addCredential,
    isAddingCredential,
  } = useIntegrations();

  // Filter integrations based on search and category
  const filteredIntegrations = availableIntegrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories from integrations
  const categories = Array.from(new Set(availableIntegrations.map(i => i.category)));

  // Group integrations by installation status
  const installedIntegrations = userIntegrations.map(ui => ui.integration).filter(Boolean);
  const availableToInstall = filteredIntegrations.filter(integration => 
    !installedIntegrations.some(installed => installed.id === integration.id)
  );

  const handleTestConnection = async (credentialId: string) => {
    // This will be implemented with edge function to Python backend
    console.log('Testing connection for credential:', credentialId);
    // TODO: Call edge function to test connection
  };

  const handleInstallIntegration = async (integrationId: string, credentialId: string) => {
    // This will be implemented with edge function to Python backend
    console.log('Installing integration:', integrationId, 'with credential:', credentialId);
    // TODO: Call edge function to install integration
  };

  const handleUninstallIntegration = async (userIntegrationId: string) => {
    // This will be implemented with edge function to Python backend
    console.log('Uninstalling integration:', userIntegrationId);
    // TODO: Call edge function to uninstall integration
  };

  const getCredentialsForIntegration = (integrationId: string) => {
    return userCredentials.filter(cred => cred.integration_id === integrationId);
  };

  const getUserIntegrationForIntegration = (integrationId: string) => {
    return userIntegrations.find(ui => ui.integration_id === integrationId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="p-4 md:p-6 space-y-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading integrations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-4 md:p-6 space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Integration Marketplace</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary-600 to-accent-orange bg-clip-text text-transparent">
              Integration Marketplace
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Connect your favorite tools and services to VoiceOrchestrate
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Card className="p-2">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{installedIntegrations.length} Active</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="available" className="space-y-4">
          <TabsList>
            <TabsTrigger value="available" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Available ({availableToInstall.length})
            </TabsTrigger>
            <TabsTrigger value="installed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Installed ({installedIntegrations.length})
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Manage Credentials
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            {availableToInstall.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    {searchTerm || selectedCategory !== "all" 
                      ? "No integrations match your search criteria."
                      : "All available integrations are already installed."
                    }
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableToInstall.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    credentials={getCredentialsForIntegration(integration.id)}
                    userIntegration={getUserIntegrationForIntegration(integration.id)}
                    onAddCredential={addCredential}
                    onTestConnection={handleTestConnection}
                    onInstall={handleInstallIntegration}
                    isLoading={isAddingCredential}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="installed" className="space-y-4">
            {installedIntegrations.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    No integrations installed yet. Browse the Available tab to get started.
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {installedIntegrations.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    credentials={getCredentialsForIntegration(integration.id)}
                    userIntegration={getUserIntegrationForIntegration(integration.id)}
                    onAddCredential={addCredential}
                    onTestConnection={handleTestConnection}
                    onUninstall={handleUninstallIntegration}
                    isLoading={isAddingCredential}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Credential Management</CardTitle>
                <CardDescription>
                  View and manage all your API credentials and connection status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userCredentials.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No credentials added yet. Add credentials from the Available tab.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userCredentials.map((credential) => {
                      const integration = availableIntegrations.find(i => i.id === credential.integration_id);
                      if (!integration) return null;
                      
                      return (
                        <div key={credential.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <div className="font-medium">{integration.name}</div>
                            <div className="text-sm text-muted-foreground">{credential.credential_name}</div>
                            <div className="text-xs text-muted-foreground">
                              Added {new Date(credential.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`px-2 py-1 rounded text-xs ${
                              credential.last_test_status === 'success' 
                                ? 'bg-green-100 text-green-700'
                                : credential.last_test_status === 'failed'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {credential.last_test_status || 'Not tested'}
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleTestConnection(credential.id)}
                            >
                              Test
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IntegrationMarketplace;
