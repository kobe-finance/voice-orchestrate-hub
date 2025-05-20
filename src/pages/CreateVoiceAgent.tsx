
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import VoiceAgentConfigStep from "@/components/onboarding/VoiceAgentConfigStep";
import { ArrowLeft, Save } from "lucide-react";

const CreateVoiceAgent = () => {
  const navigate = useNavigate();
  const [agentConfig, setAgentConfig] = useState({});
  const [isDraft, setIsDraft] = useState(false);

  const handleUpdate = (data: any) => {
    setAgentConfig(data);
  };

  const handleSave = (asDraft: boolean = false) => {
    setIsDraft(asDraft);
    
    // In a real app, this would be an API call
    console.log("Saving agent configuration:", agentConfig);
    
    toast.success(
      asDraft ? "Agent saved as draft" : "Agent created successfully",
      {
        description: asDraft 
          ? "You can continue editing this agent later" 
          : "Your voice agent is now ready to use"
      }
    );
    
    navigate("/voice-agents");
  };

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate("/voice-agents")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Voice Agent</h1>
          <p className="text-muted-foreground">Configure your new AI voice agent</p>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <VoiceAgentConfigStep
          onUpdate={handleUpdate}
          initialData={{}}
        />

        <div className="mt-8 flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={() => handleSave(true)}
          >
            Save as Draft
          </Button>
          <Button 
            onClick={() => handleSave(false)}
          >
            <Save className="mr-2 h-4 w-4" /> Create Agent
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateVoiceAgent;
