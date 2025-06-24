
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import type { IntegrationCredential, UserIntegration } from '@/types/integration';

interface IntegrationStatusIndicatorProps {
  credential?: IntegrationCredential;
  userIntegration?: UserIntegration;
  showText?: boolean;
}

const IntegrationStatusIndicator: React.FC<IntegrationStatusIndicatorProps> = ({
  credential,
  userIntegration,
  showText = true
}) => {
  // Determine overall status based on integration and credential state
  const getStatus = () => {
    if (userIntegration) {
      switch (userIntegration.status) {
        case 'active':
          return {
            icon: CheckCircle,
            text: 'Active',
            variant: 'default' as const,
            className: 'text-green-600 border-green-600'
          };
        case 'paused':
          return {
            icon: Clock,
            text: 'Paused',
            variant: 'secondary' as const,
            className: 'text-yellow-600 border-yellow-600'
          };
        case 'error':
          return {
            icon: XCircle,
            text: 'Error',
            variant: 'destructive' as const,
            className: ''
          };
        case 'installing':
          return {
            icon: Loader2,
            text: 'Installing...',
            variant: 'outline' as const,
            className: 'text-blue-600 border-blue-600'
          };
      }
    }
    
    if (credential) {
      switch (credential.last_test_status) {
        case 'success':
          return {
            icon: CheckCircle,
            text: 'Ready to Install',
            variant: 'outline' as const,
            className: 'text-green-600 border-green-600'
          };
        case 'failed':
          return {
            icon: AlertCircle,
            text: 'Connection Failed',
            variant: 'outline' as const,
            className: 'text-red-600 border-red-600'
          };
        case 'testing':
          return {
            icon: Loader2,
            text: 'Testing...',
            variant: 'outline' as const,
            className: 'text-blue-600 border-blue-600'
          };
        default:
          return {
            icon: AlertCircle,
            text: 'Not Tested',
            variant: 'outline' as const,
            className: 'text-gray-600 border-gray-600'
          };
      }
    }
    
    return {
      icon: AlertCircle,
      text: 'Not Connected',
      variant: 'outline' as const,
      className: 'text-gray-600 border-gray-600'
    };
  };

  const status = getStatus();
  const Icon = status.icon;

  return (
    <Badge variant={status.variant} className={`flex items-center gap-1 ${status.className}`}>
      <Icon 
        className={`h-3 w-3 ${
          userIntegration?.status === 'installing' || credential?.last_test_status === 'testing' 
            ? 'animate-spin' 
            : ''
        }`} 
      />
      {showText && <span>{status.text}</span>}
    </Badge>
  );
};

export default IntegrationStatusIndicator;
