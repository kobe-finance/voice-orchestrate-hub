/**
 * Phase 3.1: Hook for Integration Card State Management
 * 
 * Extracts all business logic from IntegrationCard component
 * - Status computation logic
 * - Button state management
 * - Action orchestration
 */

import { useMemo } from 'react';
import { Key, Settings } from 'lucide-react';
import type { Integration, IntegrationCredential, UserIntegration } from '@/types/integration';

interface IntegrationCardState {
  statusBadge: {
    variant: 'default' | 'destructive' | 'secondary' | 'outline';
    text: string;
    className?: string;
  };
  actions: {
    primary?: {
      text: string;
      variant?: 'default' | 'outline' | 'destructive';
      disabled?: boolean;
      onClick: () => void;
      icon?: React.ComponentType<any>;
    };
    secondary?: {
      text: string;
      variant?: 'default' | 'outline' | 'destructive';
      disabled?: boolean;
      onClick: () => void;
      icon?: React.ComponentType<any>;
    };
  };
}

interface UseIntegrationCardStateProps {
  integration: Integration;
  credentials: IntegrationCredential[];
  userIntegration?: UserIntegration;
  onAddCredential: () => void;
  onInstall?: (integrationId: string, credentialId: string) => void;
  onUninstall?: (userIntegrationId: string) => void;
}

export const useIntegrationCardState = ({
  integration,
  credentials,
  userIntegration,
  onAddCredential,
  onInstall,
  onUninstall,
}: UseIntegrationCardStateProps): IntegrationCardState => {
  
  return useMemo(() => {
    const hasCredentials = credentials.length > 0;
    const isInstalled = !!userIntegration;
    const workingCredential = credentials.find(c => c.last_test_status === 'success');

    // Compute status badge
    const statusBadge = (() => {
      if (isInstalled) {
        const status = userIntegration.status;
        const variant = status === 'active' ? 'default' as const : 
                       status === 'error' ? 'destructive' as const : 
                       'secondary' as const;
        return { variant, text: status };
      }
      
      if (workingCredential) {
        return { 
          variant: 'outline' as const, 
          text: 'Ready to Install',
          className: 'text-green-600 border-green-600'
        };
      }
      
      if (hasCredentials) {
        return { 
          variant: 'outline' as const, 
          text: 'Needs Testing',
          className: 'text-orange-600 border-orange-600'
        };
      }
      
      return { variant: 'outline' as const, text: 'Not Connected' };
    })();

    // Compute actions based on state
    const actions = (() => {
      if (!hasCredentials) {
        return {
          primary: {
            text: 'Add Credentials',
            onClick: onAddCredential,
            icon: Key,
          }
        };
      }
      
      if (!isInstalled && workingCredential && onInstall) {
        return {
          primary: {
            text: 'Install Integration',
            onClick: () => onInstall(integration.id, workingCredential.id),
          },
          secondary: {
            text: '',
            variant: 'outline' as const,
            onClick: onAddCredential,
            icon: Key,
          }
        };
      }
      
      if (isInstalled && onUninstall) {
        return {
          primary: {
            text: 'Manage',
            variant: 'outline' as const,
            disabled: true,
            onClick: () => {},
            icon: Settings,
          },
          secondary: {
            text: 'Uninstall',
            variant: 'destructive' as const,
            onClick: () => onUninstall(userIntegration.id),
          }
        };
      }
      
      return {
        primary: {
          text: 'Add More',
          variant: 'outline' as const,
          onClick: onAddCredential,
          icon: Key,
        }
      };
    })();

    return { statusBadge, actions };
  }, [integration, credentials, userIntegration, onAddCredential, onInstall, onUninstall]);
};