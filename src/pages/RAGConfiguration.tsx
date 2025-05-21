
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, TestTube, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import RAGConfigPanel from "@/components/rag/RAGConfigPanel";
import RAGPerformanceMetrics from "@/components/rag/RAGPerformanceMetrics";
import RAGTestQuery from "@/components/rag/RAGTestQuery";

const RAGConfiguration = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("config");
  const [isExpertMode, setIsExpertMode] = useState(false);

  // RAG configuration settings with sensible defaults
  const [ragConfig, setRagConfig] = useState({
    chunkSize: 1024,
    chunkOverlap: 200,
    embeddingModel: "openai-ada-002",
    relevanceThreshold: 0.75,
    contextWindowSize: 4096,
    useQueryReformulation: true,
  });

  // Performance metrics (mock data)
  const [performanceMetrics, setPerformanceMetrics] = useState({
    latency: 450,
    precision: 0.82,
    recall: 0.76,
    f1Score: 0.79,
    queriesPerMinute: 12,
  });

  // Test query results
  const [testResults, setTestResults] = useState<Array<{
    documentId: string;
    documentName: string;
    relevanceScore: number;
    snippet: string;
  }> | null>(null);

  // Handle configuration changes
  const handleConfigChange = (newConfig: Partial<typeof ragConfig>) => {
    const updatedConfig = { ...ragConfig, ...newConfig };
    setRagConfig(updatedConfig);
    
    // In a real app, this would trigger a backend call to update settings
    // and possibly get updated performance metrics
    
    // Mock performance impact based on configuration changes
    simulatePerformanceImpact(updatedConfig);
  };

  // Simulate performance impact of configuration changes (mock functionality)
  const simulatePerformanceImpact = (config: typeof ragConfig) => {
    // For demonstration: simulate how different settings affect performance metrics
    const latencyImpact = Math.max(
      200,
      450 - (config.contextWindowSize / 1024 * 50) + 
      (config.chunkSize / 200 * 30) +
      (config.useQueryReformulation ? 120 : 0)
    );
    
    const precisionImpact = Math.min(
      0.95,
      0.82 + (config.relevanceThreshold - 0.75) * 0.3
    );
    
    setPerformanceMetrics({
      latency: Math.round(latencyImpact),
      precision: Number(precisionImpact.toFixed(2)),
      recall: Number((0.76 - (config.relevanceThreshold - 0.75) * 0.4).toFixed(2)),
      f1Score: Number((0.79 + (config.relevanceThreshold - 0.75) * 0.1).toFixed(2)),
      queriesPerMinute: Math.round(60000 / latencyImpact),
    });
  };
  
  // Handle test query submission
  const runTestQuery = (query: string) => {
    // In a real app, this would call your backend to run the test query
    // For now, we'll simulate test results
    setTestResults([
      {
        documentId: "1",
        documentName: "Product Manual.pdf",
        relevanceScore: 0.92,
        snippet: "The configuration settings can be adjusted using the control panel. To modify the parameters, access the settings through the main interface..."
      },
      {
        documentId: "3", 
        documentName: "Technical Specification.txt",
        relevanceScore: 0.85,
        snippet: "Technical parameters include adjustable thresholds for relevance scoring and context window size. These values can be configured to optimize performance..."
      },
      {
        documentId: "2",
        documentName: "Customer FAQ.docx",
        relevanceScore: 0.71,
        snippet: "Frequently asked questions about system configuration and settings. How do I change the default settings? Where can I find advanced configuration options?"
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/conversation-flow")}
            >
              <ArrowLeft size={16} />
              <span className="ml-2">Back</span>
            </Button>
            <h1 className="text-xl font-semibold">RAG Configuration</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={isExpertMode ? "default" : "outline"} 
              size="sm"
              onClick={() => setIsExpertMode(true)}
            >
              <Settings className="mr-2 h-4 w-4" />
              Expert Mode
            </Button>
            <Button 
              variant={!isExpertMode ? "default" : "outline"} 
              size="sm"
              onClick={() => setIsExpertMode(false)}
            >
              <Settings className="mr-2 h-4 w-4" />
              Basic Mode
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings size={16} />
              <span>Configuration</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <BarChart size={16} />
              <span>Performance</span>
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <TestTube size={16} />
              <span>Test Query</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="config">
            <Card>
              <CardContent className="p-6">
                <RAGConfigPanel 
                  config={ragConfig}
                  onConfigChange={handleConfigChange}
                  isExpertMode={isExpertMode}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance">
            <Card>
              <CardContent className="p-6">
                <RAGPerformanceMetrics metrics={performanceMetrics} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="test">
            <Card>
              <CardContent className="p-6">
                <RAGTestQuery 
                  onRunTest={runTestQuery} 
                  testResults={testResults} 
                  config={ragConfig}
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
