
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

export const DatabaseDebug: React.FC = () => {
  const [debugData, setDebugData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkDatabaseState = async () => {
    setLoading(true);
    try {
      // Check organizations
      const { data: organizations, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Check organization members
      const { data: members, error: membersError } = await supabase
        .from('organization_members')
        .select(`
          *,
          organizations (name, slug)
        `)
        .order('joined_at', { ascending: false })
        .limit(5);

      // Check registration logs
      const { data: logs, error: logsError } = await supabase
        .from('registration_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      setDebugData({
        organizations: organizations || [],
        members: members || [],
        logs: logs || [],
        errors: {
          orgError,
          membersError,
          logsError
        }
      });
    } catch (error) {
      console.error('Debug check failed:', error);
      setDebugData({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Database Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={checkDatabaseState} disabled={loading}>
          {loading ? 'Checking...' : 'Check Database State'}
        </Button>
        
        {debugData && (
          <div className="space-y-4">
            {debugData.error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <h3 className="font-semibold text-red-800">Error:</h3>
                <p className="text-red-600">{debugData.error}</p>
              </div>
            ) : (
              <>
                <div className="p-4 bg-green-50 border border-green-200 rounded">
                  <h3 className="font-semibold text-green-800">Organizations ({debugData.organizations?.length || 0}):</h3>
                  <pre className="text-sm text-green-600 mt-2 overflow-auto">
                    {JSON.stringify(debugData.organizations, null, 2)}
                  </pre>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <h3 className="font-semibold text-blue-800">Organization Members ({debugData.members?.length || 0}):</h3>
                  <pre className="text-sm text-blue-600 mt-2 overflow-auto">
                    {JSON.stringify(debugData.members, null, 2)}
                  </pre>
                </div>
                
                <div className="p-4 bg-purple-50 border border-purple-200 rounded">
                  <h3 className="font-semibold text-purple-800">Registration Logs ({debugData.logs?.length || 0}):</h3>
                  <pre className="text-sm text-purple-600 mt-2 overflow-auto">
                    {JSON.stringify(debugData.logs, null, 2)}
                  </pre>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
