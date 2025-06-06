
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import VoiceAgentConfigStep from "@/components/onboarding/VoiceAgentConfigStep";
import { ArrowLeft, Save, Sparkles } from "lucide-react";

const CreateVoiceAgent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [agentConfig, setAgentConfig] = useState({});
  const [isDraft, setIsDraft] = useState(false);

  // Get template data from navigation state
  const template = location.state?.template;

  useEffect(() => {
    if (template) {
      // Pre-fill the form with template data
      const templateConfig = {
        agentName: template.name,
        voiceType: template.voiceType,
        primaryPurpose: template.primaryPurpose,
        greeting: template.greeting,
        speakingRate: 1,
        advancedSettings: {
          interruptionHandling: "pause",
          transferProtocol: "ask_first",
          fallbackBehavior: "human_transfer"
        },
        // Store the full template for reference
        _templateData: template
      };
      setAgentConfig(templateConfig);
    }
  }, [template]);

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
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {template ? `Create Agent from Template` : 'Create Voice Agent'}
          </h1>
          <p className="text-muted-foreground">
            {template 
              ? `Using template: ${template.name}` 
              : 'Configure your new AI voice agent'
            }
          </p>
        </div>
        {!template && (
          <Button 
            variant="outline" 
            onClick={() => navigate("/agent-template-gallery")}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Use Template
          </Button>
        )}
      </div>

      {template && (
        <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-3">
            <template.icon className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium text-primary">Template: {template.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
              <div className="flex gap-2 mt-2">
                {template.tags.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border rounded-lg p-6 bg-card">
        <VoiceAgentConfigStep
          onUpdate={handleUpdate}
          initialData={agentConfig}
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
