
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { ToolParameter } from "@/types/tool";

interface ParameterBuilderProps {
  parameters: ToolParameter[];
  onChange: (parameters: ToolParameter[]) => void;
  title?: string;
}

export const ParameterBuilder = ({ parameters, onChange, title = "Parameters" }: ParameterBuilderProps) => {
  const [expandedParams, setExpandedParams] = useState<Set<number>>(new Set());

  const addParameter = () => {
    const newParam: ToolParameter = {
      name: "",
      type: "string",
      description: "",
      required: false
    };
    onChange([...parameters, newParam]);
  };

  const updateParameter = (index: number, updates: Partial<ToolParameter>) => {
    const updated = parameters.map((param, i) => 
      i === index ? { ...param, ...updates } : param
    );
    onChange(updated);
  };

  const removeParameter = (index: number) => {
    onChange(parameters.filter((_, i) => i !== index));
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedParams);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedParams(newExpanded);
  };

  const addEnumValue = (paramIndex: number) => {
    const param = parameters[paramIndex];
    const newEnum = [...(param.enum || []), ""];
    updateParameter(paramIndex, { enum: newEnum });
  };

  const updateEnumValue = (paramIndex: number, enumIndex: number, value: string) => {
    const param = parameters[paramIndex];
    const newEnum = [...(param.enum || [])];
    newEnum[enumIndex] = value;
    updateParameter(paramIndex, { enum: newEnum });
  };

  const removeEnumValue = (paramIndex: number, enumIndex: number) => {
    const param = parameters[paramIndex];
    const newEnum = (param.enum || []).filter((_, i) => i !== enumIndex);
    updateParameter(paramIndex, { enum: newEnum });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Button onClick={addParameter} size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Parameter
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {parameters.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No parameters defined</p>
        ) : (
          parameters.map((param, index) => (
            <Card key={index} className="border-l-4 border-l-primary/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(index)}
                    >
                      {expandedParams.has(index) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </Button>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{param.name || "Unnamed Parameter"}</span>
                      <Badge variant="outline">{param.type}</Badge>
                      {param.required && <Badge variant="secondary">Required</Badge>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeParameter(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              {expandedParams.has(index) && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Parameter Name *</label>
                      <Input
                        value={param.name}
                        onChange={(e) => updateParameter(index, { name: e.target.value })}
                        placeholder="e.g., customer_id"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Type *</label>
                      <Select value={param.type} onValueChange={(value: any) => updateParameter(index, { type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                          <SelectItem value="array">Array</SelectItem>
                          <SelectItem value="object">Object</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Description *</label>
                    <Textarea
                      value={param.description}
                      onChange={(e) => updateParameter(index, { description: e.target.value })}
                      placeholder="Describe what this parameter is for and how the LLM should use it"
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={param.required}
                        onCheckedChange={(checked) => updateParameter(index, { required: checked })}
                      />
                      <label className="text-sm font-medium">Required</label>
                    </div>
                  </div>

                  {param.type === "string" && (
                    <div>
                      <label className="text-sm font-medium mb-1 block">Allowed Values (Optional)</label>
                      <div className="space-y-2">
                        {(param.enum || []).map((enumValue, enumIndex) => (
                          <div key={enumIndex} className="flex gap-2">
                            <Input
                              value={enumValue}
                              onChange={(e) => updateEnumValue(index, enumIndex, e.target.value)}
                              placeholder="Allowed value"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEnumValue(index, enumIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addEnumValue(index)}
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Value
                        </Button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium mb-1 block">Default Value (Optional)</label>
                    <Input
                      value={param.defaultValue || ""}
                      onChange={(e) => updateParameter(index, { defaultValue: e.target.value })}
                      placeholder="Default value if not provided"
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};
