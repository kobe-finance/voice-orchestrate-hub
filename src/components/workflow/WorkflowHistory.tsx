
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const WorkflowHistory = () => {
  const executions = [
    { workflow: 'Lead Follow-up', status: 'Success', time: '2 minutes ago', duration: '1.2s' },
    { workflow: 'Appointment Reminders', status: 'Success', time: '15 minutes ago', duration: '0.8s' },
    { workflow: 'Lead Follow-up', status: 'Failed', time: '1 hour ago', duration: '2.1s' },
    { workflow: 'Call Summary Distribution', status: 'Success', time: '2 hours ago', duration: '3.4s' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Executions</CardTitle>
        <CardDescription>View workflow execution history and results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {executions.map((execution, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">{execution.workflow}</p>
                <p className="text-sm text-muted-foreground">{execution.time}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">{execution.duration}</span>
                <Badge variant={execution.status === 'Success' ? 'default' : 'destructive'}>
                  {execution.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
