/**
 * Smart Integration Hook - Migration Layer (Phase 2)
 * Automatically switches between old and new implementations based on feature flags
 */

import { useIntegrations as useIntegrationsOld } from './useIntegrations';
import { useIntegrationsAPI } from './useIntegrationsAPI';
import { useShouldUseNewIntegrationsAPI } from './useHookMigrationFlags';

// Adapter to make new API hook compatible with old interface
const adaptNewAPIToOldInterface = (newHook: ReturnType<typeof useIntegrationsAPI>) => {
  return {
    // Data mapping
    availableIntegrations: newHook.integrations,
    userCredentials: newHook.credentials,
    userIntegrations: newHook.userIntegrations,
    
    // Loading states mapping
    isLoading: newHook.isLoadingIntegrations || newHook.isLoadingCredentials || newHook.isLoadingUserIntegrations,
    isAddingCredential: newHook.createCredential.isLoading,
    isTestingCredential: newHook.testCredential.isLoading,
    isInstallingIntegration: newHook.installIntegration.isLoading,
    isUninstallingIntegration: newHook.uninstallIntegration.isLoading,
    
    // Action mapping
    addCredential: async (data: {
      integrationId: string;
      credentialName: string;
      credentials: Record<string, any>;
      credentialType: string;
    }) => {
      newHook.createCredential.mutate({
        integration_id: data.integrationId,
        credential_name: data.credentialName,
        credential_type: data.credentialType,
        credentials: data.credentials,
      });
    },
    
    testCredential: async (credentialId: string) => {
      newHook.testCredential.mutate({
        credential_id: credentialId,
      });
    },
    
    installIntegration: async (data: { integrationId: string; credentialId: string }) => {
      newHook.installIntegration.mutate({
        integration_id: data.integrationId,
        credential_id: data.credentialId,
      });
    },
    
    uninstallIntegration: async (userIntegrationId: string) => {
      newHook.uninstallIntegration.mutate(userIntegrationId);
    },
  };
};

/**
 * Smart Integration Hook that automatically migrates based on feature flags
 * This maintains backwards compatibility while allowing gradual migration
 */
export const useIntegrationsSmartMigration = () => {
  const shouldUseNewAPI = useShouldUseNewIntegrationsAPI();
  
  const oldHook = useIntegrationsOld();
  const newHook = useIntegrationsAPI();
  
  if (shouldUseNewAPI) {
    console.log('🚀 Using new API-based integrations hook');
    return adaptNewAPIToOldInterface(newHook);
  } else {
    console.log('📱 Using legacy integrations hook');
    return oldHook;
  }
};

// Re-export for easier migration
export { useIntegrationsAPI } from './useIntegrationsAPI';
export { useIntegrations as useIntegrationsLegacy } from './useIntegrations';