
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

interface FlowHeaderProps {
  flowName: string;
  setFlowName: (name: string) => void;
  onSave: () => void;
  unsavedChanges: boolean;
  onBack: () => void;
}

const FlowHeader = ({ flowName, setFlowName, onSave, unsavedChanges, onBack }: FlowHeaderProps) => {
  return (
    <div className="p-4 border-b bg-background flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Input
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="w-64 font-medium"
          />
          {unsavedChanges && (
            <span className="text-sm text-muted-foreground italic">
              (unsaved changes)
            </span>
          )}
        </div>
      </div>
      <Button onClick={onSave}>
        <Save className="mr-2 h-4 w-4" /> Save Flow
      </Button>
    </div>
  );
};

export default FlowHeader;
