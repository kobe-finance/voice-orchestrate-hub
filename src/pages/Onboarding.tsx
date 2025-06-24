import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useOnboarding } from "@/hooks/useOnboarding";
import BusinessProfileStep from "@/components/onboarding/BusinessProfileStep";
import VoiceAgentConfigStep from "@/components/onboarding/VoiceAgentConfigStep";
import IntegrationSetupStep from "@/components/onboarding/IntegrationSetupStep";
import DemoCallStep from "@/components/onboarding/DemoCallStep";

const OnboardingSteps = [
  {
    id: "welcome",
    title: "Welcome to VoiceOrchestrate™",
    description: "Let's get started with setting up your AI voice agents",
  },
  {
    id: "business-profile",
    title: "Business Profile",
    description: "Tell us about your business",
  },
  {
    id: "voice-agent-config",
    title: "Voice Agent Configuration",
    description: "Set up your AI voice assistant",
  },
  {
    id: "integration-setup",
    title: "Integrations",
    description: "Connect your existing systems",
  },
  {
    id: "demo-call",
    title: "Demo Call",
    description: "Experience your voice agent in action",
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    onboardingStatus, 
    isLoading,
    skipToStep, 
    completeStep,
    saveBusinessProfile,
    saveVoiceConfig,
    saveIntegrations,
    saveDemoCall,
    businessProfile,
    voiceConfig,
    integrations,
    demoCall
  } = useOnboarding();
  
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [welcomeVideoOpen, setWelcomeVideoOpen] = useState(true);
  const [formData, setFormData] = useState({
    businessProfile: {},
    voiceAgentConfig: {},
    integrations: {},
    demoCall: {},
  });

  // Get current step index based on onboarding status
  const getCurrentStepIndex = () => {
    if (!onboardingStatus) return 0;
    const currentStepId = onboardingStatus.currentStep;
    return OnboardingSteps.findIndex(step => step.id === currentStepId);
  };

  const currentStepIndex = getCurrentStepIndex();
  const progress = (currentStepIndex / (OnboardingSteps.length - 1)) * 100;

  // Load existing data into form
  useEffect(() => {
    if (businessProfile) {
      setFormData(prev => ({ ...prev, businessProfile }));
    }
    if (voiceConfig) {
      setFormData(prev => ({ ...prev, voiceAgentConfig: voiceConfig }));
    }
    if (integrations) {
      setFormData(prev => ({ ...prev, integrations }));
    }
    if (demoCall) {
      setFormData(prev => ({ ...prev, demoCall }));
    }
  }, [businessProfile, voiceConfig, integrations, demoCall]);

  const handleNext = async () => {
    try {
      const currentStep = OnboardingSteps[currentStepIndex];
      
      // Save current step data before moving to next
      await saveCurrentStepData(currentStep.id);
      
      if (currentStepIndex < OnboardingSteps.length - 1) {
        const nextStep = OnboardingSteps[currentStepIndex + 1];
        await completeStep(currentStep.id);
        await skipToStep(nextStep.id);
        toast({
          title: "Progress saved!",
        });
      } else {
        // Complete the final step and onboarding
        await completeStep(currentStep.id);
        toast({
          title: "Onboarding completed!",
        });
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (error) {
      console.error('Error progressing onboarding:', error);
      toast({
        title: "Error saving progress",
        variant: "destructive"
      });
    }
  };

  const handleBack = async () => {
    if (currentStepIndex > 0) {
      const prevStep = OnboardingSteps[currentStepIndex - 1];
      await skipToStep(prevStep.id);
    }
  };

  const handleSkip = async () => {
    try {
      if (currentStepIndex < OnboardingSteps.length - 1) {
        const nextStep = OnboardingSteps[currentStepIndex + 1];
        await skipToStep(nextStep.id);
        toast({
          title: "Step skipped",
        });
      } else {
        // Skip final step - complete onboarding
        const currentStep = OnboardingSteps[currentStepIndex];
        await completeStep(currentStep.id);
        toast({
          title: "Onboarding completed!",
        });
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (error) {
      console.error('Error skipping step:', error);
      toast({
        title: "Error skipping step",
        variant: "destructive"
      });
    }
  };

  const saveCurrentStepData = async (stepId: string) => {
    try {
      switch (stepId) {
        case 'business-profile':
          if (Object.keys(formData.businessProfile).length > 0) {
            await saveBusinessProfile(formData.businessProfile as any);
          }
          break;
        case 'voice-agent-config':
          if (Object.keys(formData.voiceAgentConfig).length > 0) {
            await saveVoiceConfig(formData.voiceAgentConfig as any);
          }
          break;
        case 'integration-setup':
          if (Object.keys(formData.integrations).length > 0) {
            await saveIntegrations(formData.integrations as any);
          }
          break;
        case 'demo-call':
          if (Object.keys(formData.demoCall).length > 0) {
            await saveDemoCall(formData.demoCall as any);
          }
          break;
      }
    } catch (error) {
      console.error(`Error saving ${stepId} data:`, error);
    }
  };

  const handleExit = () => {
    toast({
      title: "Progress saved",
    });
    navigate("/dashboard");
  };

  const updateFormData = (step: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: data
    }));
  };

  const renderStepContent = () => {
    const currentStep = OnboardingSteps[currentStepIndex];
    
    switch (currentStep?.id) {
      case "welcome":
        return (
          <div className="text-center space-y-6 py-8">
            <h1 className="text-3xl font-bold text-primary">Welcome to VoiceOrchestrate™</h1>
            <p className="text-lg max-w-md mx-auto">
              Your AI voice automation journey begins here. Let's set up your account in a few simple steps.
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={() => setWelcomeVideoOpen(true)}
                className="flex items-center gap-2"
              >
                Watch Introduction Video
              </Button>
            </div>
          </div>
        );
      case "business-profile":
        return (
          <BusinessProfileStep 
            onUpdate={(data) => updateFormData("businessProfile", data)}
            initialData={formData.businessProfile}
          />
        );
      case "voice-agent-config":
        return (
          <VoiceAgentConfigStep 
            onUpdate={(data) => updateFormData("voiceAgentConfig", data)}
            initialData={formData.voiceAgentConfig}
          />
        );
      case "integration-setup":
        return (
          <IntegrationSetupStep 
            onUpdate={(data) => updateFormData("integrations", data)}
            initialData={formData.integrations}
          />
        );
      case "demo-call":
        return (
          <DemoCallStep 
            onUpdate={(data) => updateFormData("demoCall", data)}
            initialData={formData.demoCall}
            businessData={formData.businessProfile}
            voiceAgentData={formData.voiceAgentConfig}
          />
        );
      default:
        return <div>Loading...</div>;
    }
  };

  if (isLoading || !onboardingStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading onboarding...</p>
        </div>
      </div>
    );
  }

  const currentStep = OnboardingSteps[currentStepIndex];

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">
                Step {currentStepIndex + 1} of {OnboardingSteps.length}: {currentStep?.title}
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setHelpDialogOpen(true)}
              >
                Need Help?
              </Button>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="p-6 shadow-lg animate-fade-in">
            {renderStepContent()}
          </Card>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStepIndex === 0}
            >
              Back
            </Button>
            <div className="space-x-2">
              {currentStepIndex > 0 && currentStepIndex < OnboardingSteps.length - 1 && (
                <Button variant="ghost" onClick={handleSkip}>
                  Skip for now
                </Button>
              )}
              <Button onClick={handleNext}>
                {currentStepIndex === OnboardingSteps.length - 1 ? "Complete Setup" : "Continue"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Video Dialog */}
      <Dialog open={welcomeVideoOpen} onOpenChange={setWelcomeVideoOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Introduction to VoiceOrchestrate™</DialogTitle>
            <DialogDescription>
              Learn how to get the most out of your voice automation platform
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-muted flex items-center justify-center">
            <div className="text-center p-8">
              <p>Welcome video would play here</p>
              <p className="text-sm text-muted-foreground mt-2">
                (Video player implementation would be integrated here)
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help Dialog */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Need Help?</DialogTitle>
            <DialogDescription>
              Here's some guidance for this step of the setup process.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <h3 className="font-medium">About {currentStep?.title}</h3>
            <p>
              {currentStep?.description}
            </p>
            <p>
              If you need additional assistance, please contact our support team:
            </p>
            <p className="text-primary">support@voiceorchestrate.com</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Onboarding;
