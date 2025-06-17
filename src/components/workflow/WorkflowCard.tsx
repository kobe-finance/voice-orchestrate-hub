
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Play, Pause, Settings } from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused';
  trigger: string;
  actions: string[];
  lastRun: string;
}

interface WorkflowCardProps {
  workflow: Workflow;
  onToggle: (id: string) => void;
}

export const WorkflowCard = ({ workflow, onToggle }: WorkflowCardProps) => {
  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge className="bg-green-100 text-green-800">Active</Badge>
      : <Badge className="bg-gray-100 text-gray-800">Paused</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{workflow.name}</CardTitle>
            <CardDescription>{workflow.description}</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(workflow.status)}
            <Switch 
              checked={workflow.status === 'active'}
              onCheckedChange={() => onToggle(workflow.id)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <Label>Trigger</Label>
            <p className="font-medium">{workflow.trigger}</p>
          </div>
          <div>
            <Label>Actions</Label>
            <p className="font-medium">{workflow.actions.join(', ')}</p>
          </div>
          <div>
            <Label>Last Run</Label>
            <p className="font-medium">{workflow.lastRun}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              {workflow.status === 'active' ? (
                <Pause className="h-4 w-4 mr-1" />
              ) : (
                <Play className="h-4 w-4 mr-1" />
              )}
              {workflow.status === 'active' ? 'Pause' : 'Run'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
