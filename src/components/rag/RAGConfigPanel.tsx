
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
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

// Define schema for validation
const formSchema = z.object({
  chunkSize: z.number().min(128).max(2048),
  chunkOverlap: z.number().min(0).max(512),
  embeddingModel: z.string(),
  relevanceThreshold: z.number().min(0.5).max(0.95),
  contextWindowSize: z.number().min(1024).max(8192),
  useQueryReformulation: z.boolean()
});

const RAGConfigPanel: React.FC<RAGConfigPanelProps> = ({ 
  config, 
  onConfigChange, 
  isExpertMode 
}) => {
  // Setup form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  // Handle form changes that need to be propagated to parent
  const handleValueChange = (field: string, value: any) => {
    form.setValue(field as any, value);
    onConfigChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Configuration Settings</h2>
      <p className="text-muted-foreground">
        {isExpertMode
          ? "Adjust advanced parameters to fine-tune the RAG pipeline performance."
          : "Basic settings to control how your knowledge base responds to queries."}
      </p>

      <Form {...form}>
        <form className="grid gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Document Processing</h3>
              
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="chunkSize"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <div>
                        <FormLabel>Chunk Size ({field.value} tokens)</FormLabel>
                        <FormDescription className="mt-1 mb-3">
                          Controls how documents are split into chunks for processing
                        </FormDescription>
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            min={128}
                            max={2048}
                            step={64}
                            onValueChange={(value) => handleValueChange("chunkSize", value[0])}
                          />
                        </FormControl>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Small (128)</span>
                          <span>Medium (1024)</span>
                          <span>Large (2048)</span>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                
                {isExpertMode && (
                  <FormField
                    control={form.control}
                    name="chunkOverlap"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <div>
                          <FormLabel>Chunk Overlap ({field.value} tokens)</FormLabel>
                          <FormDescription className="mt-1 mb-3">
                            Overlap between consecutive chunks to maintain context
                          </FormDescription>
                          <FormControl>
                            <Slider
                              value={[field.value]}
                              min={0}
                              max={512}
                              step={16}
                              onValueChange={(value) => handleValueChange("chunkOverlap", value[0])}
                            />
                          </FormControl>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>None (0)</span>
                            <span>Medium (256)</span>
                            <span>High (512)</span>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Embedding & Retrieval</h3>
              
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="embeddingModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Embedding Model</FormLabel>
                      <FormDescription className="mt-1 mb-3">
                        Model used to convert text into vector embeddings
                      </FormDescription>
                      <Select 
                        value={field.value} 
                        onValueChange={(value) => handleValueChange("embeddingModel", value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select embedding model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {embeddingModels.map((model) => (
                            <SelectItem key={model.value} value={model.value}>
                              {model.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="relevanceThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relevance Threshold ({Math.round(field.value * 100)}%)</FormLabel>
                      <FormDescription className="mt-1 mb-3">
                        Minimum similarity score for documents to be included in results
                      </FormDescription>
                      <FormControl>
                        <Slider
                          value={[Math.round(field.value * 100)]}
                          min={50}
                          max={95}
                          step={1}
                          onValueChange={(value) => handleValueChange("relevanceThreshold", value[0] / 100)}
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Low precision (50%)</span>
                        <span>Balanced (75%)</span>
                        <span>High precision (95%)</span>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          {isExpertMode && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Advanced Settings</h3>
                
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="contextWindowSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Context Window Size ({field.value} tokens)</FormLabel>
                        <FormDescription className="mt-1 mb-3">
                          Maximum context size used for generating responses
                        </FormDescription>
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            min={1024}
                            max={8192}
                            step={1024}
                            onValueChange={(value) => handleValueChange("contextWindowSize", value[0])}
                          />
                        </FormControl>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Small (1K)</span>
                          <span>Medium (4K)</span>
                          <span>Large (8K)</span>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="useQueryReformulation"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between pt-2">
                        <div className="space-y-0.5">
                          <FormLabel>Query Reformulation</FormLabel>
                          <FormDescription>
                            Automatically rewrite queries to improve retrieval quality
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => handleValueChange("useQueryReformulation", checked)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </Form>
    </div>
  );
};

export default RAGConfigPanel;
