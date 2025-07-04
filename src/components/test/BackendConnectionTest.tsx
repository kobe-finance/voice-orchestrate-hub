
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { integrationAPI } from '@/services/api/integrationClient';

/**
 * Test component to verify backend connectivity
 * Remove this after confirming everything works
 */
export const BackendConnectionTest = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setIsLoading(true);
    setError(null);
    setTestResult(null);

    try {
      console.log('Testing backend connection...');
      const result = await integrationAPI.getIntegrations();
      console.log('Backend connection test result:', result);
      setTestResult(result);
    } catch (err) {
      console.error('Backend connection test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Backend Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testConnection} disabled={isLoading}>
          {isLoading ? 'Testing...' : 'Test Backend Connection'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800">Connection Failed</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {testResult && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800">Connection Successful</h3>
            <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
