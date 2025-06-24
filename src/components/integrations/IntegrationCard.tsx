
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Key, Play, Settings, ExternalLink } from 'lucide-react';
import IntegrationCredentialForm from './IntegrationCredentialForm';
import type { Integration, IntegrationCredential, UserIntegration } from '@/types/integration';

interface IntegrationCardProps {
  integration: Integration;
  credentials?: IntegrationCredential[];
  userIntegration?: UserIntegration;
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
  onAddCredential,
  onTestConnection,
  onInstall,
  onUninstall,
  isLoading = false,
}) => {
  const [showCredentialForm, setShowCredentialForm] = useState(false);

  const hasCredentials = credentials.length > 0;
  const isInstalled = !!userIntegration;
  const workingCredential = credentials.find(c => c.last_test_status === 'success');

  const getStatusBadge = () => {
    if (isInstalled) {
      const status = userIntegration.status;
      const variant = status === 'active' ? 'default' : status === 'error' ? 'destructive' : 'secondary';
      return <Badge variant={variant}>{status}</Badge>;
    }
    
    if (workingCredential) {
      return <Badge variant="outline" className="text-green-600 border-green-600">Ready to Install</Badge>;
    }
    
    if (hasCredentials) {
      return <Badge variant="outline" className="text-orange-600 border-orange-600">Needs Testing</Badge>;
    }
    
    return <Badge variant="outline">Not Connected</Badge>;
  };

  const getCredentialStatus = (credential: IntegrationCredential) => {
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
            {getStatusBadge()}
          </div>
          <CardDescription className="mt-2">{integration.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Credentials Section */}
          {hasCredentials && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Credentials ({credentials.length})</h4>
              {credentials.map((credential) => (
                <div key={credential.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <div className="flex items-center space-x-2">
                    {getCredentialStatus(credential)}
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

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {!hasCredentials ? (
              <Button 
                size="sm" 
                onClick={() => setShowCredentialForm(true)}
                disabled={isLoading}
                className="flex-1"
              >
                <Key className="h-4 w-4 mr-1" />
                Add Credentials
              </Button>
            ) : !isInstalled && workingCredential ? (
              <>
                <Button
                  size="sm"
                  onClick={() => onInstall?.(integration.id, workingCredential.id)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Install Integration
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCredentialForm(true)}
                >
                  <Key className="h-4 w-4" />
                </Button>
              </>
            ) : isInstalled ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  disabled
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Manage
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onUninstall?.(userIntegration.id)}
                  disabled={isLoading}
                >
                  Uninstall
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCredentialForm(true)}
                disabled={isLoading}
                className="flex-1"
              >
                <Key className="h-4 w-4 mr-1" />
                Add More
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
