
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import VoiceAgentConfigStep from "@/components/onboarding/VoiceAgentConfigStep";
import { ArrowLeft, Save } from "lucide-react";

// Sample data - in a real app, this would come from an API
const SAMPLE_AGENTS = [
  { 
    id: "1", 
    name: "Customer Service Agent", 
    description: "Handles general customer inquiries and support requests",
    voiceType: "female_professional", 
    status: "active", 
    lastModified: "2025-05-19T15:30:00Z",
    greeting: "Hello, this is the Customer Service AI Assistant. How may I help you today?",
    primaryPurpose: "customer_service",
    speakingRate: 1,
    advancedSettings: {
      interruptionHandling: "pause",
      transferProtocol: "ask_first",
      fallbackBehavior: "human_transfer"
    }
  },
  { 
    id: "2", 
    name: "Appointment Scheduler", 
    description: "Specializes in booking and managing appointments",
    voiceType: "male_friendly", 
    status: "active", 
    lastModified: "2025-05-17T10:15:00Z",
    greeting: "Hi there, I'm your appointment scheduling assistant. Would you like to book, modify, or cancel an appointment?",
    primaryPurpose: "appointment_booking",
    speakingRate: 1.1,
    advancedSettings: {
      interruptionHandling: "finish",
      transferProtocol: "announce_only",
      fallbackBehavior: "callback"
    }
  },
];

const EditVoiceAgent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [agentConfig, setAgentConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchAgentData = () => {
      setIsLoading(true);
      const agent = SAMPLE_AGENTS.find(agent => agent.id === id);
      
      if (agent) {
        setAgentConfig(agent);
      } else {
        toast.error("Agent not found", {
          description: "The agent you're trying to edit doesn't exist"
        });
        navigate("/voice-agents");
      }
      
      setIsLoading(false);
    };
    
    fetchAgentData();
  }, [id, navigate]);

  const handleUpdate = (data: any) => {
    setAgentConfig(prev => ({
      ...prev,
      ...data
    }));
  };

  const handleSave = () => {
    // In a real app, this would be an API call
    console.log("Updating agent configuration:", agentConfig);
    
    toast.success("Agent updated successfully", {
      description: "Your changes have been saved"
    });
    
    navigate("/voice-agents");
  };

  if (isLoading || !agentConfig) {
    return (
      <div className="container mx-auto py-6 max-w-3xl">
        <div className="flex items-center justify-center h-64">
          <p>Loading agent configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon-sm" 
          className="mr-2"
          onClick={() => navigate("/voice-agents")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Voice Agent</h1>
          <p className="text-muted-foreground">{agentConfig.name}</p>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <VoiceAgentConfigStep
          onUpdate={handleUpdate}
          initialData={agentConfig}
        />

        <div className="mt-8 flex justify-end gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/voice-agents")}
          >
            Cancel
          </Button>
          <Button 
            size="sm"
            onClick={handleSave}
          >
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditVoiceAgent;
