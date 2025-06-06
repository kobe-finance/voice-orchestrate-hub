
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Code, Database, ExternalLink, Mail, Plus, Save, Webhook, Settings, Eye, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ParameterBuilder } from "@/components/tools/ParameterBuilder";
import { ToolTestInterface } from "@/components/tools/ToolTestInterface";
import { ToolDefinition, ToolParameter } from "@/types/tool";

// Sample data for templates and existing tools
const toolTemplates = [
  { 
    id: "api-call", 
    name: "API Call", 
    description: "Make HTTP requests to external APIs with full parameter control", 
    icon: <Code className="h-5 w-5" />,
    category: "api" 
  },
  { 
    id: "data-lookup", 
    name: "Database Query", 
    description: "Query databases with custom SQL or NoSQL queries", 
    icon: <Database className="h-5 w-5" />,
    category: "database" 
  },
  { 
    id: "crm-update", 
    name: "CRM Integration", 
    description: "Create, read, update CRM records with field mapping", 
    icon: <ExternalLink className="h-5 w-5" />,
    category: "crm" 
  },
  { 
    id: "email-trigger", 
    name: "Email Automation", 
    description: "Send emails with dynamic content and attachments", 
    icon: <Mail className="h-5 w-5" />,
    category: "email" 
  },
  { 
    id: "webhook", 
    name: "Webhook Dispatch", 
    description: "Send webhook requests with custom payloads and authentication", 
    icon: <Webhook className="h-5 w-5" />,
    category: "webhook" 
  },
];

const existingTools: ToolDefinition[] = [
  { 
    id: "1", 
    name: "Customer Lookup", 
    description: "Look up customer information by phone or email",
    category: "crm",
    parameters: [
      { name: "identifier", type: "string", description: "Phone number or email", required: true },
      { name: "include_history", type: "boolean", description: "Include call history", required: false, defaultValue: false }
    ],
    endpoint: {
      url: "https://api.example.com/customers/lookup",
      method: "GET"
    },
    errorHandling: { onError: "fallback", fallbackValue: "Customer not found" },
    llmConfig: {
      functionName: "lookup_customer",
      functionDescription: "Find customer information using phone number or email address",
      whenToUse: "When user provides contact information and you need to identify the customer"
    },
    isActive: true,
    createdAt: "2025-05-20T10:00:00Z",
    updatedAt: "2025-05-20T10:00:00Z",
    usageCount: 128
  },
  { 
    id: "2", 
    name: "Schedule Appointment", 
    description: "Book appointments in the calendar system",
    category: "calendar",
    parameters: [
      { name: "customer_id", type: "string", description: "Customer identifier", required: true },
      { name: "service_type", type: "string", description: "Type of service", required: true, enum: ["plumbing", "electrical", "hvac"] },
      { name: "preferred_date", type: "string", description: "Preferred appointment date (YYYY-MM-DD)", required: true },
      { name: "notes", type: "string", description: "Additional notes", required: false }
    ],
    endpoint: {
      url: "https://api.example.com/appointments",
      method: "POST"
    },
    errorHandling: { onError: "retry", retryCount: 3 },
    llmConfig: {
      functionName: "schedule_appointment",
      functionDescription: "Book an appointment for a customer service",
      whenToUse: "When customer wants to schedule a service appointment"
    },
    isActive: true,
    createdAt: "2025-05-19T14:30:00Z",
    updatedAt: "2025-05-19T14:30:00Z",
    usageCount: 89
  }
];

const CustomActionBuilder = () => {
  const [activeTab, setActiveTab] = useState("tools");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentTool, setCurrentTool] = useState<Partial<ToolDefinition>>({
    name: "",
    description: "",
    category: "api",
    parameters: [],
    errorHandling: { onError: "retry", retryCount: 3 },
    llmConfig: {
      functionName: "",
      functionDescription: "",
      whenToUse: ""
    },
    isActive: true
  });

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setCurrentTool({
      name: "",
      description: "",
      category: "api",
      parameters: [],
      errorHandling: { onError: "retry", retryCount: 3 },
      llmConfig: {
        functionName: "",
        functionDescription: "",
        whenToUse: ""
      },
      isActive: true
    });
    setIsCreating(true);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = toolTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setCurrentTool({
        name: template.name,
        description: template.description,
        category: template.category as any,
        parameters: [],
        errorHandling: { onError: "retry", retryCount: 3 },
        llmConfig: {
          functionName: template.name.toLowerCase().replace(/\s+/g, '_'),
          functionDescription: template.description,
          whenToUse: `When you need to ${template.description.toLowerCase()}`
        },
        isActive: true
      });
      setIsCreating(true);
    }
  };

  const handleSave = () => {
    if (!currentTool.name || !currentTool.description || !currentTool.llmConfig?.functionName) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Tool saved successfully");
    setIsCreating(false);
    setActiveTab("tools");
  };

  const handleTest = async (input: Record<string, any>) => {
    // Simulate tool execution
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.8) {
          reject(new Error("Simulated API error"));
        } else {
          resolve({
            status: "success",
            data: { result: "Tool executed successfully", input, timestamp: new Date().toISOString() }
          });
        }
      }, 1000);
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Tool & Plugin Management</h1>
            <p className="text-muted-foreground">Create and manage tools that your voice agents can use</p>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" /> Create Tool
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tools">My Tools</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="create" disabled={!isCreating}>Tool Builder</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tools" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Tools</CardTitle>
                <CardDescription>Tools available to your voice agents</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Parameters</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {existingTools.map((tool) => (
                      <TableRow key={tool.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{tool.name}</div>
                            <div className="text-sm text-muted-foreground">{tool.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{tool.category}</Badge>
                        </TableCell>
                        <TableCell>{tool.parameters.length} params</TableCell>
                        <TableCell>{tool.usageCount} calls</TableCell>
                        <TableCell>
                          <Badge variant={tool.isActive ? "default" : "outline"}>
                            {tool.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {toolTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {template.icon}
                      </div>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    <CardTitle className="mt-2">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" className="w-full">
                      Use Template <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="mt-6">
            {isCreating && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Define the core properties of your tool</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Tool Name *</label>
                        <Input 
                          value={currentTool.name || ""} 
                          onChange={(e) => setCurrentTool({...currentTool, name: e.target.value})}
                          placeholder="e.g., Customer Lookup" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Category *</label>
                        <Select 
                          value={currentTool.category} 
                          onValueChange={(value: any) => setCurrentTool({...currentTool, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="api">API Integration</SelectItem>
                            <SelectItem value="database">Database</SelectItem>
                            <SelectItem value="crm">CRM</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="webhook">Webhook</SelectItem>
                            <SelectItem value="calendar">Calendar</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description *</label>
                      <Textarea 
                        value={currentTool.description || ""} 
                        onChange={(e) => setCurrentTool({...currentTool, description: e.target.value})}
                        placeholder="Describe what this tool does and when to use it" 
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>LLM Function Configuration</CardTitle>
                    <CardDescription>Configure how the LLM will understand and use this tool</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Function Name *</label>
                      <Input 
                        value={currentTool.llmConfig?.functionName || ""} 
                        onChange={(e) => setCurrentTool({
                          ...currentTool, 
                          llmConfig: {...currentTool.llmConfig!, functionName: e.target.value}
                        })}
                        placeholder="e.g., lookup_customer (snake_case)" 
                      />
                      <p className="text-xs text-muted-foreground mt-1">Use snake_case for function names</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Function Description *</label>
                      <Textarea 
                        value={currentTool.llmConfig?.functionDescription || ""} 
                        onChange={(e) => setCurrentTool({
                          ...currentTool, 
                          llmConfig: {...currentTool.llmConfig!, functionDescription: e.target.value}
                        })}
                        placeholder="Describe what this function does for the LLM" 
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">When to Use *</label>
                      <Textarea 
                        value={currentTool.llmConfig?.whenToUse || ""} 
                        onChange={(e) => setCurrentTool({
                          ...currentTool, 
                          llmConfig: {...currentTool.llmConfig!, whenToUse: e.target.value}
                        })}
                        placeholder="Explain when the LLM should call this function" 
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                <ParameterBuilder
                  parameters={currentTool.parameters || []}
                  onChange={(parameters) => setCurrentTool({...currentTool, parameters})}
                  title="Input Parameters"
                />

                {currentTool.parameters && currentTool.parameters.length > 0 && (
                  <ToolTestInterface
                    tool={currentTool as ToolDefinition}
                    onTest={handleTest}
                  />
                )}

                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" /> Save Tool
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CustomActionBuilder;
