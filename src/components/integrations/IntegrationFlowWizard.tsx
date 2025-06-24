
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Steps } from '@/components/ui/steps';
import { CheckCircle, Key, TestTube, Plug } from 'lucide-react';
import IntegrationCredentialForm from './IntegrationCredentialForm';
import type { Integration, IntegrationCredential } from '@/types/integration';

interface IntegrationFlowWizardProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onAddCredential: (data: {
    integration_id: string;
    credential_name: string;
    credentials: Record<string, string>;
    credential_type: string;
  }) => Promise<void>;
  onTestConnection: (credentialId: string) => Promise<void>;
  onInstall: (integrationId: string, credentialId: string) => Promise<void>;
  credentials: IntegrationCredential[];
  isLoading?: boolean;
}

const IntegrationFlowWizard: React.FC<IntegrationFlowWizardProps> = ({
  integration,
  isOpen,
  onClose,
  onAddCredential,
  onTestConnection,
  onInstall,
  credentials,
  isLoading = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCredential, setSelectedCredential] = useState<IntegrationCredential | null>(null);

  const hasCredentials = credentials.length > 0;
  const workingCredential = credentials.find(c => c.last_test_status === 'success');

  const steps = [
    {
      title: 'Add Credentials',
      description: 'Connect your API keys',
      icon: Key,
      completed: hasCredentials
    },
    {
      title: 'Test Connection',
      description: 'Verify credentials work',
      icon: TestTube,
      completed: !!workingCredential
    },
    {
      title: 'Install Integration',
      description: 'Activate the integration',
      icon: Plug,
      completed: false
    }
  ];

  const handleCredentialAdded = async (data: any) => {
    await onAddCredential(data);
    setCurrentStep(1);
  };

  const handleTestConnection = async (credentialId: string) => {
    await onTestConnection(credentialId);
    setSelectedCredential(credentials.find(c => c.id === credentialId) || null);
  };

  const handleInstall = async () => {
    if (workingCredential) {
      await onInstall(integration.id, workingCredential.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Setup {integration.name}</DialogTitle>
          <DialogDescription>
            Follow these steps to connect and install your integration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Steps indicator */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = step.completed;
              
              return (
                <div key={index} className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2
                    ${isCompleted ? 'bg-green-100 border-green-500 text-green-700' :
                      isActive ? 'bg-blue-100 border-blue-500 text-blue-700' :
                      'bg-gray-100 border-gray-300 text-gray-500'}
                  `}>
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className={`text-sm font-medium ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step content */}
          <div className="min-h-48">
            {currentStep === 0 && (
              <IntegrationCredentialForm
                integration={integration}
                isOpen={true}
                onClose={() => {}}
                onSubmit={handleCredentialAdded}
                isLoading={isLoading}
              />
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Test Your Credentials</h3>
                <p className="text-sm text-gray-600">
                  Select a credential to test the connection to {integration.name}
                </p>
                <div className="space-y-2">
                  {credentials.map((credential) => (
                    <div key={credential.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{credential.credential_name}</p>
                        <p className="text-sm text-gray-500">
                          Status: {credential.last_test_status || 'Not tested'}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleTestConnection(credential.id)}
                        disabled={credential.last_test_status === 'testing'}
                      >
                        {credential.last_test_status === 'testing' ? 'Testing...' : 'Test'}
                      </Button>
                    </div>
                  ))}
                </div>
                {workingCredential && (
                  <Button onClick={() => setCurrentStep(2)} className="w-full">
                    Continue to Installation
                  </Button>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                <h3 className="text-lg font-medium">Ready to Install</h3>
                <p className="text-sm text-gray-600">
                  Your credentials are working correctly. Click install to activate the {integration.name} integration.
                </p>
                <Button onClick={handleInstall} className="w-full" disabled={isLoading}>
                  {isLoading ? 'Installing...' : 'Install Integration'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationFlowWizard;
