
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Database, Settings, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RAGConfigPanel from "@/components/rag/RAGConfigPanel";
import RAGPerformanceMetrics from "@/components/rag/RAGPerformanceMetrics";
import RAGTestQuery from "@/components/rag/RAGTestQuery";
import PlatformKnowledgeManager from "@/components/rag/PlatformKnowledgeManager";

const RAGConfiguration = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("configuration");

  const handleBackToDocuments = () => {
    navigate("/document-management");
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
                <RAGConfigPanel />
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
                <RAGPerformanceMetrics />
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
                <RAGTestQuery />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RAGConfiguration;
