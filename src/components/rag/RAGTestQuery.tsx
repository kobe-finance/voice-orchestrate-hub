
import React, { useState } from "react";
import { Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TestResult {
  documentId: string;
  documentName: string;
  relevanceScore: number;
  snippet: string;
}

interface RAGTestQueryProps {
  onRunTest: (query: string) => void;
  testResults: TestResult[] | null;
  config: {
    chunkSize: number;
    chunkOverlap: number;
    embeddingModel: string;
    relevanceThreshold: number;
    contextWindowSize: number;
    useQueryReformulation: boolean;
  };
}

const RAGTestQuery: React.FC<RAGTestQueryProps> = ({
  onRunTest,
  testResults,
  config
}) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRunTest = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    // In a real application, this would be an async call to your backend
    setTimeout(() => {
      onRunTest(query);
      setIsLoading(false);
    }, 1200);
  };
  
  // Sample test queries for quick testing
  const sampleQueries = [
    "How do I configure the system settings?",
    "What are the recommended parameters for optimal performance?",
    "How does chunk size affect retrieval quality?",
    "Best practices for embedding model selection?",
    "Troubleshooting poor retrieval performance"
  ];
  
  // Format relevance score as a percentage
  const formatScore = (score: number) => {
    return `${(score * 100).toFixed(0)}%`;
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Test Query</h2>
      <p className="text-muted-foreground">
        Test how your knowledge base responds to sample queries with the current configuration.
      </p>
      
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a test query..."
            className="h-10"
          />
        </div>
        <Button 
          onClick={handleRunTest} 
          disabled={!query.trim() || isLoading}
          className="min-w-24"
        >
          {isLoading ? "Running..." : "Run Test"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        {sampleQueries.map((q, i) => (
          <Button 
            key={i} 
            variant="outline" 
            size="sm" 
            onClick={() => setQuery(q)}
            className="text-xs justify-start text-left h-auto py-1.5"
          >
            <Search size={12} className="mr-1 flex-shrink-0" />
            <span className="truncate">{q}</span>
          </Button>
        ))}
      </div>
      
      {testResults && (
        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Results</h3>
            <div className="text-sm text-muted-foreground">
              Minimum relevance score: {Math.round(config.relevanceThreshold * 100)}%
            </div>
          </div>
          
          {testResults.map((result, index) => (
            <Card key={index} className={`overflow-hidden ${result.relevanceScore < config.relevanceThreshold ? 'border-dashed opacity-70' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-muted-foreground" />
                    <span className="font-medium">{result.documentName}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium
                    ${result.relevanceScore > 0.8 ? 'bg-green-100 text-green-800' : 
                      result.relevanceScore > 0.7 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}`}
                  >
                    {formatScore(result.relevanceScore)}
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mt-2 bg-muted/50 p-3 rounded">
                  {result.snippet}
                </div>
                
                {result.relevanceScore < config.relevanceThreshold && (
                  <div className="text-xs mt-2 text-muted-foreground italic">
                    This result falls below the configured relevance threshold and would be filtered out.
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          <div className="text-center text-sm text-muted-foreground mt-2">
            Retrieved {testResults.filter(r => r.relevanceScore >= config.relevanceThreshold).length} 
            {' '}out of {testResults.length} documents based on current threshold.
          </div>
        </div>
      )}
      
      {!testResults && !isLoading && (
        <div className="bg-muted/30 border border-dashed rounded-md p-8 mt-4">
          <div className="text-center text-muted-foreground">
            <Search size={24} className="mx-auto mb-2 opacity-50" />
            <p>Run a test query to see results here</p>
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="bg-muted/30 border border-dashed rounded-md p-8 mt-4 animate-pulse">
          <div className="text-center text-muted-foreground">
            <p>Processing query...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RAGTestQuery;
