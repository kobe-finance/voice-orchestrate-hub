
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
        result += `\n⚠️ ORPHANED USER DETECTED\n`;
        result += `This user needs organization setup. Use 'Fix Orphaned User' button.\n`;
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
        .maybeSingle();
      
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

  const fixOrphanedUser = async () => {
    setIsLoading(true);
    setDebugResult('');

    try {
      console.log('🔧 Starting orphaned user fix...');
      
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        setDebugResult('❌ No active session - please log in first');
        return;
      }

      const user = session.user;
      console.log('🔍 Fixing user:', user.email);
      
      // Check if user already has organization using the utility function
      const existingMembership = await verifyOrganizationMembership(user.id);
      if (existingMembership) {
        setDebugResult('✅ User already has organization - no fix needed');
        return;
      }

      let result = `🔧 Fixing orphaned user: ${user.email}\n\n`;
      
      // Use the database function to create organization (bypasses RLS)
      console.log('🏢 Creating organization using database function...');
      
      const companyName = user.user_metadata?.company_name || 
                         `${user.email?.split('@')[0]}'s Workspace`;
      
      const { data: orgId, error: orgError } = await supabase
        .rpc('ensure_user_has_organization', {
          p_user_id: user.id
        });

      if (orgError) {
        result += `❌ Organization creation failed: ${orgError.message}\n`;
        setDebugResult(result);
        return;
      }

      result += `✅ Organization created with ID: ${orgId}\n`;
      console.log('✅ Organization created:', orgId);

      // Update user metadata with tenant_id
      console.log('📝 Updating user metadata...');
      
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          tenant_id: orgId,
          default_organization: orgId,
          onboarding_completed: false,
          fixed_orphaned_user: true,
          fixed_at: new Date().toISOString()
        }
      });

      if (updateError) {
        result += `⚠️ Metadata update failed: ${updateError.message}\n`;
        result += `Organization created but JWT won't include tenant_id until next login\n`;
      } else {
        result += `✅ User metadata updated with tenant_id\n`;
        console.log('✅ Metadata updated');
      }

      result += `\n🎉 USER FIX COMPLETED!\n`;
      result += `Organization ID: ${orgId}\n`;
      result += `Role: Owner\n`;
      result += `Status: Active\n`;
      result += `\n💡 Please refresh the page or log out/in to see changes in JWT`;

      setDebugResult(result);
      console.log('🎉 Orphaned user fix completed successfully');
      
    } catch (error) {
      console.error('❌ Orphaned user fix failed:', error);
      setDebugResult(`Fix failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
        <div className="grid grid-cols-1 gap-2">
          <Button 
            onClick={checkCurrentUser} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Checking...' : 'Check Current User'}
          </Button>
          
          <Button 
            onClick={checkSpecificUser} 
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? 'Checking...' : 'Check Organization Data'}
          </Button>

          <Button 
            onClick={fixOrphanedUser} 
            disabled={isLoading}
            variant="destructive"
            className="w-full"
          >
            {isLoading ? 'Fixing...' : '🔧 Fix Orphaned User'}
          </Button>
        </div>
        
        {debugResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <pre className="text-sm whitespace-pre-wrap font-mono">{debugResult}</pre>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Fix Orphaned User:</strong> Creates organization and membership for users who completed signup but lack organization setup (like kobeapidev@gmail.com).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
