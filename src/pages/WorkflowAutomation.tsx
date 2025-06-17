
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Play, Pause, Settings, Plus, Zap, Clock, Users } from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';

const WorkflowAutomation = () => {
  const [workflows, setWorkflows] = useState([
    { 
      id: 'wf-1', 
      name: 'Lead Follow-up', 
      description: 'Automatically follow up with new leads after 24 hours',
      status: 'active',
      trigger: 'New Lead',
      actions: ['Send Email', 'Create Task'],
      lastRun: '2 hours ago'
    },
    { 
      id: 'wf-2', 
      name: 'Appointment Reminders', 
      description: 'Send SMS reminders 1 hour before appointments',
      status: 'active',
      trigger: 'Scheduled Appointment',
      actions: ['Send SMS'],
      lastRun: '30 minutes ago'
    },
    { 
      id: 'wf-3', 
      name: 'Call Summary Distribution', 
      description: 'Email call summaries to team members',
      status: 'paused',
      trigger: 'Call Completed',
      actions: ['Generate Summary', 'Send Email'],
      lastRun: '1 day ago'
    }
  ]);

  const toggleWorkflow = (id: string) => {
    setWorkflows(workflows.map(wf => 
      wf.id === id 
        ? { ...wf, status: wf.status === 'active' ? 'paused' : 'active' }
        : wf
    ));
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge className="bg-green-100 text-green-800">Active</Badge>
      : <Badge className="bg-gray-100 text-gray-800">Paused</Badge>;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Workflow Automation</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Workflow Automation</h1>
          <p className="text-muted-foreground">Automate your business processes and tasks</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">2 created this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Executions Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+18% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42h</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">Execution History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
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
                        onCheckedChange={() => toggleWorkflow(workflow.id)}
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
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Lead Nurturing', description: 'Automated lead follow-up sequence', category: 'Sales' },
              { name: 'Customer Onboarding', description: 'Welcome new customers', category: 'Support' },
              { name: 'Appointment Booking', description: 'Schedule and confirm appointments', category: 'Scheduling' },
              { name: 'Invoice Processing', description: 'Automate invoice generation', category: 'Finance' }
            ].map((template, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{template.category}</Badge>
                    <Button size="sm">Use Template</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Executions</CardTitle>
              <CardDescription>View workflow execution history and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { workflow: 'Lead Follow-up', status: 'Success', time: '2 minutes ago', duration: '1.2s' },
                  { workflow: 'Appointment Reminders', status: 'Success', time: '15 minutes ago', duration: '0.8s' },
                  { workflow: 'Lead Follow-up', status: 'Failed', time: '1 hour ago', duration: '2.1s' },
                  { workflow: 'Call Summary Distribution', status: 'Success', time: '2 hours ago', duration: '3.4s' }
                ].map((execution, index) => (
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
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowAutomation;
