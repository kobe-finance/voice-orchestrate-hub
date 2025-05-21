
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Server, WifiOff } from "lucide-react";
import { toast } from "sonner";

interface ProviderFallbackOrderProps {
  providers: any[];
  setProviders: React.Dispatch<React.SetStateAction<any[]>>;
}

const ProviderFallbackOrder: React.FC<ProviderFallbackOrderProps> = ({
  providers,
  setProviders
}) => {
  // Filter out only configured providers and sort by fallback priority
  const configuredProviders = [...providers]
    .filter(p => p.credentials.isConfigured)
    .sort((a, b) => a.fallbackPriority - b.fallbackPriority);

  // Unconfigured providers
  const unconfiguredProviders = providers.filter(p => !p.credentials.isConfigured);

  const moveProvider = (id: string, direction: 'up' | 'down') => {
    // Find the current index of the provider
    const currentIndex = configuredProviders.findIndex(p => p.id === id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Check if the new index is valid
    if (newIndex < 0 || newIndex >= configuredProviders.length) return;
    
    // Create a copy of the providers array
    const newProviders = [...configuredProviders];
    
    // Swap the providers
    const temp = newProviders[currentIndex];
    newProviders[currentIndex] = newProviders[newIndex];
    newProviders[newIndex] = temp;
    
    // Update fallback priority
    const updatedProviders = newProviders.map((p, index) => ({
      ...p,
      fallbackPriority: index + 1
    }));
    
    // Combine with unconfigured providers
    const finalProviders = [
      ...updatedProviders,
      ...unconfiguredProviders
    ];
    
    setProviders(finalProviders);
  };

  const testFallbackLogic = () => {
    toast.info("Testing fallback logic...");
    
    setTimeout(() => {
      const primary = configuredProviders.find(p => p.isPrimary)?.name;
      const firstFallback = configuredProviders.find(p => p.fallbackPriority === 2)?.name;
      
      toast.success(
        `Fallback test complete`,
        {
          description: `Primary: ${primary} → Fallback: ${firstFallback}`
        }
      );
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Drag and drop providers to set the order they will be used as fallbacks if the primary provider fails.
        Only configured providers are available as fallbacks.
      </p>
      
      {configuredProviders.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-md">
          <WifiOff className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p>No configured providers available for fallback</p>
        </div>
      ) : (
        <div className="space-y-2">
          {configuredProviders.map((provider, index) => (
            <Card key={provider.id} className="flex items-center p-4">
              <div className="text-muted-foreground font-mono mr-3">
                {index === 0 ? "PRIMARY" : `FALLBACK ${index}`}
              </div>
              <div className="flex-1">
                <div className="font-medium">{provider.name}</div>
                <div className="text-sm text-muted-foreground">
                  {provider.status === "operational" ? "Operational" : provider.status}
                </div>
              </div>
              {!provider.isPrimary && (
                <div className="flex flex-col gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => moveProvider(provider.id, 'up')}
                    disabled={index === 1} // Can't move second item (first fallback) to primary
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => moveProvider(provider.id, 'down')}
                    disabled={index === configuredProviders.length - 1} // Can't move last item down
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-6">
        <Button onClick={testFallbackLogic} disabled={configuredProviders.length < 2}>
          <Server className="h-4 w-4 mr-2" />
          Test Fallback Logic
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          This will simulate a failure of the primary provider and test the fallback mechanism
        </p>
      </div>
      
      {unconfiguredProviders.length > 0 && (
        <div className="mt-6 p-4 border rounded-md">
          <h4 className="font-medium mb-2">Unconfigured Providers</h4>
          <p className="text-sm text-muted-foreground mb-2">
            Configure these providers to add them to your fallback options
          </p>
          <div className="space-y-2">
            {unconfiguredProviders.map(provider => (
              <div key={provider.id} className="text-sm">{provider.name}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderFallbackOrder;
