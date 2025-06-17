
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const WorkflowSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Automation Settings</CardTitle>
        <CardDescription>Configure global automation preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label>Enable notifications</Label>
            <p className="text-sm text-muted-foreground">Get notified when workflows fail</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Auto-retry failed workflows</Label>
            <p className="text-sm text-muted-foreground">Automatically retry failed executions</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="space-y-2">
          <Label>Maximum retry attempts</Label>
          <select className="w-full p-2 border rounded">
            <option>1</option>
            <option>3</option>
            <option>5</option>
            <option>10</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
};
