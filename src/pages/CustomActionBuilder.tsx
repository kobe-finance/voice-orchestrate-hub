
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
import { ArrowRight, Code, Database, ExternalLink, Mail, Play, Plus, Save, Webhook } from "lucide-react";
import { toast } from "sonner";

// Sample data for templates and actions
const actionTemplates = [
  { 
    id: "api-call", 
    name: "API Call", 
    description: "Make HTTP requests to external APIs", 
    icon: <Code className="h-5 w-5" />,
    category: "integration" 
  },
  { 
    id: "data-lookup", 
    name: "Data Lookup", 
    description: "Query databases or data sources", 
    icon: <Database className="h-5 w-5" />,
    category: "data" 
  },
  { 
    id: "crm-update", 
    name: "CRM Update", 
    description: "Create or update CRM records", 
    icon: <ExternalLink className="h-5 w-5" />,
    category: "integration" 
  },
  { 
    id: "email-trigger", 
    name: "Email Trigger", 
    description: "Send email notifications", 
    icon: <Mail className="h-5 w-5" />,
    category: "notification" 
  },
  { 
    id: "webhook", 
    name: "Webhook Dispatch", 
    description: "Send webhook endpoints", 
    icon: <Webhook className="h-5 w-5" />,
    category: "integration" 
  },
];

const existingActions = [
  { 
    id: "1", 
    name: "Lookup Customer", 
    type: "API Call", 
    lastUsed: "2025-05-20", 
    usageCount: 128,
    status: "active" 
  },
  { 
    id: "2", 
    name: "Create Support Ticket", 
    type: "CRM Update", 
    lastUsed: "2025-05-19", 
    usageCount: 56,
    status: "active" 
  },
  { 
    id: "3", 
    name: "Send Confirmation Email", 
    type: "Email Trigger", 
    lastUsed: "2025-05-18", 
    usageCount: 89,
    status: "active" 
  },
];

const CustomActionBuilder = () => {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [actionName, setActionName] = useState("");
  const [actionDescription, setActionDescription] = useState("");
  const [actionType, setActionType] = useState("");
  const [actionConfig, setActionConfig] = useState({});
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTestLoading, setIsTestLoading] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = actionTemplates.find(t => t.id === templateId);
    if (template) {
      setActionType(template.name);
      setStep(2);
    }
  };

  const handleActionTest = () => {
    setIsTestLoading(true);
    // Simulate API call/test execution
    setTimeout(() => {
      setTestResult(JSON.stringify({ 
        status: "success", 
        message: "Action executed successfully", 
        data: { id: "test-123", timestamp: new Date().toISOString() } 
      }, null, 2));
      setIsTestLoading(false);
    }, 1500);
  };

  const handleActionSave = () => {
    // Validation
    if (!actionName || !actionType) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Save action (would connect to API in a real implementation)
    toast.success("Custom action saved successfully");
    
    // Reset form and go back to templates
    setStep(1);
    setSelectedTemplate(null);
    setActionName("");
    setActionDescription("");
    setActionType("");
    setActionConfig({});
    setTestResult(null);
    setActiveTab("actions"); // Switch to the actions list
  };

  // Render form based on selected action type
  const renderConfigForm = () => {
    switch (actionType) {
      case "API Call":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Endpoint URL</label>
              <Input placeholder="https://api.example.com/endpoint" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Method</label>
              <Select defaultValue="GET">
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Headers</label>
              <Textarea placeholder='{"Content-Type": "application/json"}' className="font-mono text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Body</label>
              <Textarea placeholder='{"key": "{{value}}"}' className="font-mono text-sm" />
              <p className="text-xs text-muted-foreground mt-1">Use {{variable}} syntax for dynamic values</p>
            </div>
          </div>
        );
      case "Email Trigger":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Recipients</label>
              <Input placeholder="{{customer.email}}, support@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <Input placeholder="Your request {{request.id}} has been processed" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Template</label>
              <Select defaultValue="default">
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Template</SelectItem>
                  <SelectItem value="confirmation">Confirmation Email</SelectItem>
                  <SelectItem value="alert">Alert Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Body</label>
              <Textarea placeholder="Dear {{customer.name}}, 
              
Thank you for your recent inquiry. We're happy to help with {{request.details}}.

Best regards,
The Support Team" 
              rows={6} />
            </div>
          </div>
        );
      case "Webhook Dispatch":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Webhook URL</label>
              <Input placeholder="https://hooks.example.com/trigger/abc123" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payload</label>
              <Textarea placeholder='{"event": "voice_agent_action", "data": {{conversation_data}}}' className="font-mono text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Secret (Optional)</label>
              <Input type="password" placeholder="Webhook secret for authentication" />
            </div>
          </div>
        );
      default:
        return (
          <div className="py-8 text-center text-muted-foreground">
            Please select an action type to configure
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Custom Action Builder</h1>
            <p className="text-muted-foreground">Create and manage custom actions for your voice agents</p>
          </div>
          <Button onClick={() => { setStep(1); setSelectedTemplate(null); }}>
            <Plus className="mr-2 h-4 w-4" /> New Action
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Action Templates</TabsTrigger>
            <TabsTrigger value="actions">My Actions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="mt-6">
            {step === 1 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {actionTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer hover:border-primary transition-colors ${selectedTemplate === template.id ? 'border-primary' : ''}`}
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
                      <Button variant="ghost" className="w-full" onClick={() => handleTemplateSelect(template.id)}>
                        Select <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Configure Action: {actionType}</CardTitle>
                  <CardDescription>Fill in the details for your custom action</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Action Name *</label>
                        <Input 
                          placeholder="E.g., Send Welcome Email" 
                          value={actionName} 
                          onChange={(e) => setActionName(e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Textarea 
                          placeholder="Briefly describe what this action does" 
                          value={actionDescription} 
                          onChange={(e) => setActionDescription(e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium mb-4">Parameter Configuration</h3>
                      {renderConfigForm()}
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium mb-4">Error Handling</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">On Error</label>
                          <Select defaultValue="retry">
                            <SelectTrigger>
                              <SelectValue placeholder="Select error behavior" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="retry">Retry (up to 3 times)</SelectItem>
                              <SelectItem value="fallback">Use fallback value</SelectItem>
                              <SelectItem value="abort">Abort conversation</SelectItem>
                              <SelectItem value="ignore">Ignore and continue</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {testResult && (
                      <div className="border-t pt-4">
                        <h3 className="text-lg font-medium mb-2">Test Result</h3>
                        <div className="bg-muted p-3 rounded-md">
                          <pre className="text-sm overflow-auto whitespace-pre-wrap">{testResult}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>Back to Templates</Button>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={handleActionTest}
                      disabled={isTestLoading}
                    >
                      {isTestLoading ? (
                        <div className="flex items-center">Testing...</div>
                      ) : (
                        <div className="flex items-center">
                          <Play className="mr-2 h-4 w-4" /> Test Action
                        </div>
                      )}
                    </Button>
                    <Button onClick={handleActionSave}>
                      <Save className="mr-2 h-4 w-4" /> Save Action
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="actions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Custom Actions</CardTitle>
                <CardDescription>View and manage all your configured actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {existingActions.map((action) => (
                      <TableRow key={action.id}>
                        <TableCell className="font-medium">{action.name}</TableCell>
                        <TableCell>{action.type}</TableCell>
                        <TableCell>{action.usageCount} calls</TableCell>
                        <TableCell>{action.lastUsed}</TableCell>
                        <TableCell>
                          <Badge variant={action.status === "active" ? "default" : "outline"}>
                            {action.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">View</Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>{action.name}</DialogTitle>
                                  <DialogDescription>Action details and configuration</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right text-sm font-medium">Type:</label>
                                    <div className="col-span-3">{action.type}</div>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right text-sm font-medium">Status:</label>
                                    <div className="col-span-3">
                                      <Badge variant={action.status === "active" ? "default" : "outline"}>
                                        {action.status === "active" ? "Active" : "Inactive"}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right text-sm font-medium">Usage:</label>
                                    <div className="col-span-3">{action.usageCount} calls</div>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right text-sm font-medium">Last Used:</label>
                                    <div className="col-span-3">{action.lastUsed}</div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline">Close</Button>
                                  <Button>Edit</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CustomActionBuilder;
