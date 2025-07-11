/**
 * Phase 3.1: Refactored IntegrationCard - Pure UI Component
 * 
 * REMOVED:
 * - Status computation logic -> moved to hook
 * - Business rules for button states -> moved to hook
 * - Credential validation logic -> moved to hook
 * 
 * KEPT:
 * - Pure UI rendering
 * - Event handling (callbacks only)
 * - Visual state display
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Key, Play, Settings, ExternalLink } from 'lucide-react';
import IntegrationCredentialForm from './IntegrationCredentialForm';
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

interface IntegrationCardProps {
  integration: Integration;
  credentials?: IntegrationCredential[];
  userIntegration?: UserIntegration;
  state: IntegrationCardState; // Pre-computed state from hook
  onAddCredential: (data: {
    integration_id: string;
    credential_name: string;
    credentials: Record<string, string>;
    credential_type: string;
  }) => Promise<void>;
  onTestConnection?: (credentialId: string) => void;
  onInstall?: (integrationId: string, credentialId: string) => void;
  onUninstall?: (userIntegrationId: string) => void;
  isLoading?: boolean;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  credentials = [],
  userIntegration,
  state,
  onAddCredential,
  onTestConnection,
  onInstall,
  onUninstall,
  isLoading = false,
}) => {
  const [showCredentialForm, setShowCredentialForm] = useState(false);

  const getCredentialStatusIcon = (credential: IntegrationCredential) => {
    switch (credential.last_test_status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'testing':
        return <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                <Key className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-lg">{integration.name}</CardTitle>
                <Badge variant="outline" className="text-xs mt-1">
                  {integration.category}
                </Badge>
              </div>
            </div>
            <Badge 
              variant={state.statusBadge.variant} 
              className={state.statusBadge.className}
            >
              {state.statusBadge.text}
            </Badge>
          </div>
          <CardDescription className="mt-2">{integration.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Credentials Section */}
          {credentials.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Credentials ({credentials.length})</h4>
              {credentials.map((credential) => (
                <div key={credential.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <div className="flex items-center space-x-2">
                    {getCredentialStatusIcon(credential)}
                    <span>{credential.credential_name}</span>
                  </div>
                  {onTestConnection && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onTestConnection(credential.id)}
                      disabled={credential.last_test_status === 'testing'}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons - Pure UI based on computed state */}
          <div className="flex space-x-2">
            {state.actions.primary && (
              <Button
                size="sm"
                variant={state.actions.primary.variant}
                onClick={state.actions.primary.onClick}
                disabled={state.actions.primary.disabled || isLoading}
                className="flex-1"
              >
                {state.actions.primary.icon && <state.actions.primary.icon className="h-4 w-4 mr-1" />}
                {state.actions.primary.text}
              </Button>
            )}
            
            {state.actions.secondary && (
              <Button
                size="sm"
                variant={state.actions.secondary.variant}
                onClick={state.actions.secondary.onClick}
                disabled={state.actions.secondary.disabled || isLoading}
              >
                {state.actions.secondary.icon && <state.actions.secondary.icon className="h-4 w-4" />}
                {state.actions.secondary.text}
              </Button>
            )}
          </div>

          {integration.documentation_url && (
            <Button
              variant="link"
              size="sm"
              className="w-full p-0 h-auto"
              onClick={() => window.open(integration.documentation_url!, '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View Documentation
            </Button>
          )}
        </CardContent>
      </Card>

      <IntegrationCredentialForm
        integration={integration}
        isOpen={showCredentialForm}
        onClose={() => setShowCredentialForm(false)}
        onSubmit={onAddCredential}
        isLoading={isLoading}
      />
    </>
  );
};

export default IntegrationCard;