
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Database, Settings, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock components with proper props
const RAGConfigPanel = ({ config, onConfigChange, isExpertMode }: any) => {
  return (
    <div className="space-y-4">
      <p>RAG Configuration Panel - Configure your retrieval settings here.</p>
      <div className="p-4 border rounded">
        <h3 className="font-medium mb-2">Configuration Options</h3>
        <p className="text-sm text-muted-foreground">RAG configuration interface will be implemented here.</p>
      </div>
    </div>
  );
};

const RAGPerformanceMetrics = ({ metrics }: any) => {
  return (
    <div className="space-y-4">
      <p>Performance Metrics Display</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded">
          <h4 className="font-medium">Accuracy</h4>
          <p className="text-2xl font-bold">92%</p>
        </div>
        <div className="p-4 border rounded">
          <h4 className="font-medium">Response Time</h4>
          <p className="text-2xl font-bold">1.2s</p>
        </div>
        <div className="p-4 border rounded">
          <h4 className="font-medium">Relevance Score</h4>
          <p className="text-2xl font-bold">0.85</p>
        </div>
      </div>
    </div>
  );
};

const RAGTestQuery = ({ onRunTest, testResults, config }: any) => {
  return (
    <div className="space-y-4">
      <p>Test your RAG queries here</p>
      <div className="p-4 border rounded">
        <h3 className="font-medium mb-2">Query Testing Interface</h3>
        <p className="text-sm text-muted-foreground">RAG test interface will be implemented here.</p>
      </div>
    </div>
  );
};

const PlatformKnowledgeManager = () => {
  return (
    <div className="space-y-4">
      <p>Platform Knowledge Base Manager</p>
      <div className="p-4 border rounded">
        <h3 className="font-medium mb-2">Knowledge Base Management</h3>
        <p className="text-sm text-muted-foreground">Platform knowledge management interface will be implemented here.</p>
      </div>
    </div>
  );
};

const RAGConfiguration = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("configuration");

  // Mock state for components
  const [config, setConfig] = useState({});
  const [testResults, setTestResults] = useState([]);
  const [metrics] = useState({
    accuracy: 0.92,
    responseTime: 1.2,
    relevanceScore: 0.85
  });

  const handleBackToDocuments = () => {
    navigate("/document-management");
  };

  const handleRunTest = (query: string) => {
    console.log("Running test query:", query);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDocuments}
            >
              <ArrowLeft size={16} />
              <span className="ml-2">Back to Documents</span>
            </Button>
            <h1 className="text-xl font-semibold">RAG Configuration</h1>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="configuration" className="flex items-center gap-2">
              <Settings size={16} />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="knowledge-bases" className="flex items-center gap-2">
              <Database size={16} />
              Knowledge Bases
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <BarChart3 size={16} />
              Performance
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-2">
              <Database size={16} />
              Testing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="configuration">
            <Card>
              <CardHeader>
                <CardTitle>RAG System Configuration</CardTitle>
                <CardDescription>
                  Configure retrieval-augmented generation settings for your AI agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RAGConfigPanel 
                  config={config}
                  onConfigChange={setConfig}
                  isExpertMode={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="knowledge-bases">
            <PlatformKnowledgeManager />
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Monitor RAG system performance and retrieval accuracy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RAGPerformanceMetrics metrics={metrics} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testing">
            <Card>
              <CardHeader>
                <CardTitle>RAG Testing Interface</CardTitle>
                <CardDescription>
                  Test queries against your knowledge base and evaluate responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RAGTestQuery 
                  onRunTest={handleRunTest}
                  testResults={testResults}
                  config={config}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RAGConfiguration;
