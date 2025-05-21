
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Check, X, Settings, AlertTriangle, Server, WifiOff, TrendingUp } from "lucide-react";
import { formatDate, getStatusColor, getStatusBgColor, calculateCost } from "@/lib/utils";
import { voiceProviders } from "@/data/voice-data";
import ProviderConfigForm from "@/components/voice/ProviderConfigForm";
import ProviderCostComparison from "@/components/voice/ProviderCostComparison";
import ProviderFallbackOrder from "@/components/voice/ProviderFallbackOrder";

const VoiceProviderManagement = () => {
  const [providers, setProviders] = useState(voiceProviders);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [activeSampleCount, setActiveSampleCount] = useState(5000);
  
  // Find currently primary provider
  const primaryProvider = providers.find(p => p.isPrimary);

  // Function to simulate a provider status check
  const checkProviderStatus = async (providerId: string) => {
    toast.info(`Checking status of ${providers.find(p => p.id === providerId)?.name}...`);
    
    // In a real app this would call an API endpoint
    setTimeout(() => {
      toast.success(`Status check complete for ${providers.find(p => p.id === providerId)?.name}`);
    }, 1500);
  };

  // Function to set a provider as primary
  const setProviderAsPrimary = (providerId: string) => {
    const updatedProviders = providers.map(p => ({
      ...p,
      isPrimary: p.id === providerId
    }));
    
    setProviders(updatedProviders);
    toast.success(`${providers.find(p => p.id === providerId)?.name} set as primary provider`);
  };

  // Function to open config dialog for a provider
  const openProviderConfig = (providerId: string) => {
    setSelectedProviderId(providerId);
    setIsConfigDialogOpen(true);
  };

  // Function to save provider configuration
  const saveProviderConfig = (providerId: string, config: any) => {
    const updatedProviders = providers.map(p => {
      if (p.id === providerId) {
        return {
          ...p,
          ...config,
          credentials: {
            isConfigured: true,
            lastVerified: new Date().toISOString()
          }
        };
      }
      return p;
    });
    
    setProviders(updatedProviders);
    setIsConfigDialogOpen(false);
    toast.success(`${providers.find(p => p.id === providerId)?.name} configuration saved`);
  };

  return (
    <Layout>
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <div className="flex flex-col space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Voice Service Provider Management</h1>
          <p className="text-muted-foreground">
            Configure and manage your voice service providers
          </p>
        </div>

        <Tabs defaultValue="providers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="fallback">Fallback Order</TabsTrigger>
            <TabsTrigger value="cost">Cost Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="providers" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers.map(provider => (
                <Card key={provider.id} className={provider.isPrimary ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{provider.name}</CardTitle>
                        <CardDescription>{provider.description}</CardDescription>
                      </div>
                      <Badge 
                        className={`${getStatusBgColor(provider.status)} ${getStatusColor(provider.status)}`}
                      >
                        {provider.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cost:</span>
                        <span>${provider.costPer1000Chars}/1K chars</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rate Limit:</span>
                        <span>{provider.rateLimit} req/min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Languages:</span>
                        <span>{provider.supportedLanguages.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Credentials:</span>
                        <span className="flex items-center">
                          {provider.credentials.isConfigured ? (
                            <>
                              <Check className="h-4 w-4 text-green-500 mr-1" /> 
                              Configured
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4 text-red-500 mr-1" /> 
                              Not Set
                            </>
                          )}
                        </span>
                      </div>
                      {provider.credentials.isConfigured && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Verified:</span>
                          <span>{formatDate(provider.credentials.lastVerified)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => checkProviderStatus(provider.id)}
                      >
                        <Server className="h-4 w-4 mr-1" />
                        Check Status
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openProviderConfig(provider.id)}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                      {!provider.isPrimary && provider.credentials.isConfigured && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => setProviderAsPrimary(provider.id)}
                        >
                          Set as Primary
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="fallback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fallback Priority Order</CardTitle>
                <CardDescription>
                  Set the order in which providers will be used as fallbacks if the primary provider fails
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProviderFallbackOrder providers={providers} setProviders={setProviders} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cost" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cost Comparison</CardTitle>
                <CardDescription>
                  Compare estimated costs across providers based on usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Label>Characters per month: {activeSampleCount.toLocaleString()}</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm">1K</span>
                    <Slider 
                      value={[activeSampleCount]} 
                      min={1000} 
                      max={1000000} 
                      step={1000} 
                      onValueChange={(value) => setActiveSampleCount(value[0])}
                      className="flex-1"
                    />
                    <span className="text-sm">1M</span>
                  </div>
                </div>
                <ProviderCostComparison providers={providers} characterCount={activeSampleCount} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {selectedProviderId && (
        <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                Configure {providers.find(p => p.id === selectedProviderId)?.name}
              </DialogTitle>
              <DialogDescription>
                Enter your API credentials and configuration settings
              </DialogDescription>
            </DialogHeader>
            <ProviderConfigForm 
              provider={providers.find(p => p.id === selectedProviderId)!}
              onSave={(config) => saveProviderConfig(selectedProviderId, config)}
              onCancel={() => setIsConfigDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

export default VoiceProviderManagement;
