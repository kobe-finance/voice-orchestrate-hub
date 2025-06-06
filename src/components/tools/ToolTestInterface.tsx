
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Play, RotateCcw } from "lucide-react";
import { ToolDefinition, ToolParameter } from "@/types/tool";
import { toast } from "sonner";

interface ToolTestInterfaceProps {
  tool: ToolDefinition;
  onTest: (input: Record<string, any>) => Promise<any>;
}

export const ToolTestInterface = ({ tool, onTest }: ToolTestInterfaceProps) => {
  const [testInput, setTestInput] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const updateInput = (paramName: string, value: any) => {
    setTestInput(prev => ({ ...prev, [paramName]: value }));
  };

  const handleTest = async () => {
    setIsLoading(true);
    setError(null);
    setTestResult(null);

    try {
      const missingRequired = tool.parameters
        .filter(p => p.required && !testInput[p.name])
        .map(p => p.name);

      if (missingRequired.length > 0) {
        throw new Error(`Missing required parameters: ${missingRequired.join(", ")}`);
      }

      const result = await onTest(testInput);
      setTestResult(result);
      toast.success("Tool executed successfully");
    } catch (err: any) {
      setError(err.message || "Tool execution failed");
      toast.error("Tool execution failed", {
        description: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetTest = () => {
    setTestInput({});
    setTestResult(null);
    setError(null);
  };

  const renderInputField = (param: ToolParameter) => {
    const value = testInput[param.name] || param.defaultValue || "";

    switch (param.type) {
      case "boolean":
        return (
          <Switch
            checked={Boolean(value)}
            onCheckedChange={(checked) => updateInput(param.name, checked)}
          />
        );
      
      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => updateInput(param.name, Number(e.target.value))}
            placeholder={param.description}
          />
        );
      
      case "string":
        if (param.enum && param.enum.length > 0) {
          return (
            <Select
              value={value}
              onValueChange={(val) => updateInput(param.name, val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a value" />
              </SelectTrigger>
              <SelectContent>
                {param.enum.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        
        if (param.description.toLowerCase().includes("long") || 
            param.description.toLowerCase().includes("text") ||
            param.description.toLowerCase().includes("message")) {
          return (
            <Textarea
              value={value}
              onChange={(e) => updateInput(param.name, e.target.value)}
              placeholder={param.description}
              rows={3}
            />
          );
        }
        
        return (
          <Input
            value={value}
            onChange={(e) => updateInput(param.name, e.target.value)}
            placeholder={param.description}
          />
        );
      
      case "array":
        return (
          <Textarea
            value={Array.isArray(value) ? JSON.stringify(value, null, 2) : value}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                updateInput(param.name, parsed);
              } catch {
                updateInput(param.name, e.target.value);
              }
            }}
            placeholder="Enter JSON array, e.g., [1, 2, 3]"
            rows={3}
          />
        );
      
      case "object":
        return (
          <Textarea
            value={typeof value === "object" ? JSON.stringify(value, null, 2) : value}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                updateInput(param.name, parsed);
              } catch {
                updateInput(param.name, e.target.value);
              }
            }}
            placeholder='Enter JSON object, e.g., {"key": "value"}'
            rows={4}
          />
        );
      
      default:
        return (
          <Input
            value={value}
            onChange={(e) => updateInput(param.name, e.target.value)}
            placeholder={param.description}
          />
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Tool Testing
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetTest}>
              <RotateCcw className="h-4 w-4 mr-2" /> Reset
            </Button>
            <Button onClick={handleTest} disabled={isLoading}>
              {isLoading ? (
                "Testing..."
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" /> Test Tool
                </>
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {tool.parameters.length > 0 ? (
          <div>
            <h4 className="font-medium mb-4">Input Parameters</h4>
            <div className="space-y-4">
              {tool.parameters.map((param) => (
                <div key={param.name} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">{param.name}</label>
                    <Badge variant="outline">{param.type}</Badge>
                    {param.required && <Badge variant="secondary">Required</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{param.description}</p>
                  {renderInputField(param)}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">This tool has no input parameters.</p>
        )}

        {(testResult || error) && (
          <div>
            <h4 className="font-medium mb-2">Test Result</h4>
            <div className="bg-muted p-4 rounded-lg">
              {error ? (
                <div className="text-destructive">
                  <p className="font-medium">Error:</p>
                  <pre className="text-sm mt-1">{error}</pre>
                </div>
              ) : (
                <pre className="text-sm overflow-auto whitespace-pre-wrap">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
