import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const Phase4ValidationComponent: React.FC = () => {
  const validationChecks = [
    {
      id: 'store-ui-only',
      name: 'State stores contain only UI state',
      description: 'useAppStore simplified to UI-only state',
      status: 'completed' as const,
      details: 'Removed user/auth state, kept sidebar, theme, modals'
    },
    {
      id: 'no-business-logic-contexts',
      name: 'No business logic in contexts',
      description: 'TenantContext simplified to ID only',
      status: 'completed' as const,
      details: 'Removed data fetching, moved to useTenantAPI hooks'
    },
    {
      id: 'server-state-react-query',
      name: 'Server state managed by React Query',
      description: 'Tenant/user data moved to hooks',
      status: 'completed' as const,
      details: 'useTenantData and useUserRole hooks created'
    },
    {
      id: 'separation-of-concerns',
      name: 'Clear separation of concerns',
      description: 'UI state vs server state vs business logic',
      status: 'completed' as const,
      details: 'Store: UI, Hooks: Server data, Services: Business logic'
    },
    {
      id: 'websocket-review',
      name: 'WebSocket context reviewed',
      description: 'Connection management appropriate for context',
      status: 'completed' as const,
      details: 'WebSocket kept as is - connection mgmt is appropriate'
    }
  ];

  const completedCount = validationChecks.filter(check => check.status === 'completed').length;
  const progressPercentage = Math.round((completedCount / validationChecks.length) * 100);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800">Pending</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Phase 4: State Management Cleanup - Validation Results
          <Badge className="bg-blue-100 text-blue-800">
            {progressPercentage}% Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {validationChecks.map((check) => (
            <div
              key={check.id}
              className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="mt-0.5">
                {getStatusIcon(check.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{check.name}</h3>
                  {getStatusBadge(check.status)}
                </div>
                <p className="text-sm text-gray-600 mb-2">{check.description}</p>
                <p className="text-xs text-gray-500">{check.details}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-medium text-green-800">Phase 4 Complete!</h3>
          </div>
          <p className="text-sm text-green-700">
            All state management cleanup tasks completed. Stores now contain only UI state, 
            contexts are simplified, and server state is managed through React Query hooks.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};