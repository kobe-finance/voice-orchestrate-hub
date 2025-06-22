
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, Plus, Settings, Play, Pause, Edit, Trash2, Copy, BarChart3, Users } from 'lucide-react';
import { PageLayout } from '@/components/layouts/PageLayout';

const VoiceAgents = () => {
  const [agents] = useState([
    { 
      id: '1', 
      name: 'Sales Assistant', 
      status: 'active', 
      calls: 127, 
      successRate: '94%',
      description: 'Handles lead qualification and initial sales conversations',
      lastActive: '2 minutes ago'
    },
    { 
      id: '2', 
      name: 'Customer Support', 
      status: 'active', 
      calls: 89, 
      successRate: '96%',
      description: 'Provides customer service and technical support',
      lastActive: '5 minutes ago'
    },
    { 
      id: '3', 
      name: 'Appointment Scheduler', 
      status: 'paused', 
      calls: 156, 
      successRate: '91%',
      description: 'Manages appointment booking and scheduling',
      lastActive: '1 hour ago'
    },
    { 
      id: '4', 
      name: 'Order Processing', 
      status: 'draft', 
      calls: 0, 
      successRate: '--',
      description: 'Handles order processing and payment collection',
      lastActive: 'Never'
    }
  ]);

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Voice Agents" }
  ];

  const actions = (
    <Button variant="gradient" leftIcon={<Plus className="h-4 w-4" />}>
      Create New Agent
    </Button>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'draft': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-3 w-3" />;
      case 'paused': return <Pause className="h-3 w-3" />;
      default: return <Edit className="h-3 w-3" />;
    }
  };

  return (
    <PageLayout
      title="Voice Agents"
      description="Manage and configure your AI voice agents for different use cases."
      breadcrumbs={breadcrumbs}
      actions={actions}
    >
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            All Agents
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Active
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Copy className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id} variant="interactive" className="group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Mic className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getStatusColor(agent.status)} className="gap-1">
                            {getStatusIcon(agent.status)}
                            {agent.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="mt-2">{agent.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-lg font-semibold">{agent.calls}</div>
                      <div className="text-xs text-muted-foreground">Total Calls</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-lg font-semibold text-green-600">{agent.successRate}</div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mb-4">
                    Last active: {agent.lastActive}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" leftIcon={<Edit className="h-4 w-4" />}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" leftIcon={<Copy className="h-4 w-4" />}>
                      Clone
                    </Button>
                    <Button size="sm" variant="outline" leftIcon={<Trash2 className="h-4 w-4" />}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <Card variant="elevated">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Active Voice Agents</h3>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                <div className="text-center">
                  <Play className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active agents monitoring dashboard</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card variant="elevated">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Agent Templates</h3>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                <div className="text-center">
                  <Copy className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pre-built agent templates gallery</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card variant="elevated">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Agent Analytics</h3>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Agent performance analytics and insights</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default VoiceAgents;
