
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  CirclePlus, 
  CircleX, 
  GitBranch, 
  MessageCircle, 
  PenSquare, 
  Plug, 
  PhoneForwarded 
} from "lucide-react";

interface NodePaletteProps {
  onAddNode: (nodeType: string) => void;
}

export const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode }) => {
  const nodeTypes = [
    { type: "startNode", label: "Start Node", icon: <CirclePlus className="h-4 w-4" /> },
    { type: "endNode", label: "End Node", icon: <CircleX className="h-4 w-4" /> },
    { type: "decisionNode", label: "Decision", icon: <GitBranch className="h-4 w-4" /> },
    { type: "messageNode", label: "Message", icon: <MessageCircle className="h-4 w-4" /> },
    { type: "inputNode", label: "Input", icon: <PenSquare className="h-4 w-4" /> },
    { type: "integrationNode", label: "Integration", icon: <Plug className="h-4 w-4" /> },
    { type: "transferNode", label: "Transfer", icon: <PhoneForwarded className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Node Types</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Drag and drop nodes onto the canvas to build your conversation flow
      </p>
      <div className="space-y-2">
        {nodeTypes.map((node) => (
          <Button
            key={node.type}
            variant="outline"
            className="w-full justify-start"
            onClick={() => onAddNode(node.type)}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("application/reactflow", node.type);
              event.dataTransfer.effectAllowed = "move";
            }}
          >
            <span className="mr-2">{node.icon}</span>
            {node.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
