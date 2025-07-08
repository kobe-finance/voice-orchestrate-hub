
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { integrationAPI } from '@/services/integrationAPI';

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
        <div className="text-sm text-gray-600">
          <p><strong>Testing URL:</strong> Check console for exact URL being used</p>
          <p><strong>Expected:</strong> Backend server should be running and accessible</p>
        </div>
        
        <Button onClick={testConnection} disabled={isLoading}>
          {isLoading ? 'Testing...' : 'Test Backend Connection'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800">Connection Failed</h3>
            <p className="text-red-600 mb-2">{error}</p>
            <div className="text-sm text-red-500">
              <p><strong>Possible solutions:</strong></p>
              <ul className="list-disc list-inside mt-1">
                <li>Ensure the backend server is running</li>
                <li>Check if the backend URL is correct</li>
                <li>Verify CORS settings on the backend</li>
                <li>Set VITE_API_BASE_URL environment variable if needed</li>
              </ul>
            </div>
          </div>
        )}

        {testResult && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800">Connection Successful</h3>
            <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-40">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
