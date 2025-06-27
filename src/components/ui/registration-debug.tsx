
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

export const RegistrationDebug: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testRegistrationTrigger = async () => {
    setIsLoading(true);
    setTestResult('');

    try {
      console.log('🔧 Testing registration trigger...');
      
      // Test if we can call the test function
      const { data, error } = await supabase.rpc('test_registration_trigger');
      
      if (error) {
        console.error('❌ Trigger test failed:', error);
        setTestResult(`Error: ${error.message}`);
      } else {
        console.log('✅ Trigger test result:', data);
        setTestResult(data || 'Test completed successfully');
      }
    } catch (error) {
      console.error('❌ Test execution failed:', error);
      setTestResult(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testTableAccess = async () => {
    setIsLoading(true);
    setTestResult('');

    try {
      console.log('🔧 Testing registration_logs table access...');
      
      // Test if we can access the registration_logs table
      const { data, error } = await supabase
        .from('registration_logs')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('❌ Table access failed:', error);
        setTestResult(`Table access error: ${error.message}`);
      } else {
        console.log('✅ Table access successful:', data);
        setTestResult('Table access successful - registration_logs table is accessible');
      }
    } catch (error) {
      console.error('❌ Table test failed:', error);
      setTestResult(`Table test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Registration Debug Tools</CardTitle>
        <CardDescription>
          Test the registration trigger and database setup
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button 
            onClick={testTableAccess} 
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? 'Testing...' : 'Test Table Access'}
          </Button>
          
          <Button 
            onClick={testRegistrationTrigger} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Testing...' : 'Test Registration Trigger'}
          </Button>
        </div>
        
        {testResult && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <p className="text-sm font-mono whitespace-pre-wrap">{testResult}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
