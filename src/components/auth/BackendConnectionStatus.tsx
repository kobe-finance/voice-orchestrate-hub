
import React from 'react';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const BackendConnectionStatus: React.FC = () => {
  const { isBackendConnected, backendUser, refreshBackendUser, isLoading } = useHybridAuth();

  return (
    <Card variant="elevated" className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isBackendConnected ? (
            <Wifi className="h-5 w-5 text-green-600" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-600" />
          )}
          
          <div>
            <p className="font-medium">Backend Service</p>
            <p className="text-sm text-gray-600">
              {isBackendConnected ? 'Connected' : 'Disconnected'}
            </p>
          </div>
          
          <Badge variant={isBackendConnected ? 'default' : 'destructive'}>
            {isBackendConnected ? 'Online' : 'Offline'}
          </Badge>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={refreshBackendUser}
          disabled={isLoading}
          leftIcon={isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        >
          Refresh
        </Button>
      </div>
      
      {backendUser && (
        <div className="mt-3 pt-3 border-t text-sm text-gray-600">
          <p>Backend User: {backendUser.firstName} {backendUser.lastName}</p>
          <p>Role: {backendUser.role}</p>
        </div>
      )}
    </Card>
  );
};
