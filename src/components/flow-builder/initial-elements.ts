
import { MarkerType } from "@xyflow/react";

export const initialNodes = [
  {
    id: "start",
    type: "startNode",
    data: { label: "Start" },
    position: { x: 250, y: 50 },
  },
  {
    id: "message1",
    type: "messageNode",
    data: { 
      label: "Welcome Message",
      message: "Hello! Thank you for calling. How can I help you today?",
      voiceType: "female_friendly",
      speakingRate: 1
    },
    position: { x: 250, y: 150 },
  },
  {
    id: "input1",
    type: "inputNode",
    data: { 
      label: "Collect Input",
      question: "What is the reason for your call?",
      inputType: "text"
    },
    position: { x: 250, y: 250 },
  },
  {
    id: "decision1",
    type: "decisionNode",
    data: { 
      label: "Route Call", 
      question: "What type of issue is this?",
      conditions: ["Support", "Sales", "Billing"]
    },
    position: { x: 250, y: 350 },
  },
  {
    id: "transfer1",
    type: "transferNode",
    data: { 
      label: "Transfer to Support",
      transferType: "department",
      destination: "Technical Support",
      message: "I'll transfer you to our technical support team now."
    },
    position: { x: 100, y: 450 },
  },
  {
    id: "transfer2",
    type: "transferNode",
    data: { 
      label: "Transfer to Sales",
      transferType: "department",
      destination: "Sales Team",
      message: "I'll transfer you to our sales team now."
    },
    position: { x: 250, y: 450 },
  },
  {
    id: "integration1",
    type: "integrationNode",
    data: { 
      label: "Billing Lookup",
      integrationType: "CRM",
      action: "lookup",
      configuration: "Look up billing information in CRM"
    },
    position: { x: 400, y: 450 },
  },
  {
    id: "end",
    type: "endNode",
    data: { label: "End Call" },
    position: { x: 250, y: 550 },
  },
];

export const initialEdges = [
  {
    id: "e-start-message",
    source: "start",
    target: "message1",
    type: "default",
    animated: false,
  },
  {
    id: "e-message-input",
    source: "message1",
    target: "input1",
    type: "default",
    animated: false,
  },
  {
    id: "e-input-decision",
    source: "input1",
    target: "decision1",
    type: "default",
    animated: false,
  },
  {
    id: "e-decision-transfer1",
    source: "decision1",
    target: "transfer1",
    sourceHandle: "condition-0",
    type: "default",
    animated: true,
    style: { stroke: "#F97316" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "e-decision-transfer2",
    source: "decision1",
    target: "transfer2",
    sourceHandle: "condition-1",
    type: "default",
    animated: true,
    style: { stroke: "#F97316" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "e-decision-integration",
    source: "decision1",
    target: "integration1",
    sourceHandle: "condition-2",
    type: "default",
    animated: true,
    style: { stroke: "#F97316" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "e-transfer1-end",
    source: "transfer1",
    target: "end",
    type: "default",
    animated: false,
  },
  {
    id: "e-transfer2-end",
    source: "transfer2",
    target: "end",
    type: "default",
    animated: false,
  },
  {
    id: "e-integration-end",
    source: "integration1",
    target: "end",
    type: "default",
    animated: false,
  },
];
