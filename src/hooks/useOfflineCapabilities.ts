
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface OfflineAction {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  retryCount: number;
}

interface UseOfflineCapabilitiesOptions {
  enableSync?: boolean;
  maxRetries?: number;
  syncInterval?: number;
}

export const useOfflineCapabilities = ({
  enableSync = true,
  maxRetries = 3,
  syncInterval = 30000 // 30 seconds
}: UseOfflineCapabilitiesOptions = {}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineActions, setOfflineActions] = useState<OfflineAction[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored');
      
      if (enableSync && offlineActions.length > 0) {
        syncOfflineActions();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are now offline. Actions will be queued for later sync.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [enableSync, offlineActions.length]);

  // Periodic sync when online
  useEffect(() => {
    if (!isOnline || !enableSync) return;

    const interval = setInterval(() => {
      if (offlineActions.length > 0) {
        syncOfflineActions();
      }
    }, syncInterval);

    return () => clearInterval(interval);
  }, [isOnline, enableSync, offlineActions.length, syncInterval]);

  const queueOfflineAction = useCallback((type: string, data: any) => {
    const action: OfflineAction = {
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: new Date(),
      retryCount: 0
    };

    setOfflineActions(prev => [...prev, action]);
    
    // Store in localStorage for persistence
    const existingActions = JSON.parse(localStorage.getItem('offlineActions') || '[]');
    localStorage.setItem('offlineActions', JSON.stringify([...existingActions, action]));
    
    toast.info('Action queued for when connection is restored');
    return action.id;
  }, []);

  const syncOfflineActions = useCallback(async () => {
    if (isSyncing || !isOnline || offlineActions.length === 0) return;

    setIsSyncing(true);
    const actionsToSync = [...offlineActions];
    const failedActions: OfflineAction[] = [];

    try {
      for (const action of actionsToSync) {
        try {
          // Here you would implement the actual sync logic
          // This is a placeholder for the sync operation
          await simulateAPICall(action);
          
          console.log(`Synced offline action: ${action.type}`, action.data);
        } catch (error) {
          console.error(`Failed to sync action ${action.id}:`, error);
          
          if (action.retryCount < maxRetries) {
            failedActions.push({
              ...action,
              retryCount: action.retryCount + 1
            });
          } else {
            console.error(`Action ${action.id} exceeded max retries, discarding`);
          }
        }
      }

      // Update offline actions with only failed ones
      setOfflineActions(failedActions);
      localStorage.setItem('offlineActions', JSON.stringify(failedActions));

      const syncedCount = actionsToSync.length - failedActions.length;
      if (syncedCount > 0) {
        toast.success(`Synced ${syncedCount} offline action${syncedCount > 1 ? 's' : ''}`);
      }
      
      if (failedActions.length > 0) {
        toast.warning(`${failedActions.length} action${failedActions.length > 1 ? 's' : ''} failed to sync`);
      }
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error('Failed to sync offline actions');
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, isOnline, offlineActions, maxRetries]);

  // Load offline actions from localStorage on mount
  useEffect(() => {
    const storedActions = localStorage.getItem('offlineActions');
    if (storedActions) {
      try {
        const actions = JSON.parse(storedActions);
        setOfflineActions(actions);
      } catch (error) {
        console.error('Failed to load offline actions:', error);
        localStorage.removeItem('offlineActions');
      }
    }
  }, []);

  const clearOfflineActions = useCallback(() => {
    setOfflineActions([]);
    localStorage.removeItem('offlineActions');
    toast.success('Offline actions cleared');
  }, []);

  const retryFailedActions = useCallback(() => {
    if (isOnline) {
      syncOfflineActions();
    } else {
      toast.warning('Cannot retry while offline');
    }
  }, [isOnline, syncOfflineActions]);

  return {
    isOnline,
    offlineActions,
    isSyncing,
    queueOfflineAction,
    syncOfflineActions,
    clearOfflineActions,
    retryFailedActions,
    hasOfflineActions: offlineActions.length > 0
  };
};

// Simulate API call for demonstration
const simulateAPICall = async (action: OfflineAction): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate success/failure
      if (Math.random() > 0.2) { // 80% success rate
        resolve();
      } else {
        reject(new Error('Simulated API failure'));
      }
    }, 100);
  });
};

// PWA installation hook
export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      toast.success('App installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = useCallback(async () => {
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Error during PWA installation:', error);
      return false;
    } finally {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  }, [deferredPrompt]);

  return {
    isInstallable,
    isInstalled,
    installPWA
  };
};
