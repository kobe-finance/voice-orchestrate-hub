
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { verifyJWTContents, verifyOrganizationMembership } from '@/utils/authDebug';

export const UserDebug: React.FC = () => {
  const [debugResult, setDebugResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const checkCurrentUser = async () => {
    setIsLoading(true);
    setDebugResult('');

    try {
      console.log('🔍 Checking current user authentication status...');
      
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        setDebugResult(`Session Error: ${error.message}`);
        return;
      }
      
      if (!session?.user) {
        setDebugResult('No active session - user not logged in');
        return;
      }

      console.log('✅ User is logged in:', session.user.email);
      
      // Verify JWT contents
      const jwtInfo = await verifyJWTContents();
      
      if (!jwtInfo) {
        setDebugResult('Failed to parse JWT information');
        return;
      }

      // Check organization membership
      const membership = await verifyOrganizationMembership(session.user.id);

      // Build result string
      let result = `🔍 User Debug Results for: ${session.user.email}\n\n`;
      result += `User ID: ${jwtInfo.userId}\n`;
      result += `Tenant ID in JWT: ${jwtInfo.tenantId || 'NOT FOUND'}\n`;
      result += `Has Valid Tenant ID: ${jwtInfo.hasValidTenantId ? '✅ YES' : '❌ NO'}\n\n`;
      
      if (membership) {
        result += `Organization Membership: ✅ FOUND\n`;
        result += `Organization ID: ${membership.organization_id}\n`;
        result += `Organization Name: ${membership.organizations?.name}\n`;
        result += `User Role: ${membership.role}\n`;
        result += `Active: ${membership.is_active ? 'Yes' : 'No'}\n`;
      } else {
        result += `Organization Membership: ❌ NOT FOUND\n`;
      }

      setDebugResult(result);
      
    } catch (error) {
      console.error('❌ Debug check failed:', error);
      setDebugResult(`Debug failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSpecificUser = async () => {
    setIsLoading(true);
    setDebugResult('');

    try {
      console.log('🔍 Checking kobeapidev@gmail.com specifically...');
      
      // Query for the specific user in organization_members
      const { data: membership, error } = await supabase
        .from('organization_members')
        .select(`
          id,
          user_id,
          role,
          is_active,
          organization_id,
          organizations (
            id,
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        setDebugResult(`Query Error: ${error.message}`);
        return;
      }

      let result = `🔍 Organization Check for kobeapidev@gmail.com\n\n`;
      
      if (membership) {
        result += `Organization Membership: ✅ FOUND\n`;
        result += `User ID: ${membership.user_id}\n`;
        result += `Organization ID: ${membership.organization_id}\n`;
        result += `Organization Name: ${membership.organizations?.name}\n`;
        result += `Organization Slug: ${membership.organizations?.slug}\n`;
        result += `User Role: ${membership.role}\n`;
        result += `Active: ${membership.is_active ? 'Yes' : 'No'}\n`;
      } else {
        result += `Organization Membership: ❌ NOT FOUND\n`;
        result += `User may not have an organization or RLS is blocking access\n`;
      }

      setDebugResult(result);
      
    } catch (error) {
      console.error('❌ Specific user check failed:', error);
      setDebugResult(`Check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>User & Organization Debug</CardTitle>
        <CardDescription>
          Check if the current user has proper tenant_id and organization association
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={checkCurrentUser} 
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Checking...' : 'Check Current User'}
          </Button>
          
          <Button 
            onClick={checkSpecificUser} 
            disabled={isLoading}
            variant="outline"
            className="flex-1"
          >
            {isLoading ? 'Checking...' : 'Check Organization Data'}
          </Button>
        </div>
        
        {debugResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <pre className="text-sm whitespace-pre-wrap font-mono">{debugResult}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
