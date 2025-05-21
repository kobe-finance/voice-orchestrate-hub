import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface PropertyPanelProps {
  selectedNode: any;
  selectedEdge: any;
  onChange: (nodeId: string, data: any) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({ selectedNode, selectedEdge, onChange }) => {
  if (!selectedNode && !selectedEdge) return null;

  const handleChange = (key: string, value: any) => {
    if (selectedNode) {
      onChange(selectedNode.id, { [key]: value });
    }
  };

  const renderProperties = () => {
    if (!selectedNode) return null;
    
    switch (selectedNode.type) {
      case "startNode":
        return (
          <div className="space-y-4">
            <div>
              <Label>Start Message</Label>
              <Textarea 
                value={selectedNode.data.message || ""}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="Enter initial message to start the conversation"
                className="mt-1"
              />
            </div>
          </div>
        );
      
      case "endNode":
        return (
          <div className="space-y-4">
            <div>
              <Label>End Message</Label>
              <Textarea
                value={selectedNode.data.message || ""}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="Enter closing message"
                className="mt-1"
              />
            </div>
          </div>
        );
      
      case "decisionNode":
        return (
          <div className="space-y-4">
            <div>
              <Label>Decision Question</Label>
              <Textarea
                value={selectedNode.data.question || ""}
                onChange={(e) => handleChange("question", e.target.value)}
                placeholder="What question will trigger the decision?"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="flex items-center justify-between">
                Conditions
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    const conditions = [...(selectedNode.data.conditions || []), "New Condition"];
                    handleChange("conditions", conditions);
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </Label>
              <div className="mt-1 space-y-2">
                {selectedNode.data.conditions && selectedNode.data.conditions.map((condition: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      value={condition}
                      onChange={(e) => {
                        const newConditions = [...selectedNode.data.conditions];
                        newConditions[index] = e.target.value;
                        handleChange("conditions", newConditions);
                      }}
                      className="flex-1"
                    />
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => {
                        const newConditions = [...selectedNode.data.conditions];
                        newConditions.splice(index, 1);
                        handleChange("conditions", newConditions);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case "messageNode":
        return (
          <div className="space-y-4">
            <div>
              <Label>Message</Label>
              <Textarea
                value={selectedNode.data.message || ""}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="Enter message content"
                className="mt-1"
                rows={5}
              />
            </div>
            <div>
              <Label>Voice Type</Label>
              <Select 
                value={selectedNode.data.voiceType || "default"}
                onValueChange={(value) => handleChange("voiceType", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select voice type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="female_professional">Female Professional</SelectItem>
                  <SelectItem value="male_professional">Male Professional</SelectItem>
                  <SelectItem value="female_friendly">Female Friendly</SelectItem>
                  <SelectItem value="male_friendly">Male Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Speaking Rate</Label>
              <Input
                type="number"
                min="0.5"
                max="2"
                step="0.1"
                value={selectedNode.data.speakingRate || 1}
                onChange={(e) => handleChange("speakingRate", parseFloat(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        );
      
      case "inputNode":
        return (
          <div className="space-y-4">
            <div>
              <Label>Question</Label>
              <Textarea
                value={selectedNode.data.question || ""}
                onChange={(e) => handleChange("question", e.target.value)}
                placeholder="What question to ask the user?"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Input Type</Label>
              <Select 
                value={selectedNode.data.inputType || "text"}
                onValueChange={(value) => handleChange("inputType", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select input type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="yesno">Yes/No</SelectItem>
                  <SelectItem value="selection">Multiple Choice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedNode.data.inputType === "selection" && (
              <div>
                <Label className="flex items-center justify-between">
                  Options
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      const options = [...(selectedNode.data.options || []), "New Option"];
                      handleChange("options", options);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </Button>
                </Label>
                <div className="mt-1 space-y-2">
                  {selectedNode.data.options && selectedNode.data.options.map((option: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...selectedNode.data.options];
                          newOptions[index] = e.target.value;
                          handleChange("options", newOptions);
                        }}
                        className="flex-1"
                      />
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => {
                          const newOptions = [...selectedNode.data.options];
                          newOptions.splice(index, 1);
                          handleChange("options", newOptions);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      case "integrationNode":
        return (
          <div className="space-y-4">
            <div>
              <Label>Integration Type</Label>
              <Select 
                value={selectedNode.data.integrationType || "CRM"}
                onValueChange={(value) => handleChange("integrationType", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select integration type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CRM">CRM</SelectItem>
                  <SelectItem value="calendar">Calendar</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="custom">Custom API</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Action</Label>
              <Select 
                value={selectedNode.data.action || "lookup"}
                onValueChange={(value) => handleChange("action", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lookup">Lookup</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Configuration</Label>
              <Textarea
                value={selectedNode.data.configuration || ""}
                onChange={(e) => handleChange("configuration", e.target.value)}
                placeholder="Enter configuration details"
                className="mt-1"
                rows={5}
              />
            </div>
          </div>
        );
      
      case "transferNode":
        return (
          <div className="space-y-4">
            <div>
              <Label>Transfer Type</Label>
              <Select 
                value={selectedNode.data.transferType || "agent"}
                onValueChange={(value) => handleChange("transferType", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select transfer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">Human Agent</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="external">External Number</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Transfer Destination</Label>
              <Input
                value={selectedNode.data.destination || ""}
                onChange={(e) => handleChange("destination", e.target.value)}
                placeholder="Enter transfer destination"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Transfer Message</Label>
              <Textarea
                value={selectedNode.data.message || ""}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="Message to say before transfer"
                className="mt-1"
              />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <div>
              <Label>Label</Label>
              <Input 
                value={selectedNode.data.label || ""}
                onChange={(e) => handleChange("label", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Properties</h3>
        <p className="text-sm text-muted-foreground">
          Edit properties for the selected node
        </p>
      </div>
      
      <Accordion type="single" collapsible className="w-full" defaultValue="general">
        <AccordionItem value="general">
          <AccordionTrigger>General Settings</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <Label>Node Label</Label>
              <Input 
                value={selectedNode?.data.label || ""} 
                onChange={(e) => handleChange("label", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Node Description</Label>
              <Textarea 
                value={selectedNode?.data.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Optional description"
                className="mt-1"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="specific">
          <AccordionTrigger>Node Specific Settings</AccordionTrigger>
          <AccordionContent>
            {renderProperties()}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
