
import React from "react";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";

interface RAGConfigPanelProps {
  config: {
    chunkSize: number;
    chunkOverlap: number;
    embeddingModel: string;
    relevanceThreshold: number;
    contextWindowSize: number;
    useQueryReformulation: boolean;
  };
  onConfigChange: (config: Partial<RAGConfigPanelProps['config']>) => void;
  isExpertMode: boolean;
}

const RAGConfigPanel: React.FC<RAGConfigPanelProps> = ({ 
  config, 
  onConfigChange, 
  isExpertMode 
}) => {
  const form = useForm({
    defaultValues: config
  });

  // Available embedding models
  const embeddingModels = [
    { value: "openai-ada-002", label: "OpenAI Ada 002" },
    { value: "openai-text-embedding-3-small", label: "OpenAI Text Embedding 3 Small" },
    { value: "openai-text-embedding-3-large", label: "OpenAI Text Embedding 3 Large" },
    { value: "cohere-embed-english-v3.0", label: "Cohere Embed English v3.0" },
    { value: "jina-base-en-v1", label: "Jina Base English v1" }
  ];

  // Handle individual field changes
  const handleChunkSizeChange = (value: number[]) => {
    onConfigChange({ chunkSize: value[0] });
  };

  const handleChunkOverlapChange = (value: number[]) => {
    onConfigChange({ chunkOverlap: value[0] });
  };

  const handleThresholdChange = (value: number[]) => {
    onConfigChange({ relevanceThreshold: value[0] / 100 });
  };

  const handleContextWindowChange = (value: number[]) => {
    onConfigChange({ contextWindowSize: value[0] });
  };

  const handleEmbeddingModelChange = (value: string) => {
    onConfigChange({ embeddingModel: value });
  };

  const handleQueryReformulationChange = (checked: boolean) => {
    onConfigChange({ useQueryReformulation: checked });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Configuration Settings</h2>
      <p className="text-muted-foreground">
        {isExpertMode
          ? "Adjust advanced parameters to fine-tune the RAG pipeline performance."
          : "Basic settings to control how your knowledge base responds to queries."}
      </p>

      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Document Processing</h3>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <FormLabel>Chunk Size ({config.chunkSize} tokens)</FormLabel>
                  <FormDescription className="mt-1 mb-3">
                    Controls how documents are split into chunks for processing
                  </FormDescription>
                  <Slider
                    value={[config.chunkSize]}
                    min={128}
                    max={2048}
                    step={64}
                    onValueChange={handleChunkSizeChange}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Small (128)</span>
                    <span>Medium (1024)</span>
                    <span>Large (2048)</span>
                  </div>
                </div>
                
                {isExpertMode && (
                  <div>
                    <FormLabel>Chunk Overlap ({config.chunkOverlap} tokens)</FormLabel>
                    <FormDescription className="mt-1 mb-3">
                      Overlap between consecutive chunks to maintain context
                    </FormDescription>
                    <Slider
                      value={[config.chunkOverlap]}
                      min={0}
                      max={512}
                      step={16}
                      onValueChange={handleChunkOverlapChange}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>None (0)</span>
                      <span>Medium (256)</span>
                      <span>High (512)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Embedding & Retrieval</h3>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <FormLabel>Embedding Model</FormLabel>
                  <FormDescription className="mt-1 mb-3">
                    Model used to convert text into vector embeddings
                  </FormDescription>
                  <Select 
                    value={config.embeddingModel} 
                    onValueChange={handleEmbeddingModelChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select embedding model" />
                    </SelectTrigger>
                    <SelectContent>
                      {embeddingModels.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <FormLabel>Relevance Threshold ({Math.round(config.relevanceThreshold * 100)}%)</FormLabel>
                  <FormDescription className="mt-1 mb-3">
                    Minimum similarity score for documents to be included in results
                  </FormDescription>
                  <Slider
                    value={[Math.round(config.relevanceThreshold * 100)]}
                    min={50}
                    max={95}
                    step={1}
                    onValueChange={handleThresholdChange}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Low precision (50%)</span>
                    <span>Balanced (75%)</span>
                    <span>High precision (95%)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {isExpertMode && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Advanced Settings</h3>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <FormLabel>Context Window Size ({config.contextWindowSize} tokens)</FormLabel>
                    <FormDescription className="mt-1 mb-3">
                      Maximum context size used for generating responses
                    </FormDescription>
                    <Slider
                      value={[config.contextWindowSize]}
                      min={1024}
                      max={8192}
                      step={1024}
                      onValueChange={handleContextWindowChange}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Small (1K)</span>
                      <span>Medium (4K)</span>
                      <span>Large (8K)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <FormLabel>Query Reformulation</FormLabel>
                      <FormDescription>
                        Automatically rewrite queries to improve retrieval quality
                      </FormDescription>
                    </div>
                    <Switch
                      checked={config.useQueryReformulation}
                      onCheckedChange={handleQueryReformulationChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RAGConfigPanel;
