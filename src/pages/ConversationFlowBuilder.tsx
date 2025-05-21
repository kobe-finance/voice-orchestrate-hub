
import React, { useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  MarkerType,
  BackgroundVariant,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Save, Mic } from "lucide-react";
import { NodePalette } from "@/components/flow-builder/NodePalette";
import { PropertyPanel } from "@/components/flow-builder/PropertyPanel";
import { FlowHeader } from "@/components/flow-builder/FlowHeader";
import { initialNodes, initialEdges } from "@/components/flow-builder/initial-elements";
import { nodeTypes } from "@/components/flow-builder/node-types";

import "@xyflow/react/dist/style.css";
import "../components/flow-builder/flow-editor.css";

// Define node data types to fix TypeScript errors
interface NodeData {
  label: string;
  message?: string;
  voiceType?: string;
  speakingRate?: number;
  question?: string;
  inputType?: string;
  conditions?: string[];
  transferType?: string;
  destination?: string;
  integrationType?: string;
  action?: string;
  configuration?: string;
  description?: string;
  options?: string[];
  [key: string]: any; // Allow for additional properties
}

// Define types for the flow nodes and edges
type FlowNode = Node<NodeData>;
type FlowEdge = Edge;

const ConversationFlowBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(initialNodes as FlowNode[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>(initialEdges as FlowEdge[]);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [flowName, setFlowName] = useState(id ? `Flow ${id}` : "New Flow");

  // Auto-save timer
  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: FlowNode) => {
    setSelectedNode(node);
  }, []);

  // Handle node deselection when clicking on the canvas
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle connections between nodes
  const onConnect = useCallback((params: Connection) => {
    // Create edge with animated style for conditional edges
    const edge = {
      ...params,
      type: 'default',
      animated: params.sourceHandle === 'condition',
      style: { stroke: params.sourceHandle === 'condition' ? '#F97316' : '#2563EB' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    };
    
    setEdges((eds) => addEdge(edge, eds) as FlowEdge[]);
    setUnsavedChanges(true);
    
    // Set up auto-save
    if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    autoSaveTimeout.current = setTimeout(handleAutoSave, 30000); // 30 seconds
  }, []);
  
  // Handle auto-save
  const handleAutoSave = useCallback(() => {
    if (unsavedChanges) {
      console.log("Auto-saving flow...", { nodes, edges });
      toast.info("Flow auto-saved", {
        description: "Your changes have been automatically saved"
      });
      setUnsavedChanges(false);
    }
  }, [nodes, edges, unsavedChanges]);

  // Add node from palette to canvas
  const onAddNode = useCallback((nodeType: string) => {
    const newNodeId = `node_${Date.now()}`;
    const position = { 
      x: Math.random() * 300 + 50, 
      y: Math.random() * 300 + 50 
    };
    
    let newNode: FlowNode = {
      id: newNodeId,
      position,
      data: { label: `New ${nodeType}` },
      type: 'default'
    };
    
    // Set specific properties based on node type
    switch (nodeType) {
      case "startNode":
        newNode.type = "startNode";
        newNode.data.label = "Start";
        break;
      case "endNode":
        newNode.type = "endNode";
        newNode.data.label = "End";
        break;
      case "decisionNode":
        newNode.type = "decisionNode";
        newNode.data.label = "Decision";
        newNode.data.conditions = ["Yes", "No"];
        break;
      case "messageNode":
        newNode.type = "messageNode";
        newNode.data.label = "Message";
        newNode.data.message = "Enter your message here";
        break;
      case "inputNode":
        newNode.type = "inputNode";
        newNode.data.label = "Input";
        newNode.data.inputType = "text";
        newNode.data.question = "Enter your question";
        break;
      case "integrationNode":
        newNode.type = "integrationNode";
        newNode.data.label = "Integration";
        newNode.data.integrationType = "CRM";
        break;
      case "transferNode":
        newNode.type = "transferNode";
        newNode.data.label = "Transfer";
        newNode.data.transferType = "agent";
        break;
      default:
        newNode.type = "default";
    }
    
    setNodes((nds) => [...nds, newNode]);
    setUnsavedChanges(true);
  }, [setNodes]);

  // Handle save
  const handleSave = useCallback(() => {
    console.log("Saving flow...", { id, flowName, nodes, edges });
    
    // In a real app, this would be an API call
    toast.success("Flow saved successfully", {
      description: "All your changes have been saved"
    });
    
    setUnsavedChanges(false);
  }, [id, flowName, nodes, edges]);

  // Handle node update from property panel
  const handleNodeUpdate = useCallback((nodeData: Partial<NodeData>) => {
    if (!selectedNode) return;
    
    setNodes((nds) => 
      nds.map((node) => (node.id === selectedNode.id 
        ? { ...node, data: { ...node.data, ...nodeData } }
        : node
      ))
    );
    setUnsavedChanges(true);
  }, [selectedNode, setNodes]);

  return (
    <div className="flex flex-col h-screen">
      <FlowHeader 
        flowName={flowName} 
        setFlowName={setFlowName} 
        onSave={handleSave} 
        unsavedChanges={unsavedChanges} 
        onBack={() => navigate("/voice-agents")} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-card border-r p-4 overflow-y-auto">
          <NodePalette onAddNode={onAddNode} />
        </div>
        
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
            <Controls />
            <MiniMap 
              nodeStrokeWidth={3}
              zoomable 
              pannable 
            />
            <Panel position="top-right" className="bg-background p-3 rounded-lg shadow-md border">
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    const backup = [...nodes];
                    setNodes(nds => nds.filter(n => !('selected' in n && n.selected)));
                    toast.info("Nodes deleted", {
                      description: "Selected nodes have been removed",
                      action: {
                        label: "Undo",
                        onClick: () => setNodes(backup)
                      }
                    });
                  }}
                >
                  Delete Selected
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/voice-selection")}
                >
                  <Mic className="mr-2 h-4 w-4" /> Voice Settings
                </Button>
              </div>
            </Panel>
          </ReactFlow>
        </div>
        
        {selectedNode && (
          <div className="w-72 bg-card border-l p-4 overflow-y-auto">
            <PropertyPanel 
              selectedNode={selectedNode} 
              onChange={handleNodeUpdate} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationFlowBuilder;
