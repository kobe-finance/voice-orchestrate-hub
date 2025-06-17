
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';
import { WorkflowCard } from '@/components/workflow/WorkflowCard';
import { WorkflowStats } from '@/components/workflow/WorkflowStats';
import { WorkflowTemplates } from '@/components/workflow/WorkflowTemplates';
import { WorkflowHistory } from '@/components/workflow/WorkflowHistory';
import { WorkflowSettings } from '@/components/workflow/WorkflowSettings';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused';
  trigger: string;
  actions: string[];
  lastRun: string;
}

const WorkflowAutomation = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-4 md:p-6 space-y-6">
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

        <WorkflowStats />

        <Tabs defaultValue="workflows" className="space-y-4">
          <TabsList>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">Execution History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </Tab sList>

          <TabsContent value="workflows" className="space-y-4">
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <WorkflowCard 
                  key={workflow.id} 
                  workflow={workflow} 
                  onToggle={toggleWorkflow}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <WorkflowTemplates />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <WorkflowHistory />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <WorkflowSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WorkflowAutomation;
