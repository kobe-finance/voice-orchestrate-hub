import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolTestInterface } from '@/components/tools/ToolTestInterface';
import { ParameterBuilder } from '@/components/tools/ParameterBuilder';
import { ToolDefinition } from '@/types/tool';
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Settings, 
  Database, 
  Mail, 
  Calendar,
  CreditCard,
  Globe,
  Webhook
} from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';

const ToolsPlugins = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTool, setSelectedTool] = useState<ToolDefinition | null>(null);
  const [isTestOpen, setIsTestOpen] = useState(false);

  const mockTools: ToolDefinition[] = [
    {
      id: "tool-001",
      name: "Send Email",
      description: "Send emails via SMTP or email service providers",
      category: "email",
      parameters: [
        {
          name: "to",
          type: "string",
          description: "Recipient email address",
          required: true
        },
        {
          name: "subject",
          type: "string", 
          description: "Email subject line",
          required: true
        },
        {
          name: "body",
          type: "string",
          description: "Email content body",
          required: true
        }
      ],
      endpoint: {
        url: "https://api.emailservice.com/send",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        authentication: {
          type: "api_key",
          keyLocation: "header",
          keyName: "X-API-Key"
        }
      },
      errorHandling: {
        onError: "retry",
        retryCount: 3
      },
      llmConfig: {
        functionName: "send_email",
        functionDescription: "Send an email to a specified recipient",
        whenToUse: "When the user requests to send an email or when email communication is needed"
      },
      isActive: true,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      usageCount: 245
    },
    {
      id: "tool-002", 
      name: "Create Calendar Event",
      description: "Create events in calendar systems like Google Calendar",
      category: "calendar",
      parameters: [
        {
          name: "title",
          type: "string",
          description: "Event title",
          required: true
        },
        {
          name: "start_time",
          type: "string",
          description: "Event start time in ISO format",
          required: true
        },
        {
          name: "duration",
          type: "number",
          description: "Event duration in minutes",
          required: false,
          defaultValue: 60
        }
      ],
      endpoint: {
        url: "https://api.calendar.com/events",
        method: "POST"
      },
      errorHandling: {
        onError: "abort"
      },
      llmConfig: {
        functionName: "create_calendar_event",
        functionDescription: "Create a new calendar event",
        whenToUse: "When scheduling appointments or creating calendar entries"
      },
      isActive: true,
      createdAt: "2024-01-10T10:00:00Z", 
      updatedAt: "2024-01-10T10:00:00Z",
      usageCount: 89
    }
  ];

  const filteredTools = mockTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    const icons = {
      api: Globe,
      database: Database,
      email: Mail,
      calendar: Calendar,
      webhook: Webhook,
      crm: CreditCard,
      custom: Wrench
    };
    const IconComponent = icons[category] || Wrench;
    return <IconComponent className="h-4 w-4" />;
  };

  const handleTestTool = async (input: Record<string, any>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      success: true,
      message: "Tool executed successfully",
      output: input,
      timestamp: new Date().toISOString()
    };
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
              <BreadcrumbPage>Tools & Plugins</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Tools & Plugins</h1>
            <p className="text-muted-foreground">Manage and configure AI agent tools and integrations</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Tool
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="api">API</SelectItem>
              <SelectItem value="database">Database</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="calendar">Calendar</SelectItem>
              <SelectItem value="webhook">Webhook</SelectItem>
              <SelectItem value="crm">CRM</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="tools" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tools">Available Tools</TabsTrigger>
            <TabsTrigger value="test">Test Tool</TabsTrigger>
            <TabsTrigger value="builder">Tool Builder</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <Card key={tool.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(tool.category)}
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                      </div>
                      <Badge variant={tool.isActive ? "default" : "secondary"}>
                        {tool.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Category:</span>
                        <Badge variant="outline">{tool.category}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Parameters:</span>
                        <span>{tool.parameters.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Usage:</span>
                        <span>{tool.usageCount} calls</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            setSelectedTool(tool);
                            setIsTestOpen(true);
                          }}
                        >
                          <Play className="mr-1 h-3 w-3" />
                          Test
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            {selectedTool ? (
              <ToolTestInterface
                tool={selectedTool}
                onTest={handleTestTool}
              />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    Select a tool from the Available Tools tab to test it here.
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="builder" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tool Builder</CardTitle>
                <CardDescription>Create custom tools for your AI agents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Tool Name *</label>
                    <Input placeholder="e.g., Send Slack Message" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category *</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="api">API</SelectItem>
                        <SelectItem value="database">Database</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="calendar">Calendar</SelectItem>
                        <SelectItem value="webhook">Webhook</SelectItem>
                        <SelectItem value="crm">CRM</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <ParameterBuilder
                  parameters={[]}
                  onChange={() => {}}
                  title="Input Parameters"
                />
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Save Draft</Button>
                  <Button>Create Tool</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tool Configuration Settings</CardTitle>
                <CardDescription>Global settings for tool execution and management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Enable tool execution</label>
                      <p className="text-sm text-muted-foreground">Allow AI agents to execute tools</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Require confirmation</label>
                      <p className="text-sm text-muted-foreground">Ask for confirmation before executing tools</p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default timeout (seconds)</label>
                    <Input type="number" defaultValue="30" className="w-32" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max retries</label>
                    <Input type="number" defaultValue="3" className="w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {isTestOpen && selectedTool && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold">Test Tool: {selectedTool.name}</h3>
                <Button variant="ghost" onClick={() => setIsTestOpen(false)}>×</Button>
              </div>
              <div className="p-4 overflow-y-auto">
                <ToolTestInterface
                  tool={selectedTool}
                  onTest={handleTestTool}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsPlugins;
