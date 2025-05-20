
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CirclePlus, CircleX, GitBranch, MessageCircle, PenSquare, Plug, PhoneForwarded } from 'lucide-react';
import { cn } from '@/lib/utils';

// Start Node
const StartNode = memo(({ data, isConnectable, selected }: any) => {
  return (
    <div className={cn(
      "px-4 py-2 rounded-lg border bg-background min-w-32 text-center",
      selected ? "border-primary shadow-md" : "border-accent",
      "start-node"
    )}>
      <div className="flex items-center justify-center gap-2">
        <CirclePlus className="h-4 w-4 text-primary" />
        <div>{data.label}</div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="handle-standard"
      />
    </div>
  );
});

// End Node
const EndNode = memo(({ data, isConnectable, selected }: any) => {
  return (
    <div className={cn(
      "px-4 py-2 rounded-lg border bg-background min-w-32 text-center",
      selected ? "border-primary shadow-md" : "border-accent",
      "end-node"
    )}>
      <div className="flex items-center justify-center gap-2">
        <CircleX className="h-4 w-4 text-destructive" />
        <div>{data.label}</div>
      </div>
      
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="handle-standard"
      />
    </div>
  );
});

// Decision Node
const DecisionNode = memo(({ data, isConnectable, selected }: any) => {
  const conditions = data.conditions || ["Yes", "No"];
  
  return (
    <div className={cn(
      "px-4 py-2 rounded-lg border bg-background min-w-40",
      selected ? "border-primary shadow-md" : "border-accent",
      "decision-node"
    )}>
      <div className="flex items-center gap-2">
        <GitBranch className="h-4 w-4 text-warning-yellow" />
        <div>{data.label}</div>
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground truncate">
        {data.question || "Decision condition"}
      </div>
      
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="handle-standard"
      />
      
      {conditions.map((condition: string, index: number) => (
        <Handle
          key={`condition-${index}`}
          type="source"
          position={Position.Bottom}
          id={`condition-${index}`}
          style={{ left: `${(index + 1) * (100 / (conditions.length + 1))}%` }}
          isConnectable={isConnectable}
          className="handle-standard"
          data-condition={condition}
        />
      ))}
      
      {conditions.length > 0 && (
        <div className="flex justify-around mt-3 text-xs text-muted-foreground">
          {conditions.map((condition: string, index: number) => (
            <div key={index} style={{ position: 'absolute', left: `${(index + 1) * (100 / (conditions.length + 1)) - 10}%` }}>
              {condition}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// Message Node
const MessageNode = memo(({ data, isConnectable, selected }: any) => {
  return (
    <div className={cn(
      "px-4 py-2 rounded-lg border bg-background min-w-40",
      selected ? "border-primary shadow-md" : "border-accent",
      "message-node"
    )}>
      <div className="flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-blue-500" />
        <div>{data.label}</div>
      </div>
      
      {data.message && (
        <div className="mt-2 text-xs text-muted-foreground max-w-48 truncate">
          {data.message}
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="handle-standard"
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="handle-standard"
      />
    </div>
  );
});

// Input Node
const InputNode = memo(({ data, isConnectable, selected }: any) => {
  return (
    <div className={cn(
      "px-4 py-2 rounded-lg border bg-background min-w-40",
      selected ? "border-primary shadow-md" : "border-accent",
      "input-node"
    )}>
      <div className="flex items-center gap-2">
        <PenSquare className="h-4 w-4 text-green-500" />
        <div>{data.label}</div>
      </div>
      
      {data.question && (
        <div className="mt-2 text-xs text-muted-foreground max-w-48 truncate">
          {data.question}
        </div>
      )}
      
      <div className="mt-1 text-xs font-medium">
        Type: {data.inputType || "text"}
      </div>
      
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="handle-standard"
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="handle-standard"
      />
    </div>
  );
});

// Integration Node
const IntegrationNode = memo(({ data, isConnectable, selected }: any) => {
  return (
    <div className={cn(
      "px-4 py-2 rounded-lg border bg-background min-w-40",
      selected ? "border-primary shadow-md" : "border-accent",
      "integration-node"
    )}>
      <div className="flex items-center gap-2">
        <Plug className="h-4 w-4 text-purple-500" />
        <div>{data.label}</div>
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground">
        {data.integrationType || "CRM"} - {data.action || "lookup"}
      </div>
      
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="handle-standard"
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="handle-standard"
      />
    </div>
  );
});

// Transfer Node
const TransferNode = memo(({ data, isConnectable, selected }: any) => {
  return (
    <div className={cn(
      "px-4 py-2 rounded-lg border bg-background min-w-40",
      selected ? "border-primary shadow-md" : "border-accent",
      "transfer-node"
    )}>
      <div className="flex items-center gap-2">
        <PhoneForwarded className="h-4 w-4 text-orange-500" />
        <div>{data.label}</div>
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground">
        Transfer to: {data.transferType || "agent"} {data.destination ? `- ${data.destination}` : ""}
      </div>
      
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="handle-standard"
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="handle-standard"
      />
    </div>
  );
});

export const nodeTypes = {
  startNode: StartNode,
  endNode: EndNode,
  decisionNode: DecisionNode,
  messageNode: MessageNode,
  inputNode: InputNode,
  integrationNode: IntegrationNode,
  transferNode: TransferNode,
};
