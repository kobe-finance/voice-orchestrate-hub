
import React from 'react';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import { Card } from '@/components/ui/card-modern';
import { Badge } from '@/components/ui/badge';
import { BackendConnectionStatus } from './BackendConnectionStatus';

export const HybridAuthDemo: React.FC = () => {
  const { 
    supabaseUser, 
    backendUser, 
    isBackendConnected, 
    isAuthenticated 
  } = useHybridAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Hybrid Authentication Status</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* Supabase Auth Info */}
        <Card variant="elevated" className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Supabase Authentication</h4>
            <Badge variant="default">Active</Badge>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Email:</span> {supabaseUser?.email}</p>
            <p><span className="font-medium">User ID:</span> {supabaseUser?.id?.substring(0, 8)}...</p>
            <p><span className="font-medium">Email Verified:</span> {supabaseUser?.email_confirmed_at ? 'Yes' : 'No'}</p>
            <p><span className="font-medium">Created:</span> {supabaseUser?.created_at ? new Date(supabaseUser.created_at).toLocaleDateString() : 'N/A'}</p>
          </div>
        </Card>

        {/* Backend Auth Info */}
        <Card variant="elevated" className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Backend Service</h4>
            <Badge variant={isBackendConnected ? 'default' : 'destructive'}>
              {isBackendConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
          {backendUser ? (
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {backendUser.firstName} {backendUser.lastName}</p>
              <p><span className="font-medium">Role:</span> {backendUser.role}</p>
              <p><span className="font-medium">Tenant:</span> {backendUser.tenantId}</p>
              <p><span className="font-medium">Backend Verified:</span> {backendUser.isEmailVerified ? 'Yes' : 'No'}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              {isBackendConnected ? 'Loading user data...' : 'Backend service unavailable'}
            </p>
          )}
        </Card>
      </div>

      <BackendConnectionStatus />
    </div>
  );
};
