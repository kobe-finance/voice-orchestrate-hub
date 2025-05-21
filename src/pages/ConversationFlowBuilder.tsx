
import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  OnConnect,
  Edge,
  Node,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { initialNodes, initialEdges } from '@/components/flow-builder/initial-elements';
import { nodeTypes } from '@/components/flow-builder/node-types';
import { NodePalette } from '@/components/flow-builder/NodePalette';
import { PropertyPanel } from '@/components/flow-builder/PropertyPanel';
import { FlowHeader } from '@/components/flow-builder/FlowHeader';
import { Button } from '@/components/ui/button';
import { Book, Settings } from 'lucide-react';
import { toast } from 'sonner';

const ConversationFlowBuilder = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  // Selection state
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  
  // Flow metadata
  const [flowName, setFlowName] = useState('New Conversation Flow');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Handle connections between nodes
  const onConnect: OnConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
    setUnsavedChanges(true);
  }, [setEdges]);

  // Handle node drag
  const onNodeDragStop = useCallback(() => {
    setUnsavedChanges(true);
  }, []);

  // Handle selection changes
  const onSelectionChange = useCallback(({ nodes, edges }) => {
    if (nodes.length > 0) {
      setSelectedNode(nodes[0]);
      setSelectedEdge(null);
    } else if (edges.length > 0) {
      setSelectedEdge(edges[0]);
      setSelectedNode(null);
    } else {
      setSelectedNode(null);
      setSelectedEdge(null);
    }
  }, []);

  // Clear selection when clicking on the canvas
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  // Update node data when editing properties
  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
    setUnsavedChanges(true);
  }, [setNodes]);

  // Handle drag over for node palette items
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop from node palette
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/reactflow/label');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${type}_${nodes.length + 1}`,
        type,
        position,
        data: { label, value: '' },
      };

      setNodes((nds) => nds.concat(newNode));
      setUnsavedChanges(true);
    },
    [reactFlowInstance, nodes, setNodes]
  );

  // Handle saving the flow
  const handleSaveFlow = useCallback(() => {
    // Simulate saving the flow
    setTimeout(() => {
      toast.success('Flow saved successfully');
      setUnsavedChanges(false);
    }, 500);
  }, []);

  // Navigate back to dashboard
  const handleBack = useCallback(() => {
    if (unsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  }, [navigate, unsavedChanges]);

  // Add an onNodeAdd handler for the NodePalette
  const onNodeAdd = useCallback((nodeType: string) => {
    const position = {
      x: Math.random() * 300,
      y: Math.random() * 300,
    };

    const newNode = {
      id: `${nodeType}_${nodes.length + 1}`,
      type: nodeType,
      position,
      data: { label: `New ${nodeType}`, value: '' },
    };

    setNodes((nds) => nds.concat(newNode));
    setUnsavedChanges(true);
  }, [nodes, setNodes]);

  return (
    <div className="h-screen flex flex-col">
      <FlowHeader 
        flowName={flowName} 
        setFlowName={setFlowName} 
        onSave={handleSaveFlow} 
        unsavedChanges={unsavedChanges} 
        onBack={handleBack} 
      />
      
      <div className="flex-1 flex">
        <div className="w-60 p-4 border-r overflow-y-auto bg-background">
          <NodePalette onAddNode={onNodeAdd} />

          <div className="mt-6 space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/document-management')}
            >
              <Book className="mr-2 h-4 w-4" />
              Knowledge Base
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/rag-configuration')}
            >
              <Settings className="mr-2 h-4 w-4" />
              RAG Configuration
            </Button>
          </div>
        </div>
        
        <div className="flex-1 h-full" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeDragStop={onNodeDragStop}
              onSelectionChange={onSelectionChange}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              fitView
              deleteKeyCode={['Backspace', 'Delete']}
            >
              <Controls />
              <MiniMap />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
        
        {(selectedNode || selectedEdge) && (
          <div className="w-72 p-4 border-l overflow-y-auto bg-background">
            <PropertyPanel
              selectedNode={selectedNode}
              selectedEdge={selectedEdge}
              onChange={updateNodeData}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationFlowBuilder;
