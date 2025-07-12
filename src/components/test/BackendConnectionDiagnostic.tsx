
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { backendService } from '@/services/backendService';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export const BackendConnectionDiagnostic = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (name: string, status: TestResult['status'], message: string, details?: string) => {
    setTests(prev => [
      ...prev.filter(t => t.name !== name),
      { name, status, message, details }
    ]);
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setTests([]);

    // Test 1: Basic backend health check
    updateTest('Backend Health', 'pending', 'Testing backend connection...');
    try {
      await backendService.healthCheck();
      updateTest('Backend Health', 'success', 'Backend is running and accessible');
    } catch (error) {
      updateTest('Backend Health', 'error', 'Cannot connect to backend', 
        error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 2: API integrations endpoint
    updateTest('Integrations API', 'pending', 'Testing integrations endpoint...');
    try {
      const integrations = await api.integrations.getIntegrations();
      updateTest('Integrations API', 'success', 
        `Integrations API working (${integrations.length} integrations found)`);
    } catch (error) {
      updateTest('Integrations API', 'error', 'Integrations API failed', 
        error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 3: Credentials API
    updateTest('Credentials API', 'pending', 'Testing credentials endpoint...');
    try {
      const credentials = await api.integrations.getCredentials();
      updateTest('Credentials API', 'success', 
        `Credentials API working (${credentials.length} credentials found)`);
    } catch (error) {
      updateTest('Credentials API', 'error', 'Credentials API failed', 
        error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 4: Test credential endpoint (if we have credentials)
    try {
      const credentials = await api.integrations.getCredentials();
      if (credentials.length > 0) {
        updateTest('Test Credential', 'pending', 'Testing credential test endpoint...');
        try {
          await api.integrations.testCredential({ credential_id: credentials[0].id });
          updateTest('Test Credential', 'success', 'Credential test endpoint working');
        } catch (error) {
          updateTest('Test Credential', 'warning', 'Credential test failed (this may be expected)', 
            error instanceof Error ? error.message : 'Unknown error');
        }
      }
    } catch (error) {
      // Skip this test if we can't get credentials
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Backend Connection Diagnostic</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This tool tests the connection between the frontend and your local backend server.
            Make sure your backend is running on <code>http://127.0.0.1:8000</code>
          </AlertDescription>
        </Alert>

        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            'Run Backend Diagnostics'
          )}
        </Button>

        {tests.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Test Results:</h3>
            {tests.map((test, index) => (
              <div 
                key={index}
                className={`p-3 border rounded-lg ${getStatusColor(test.status)}`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(test.status)}
                  <div className="flex-1">
                    <div className="font-medium">
                      {test.name}: {test.message}
                    </div>
                    {test.details && (
                      <div className="text-sm text-gray-600 mt-1">
                        {test.details}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Expected Backend Configuration:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Backend running on <code>http://127.0.0.1:8000</code></li>
            <li>CORS enabled for <code>https://preview--voice-orchestrate-hub.lovable.app</code></li>
            <li>VAULT_MASTER_KEY and VAULT_SALT environment variables set</li>
            <li>All integration endpoints properly configured</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
