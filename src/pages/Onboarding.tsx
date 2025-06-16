
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  // Ensure React is properly loaded before using hooks
  if (!React || typeof React.useState !== 'function') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p>Initializing onboarding...</p>
        </div>
      </div>
    );
  }

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [welcomeVideoOpen, setWelcomeVideoOpen] = useState(true);
  const [isReactReady, setIsReactReady] = useState(false);
  const [formData, setFormData] = useState({
    businessProfile: {},
    voiceAgentConfig: {},
    integrations: {},
    demoCall: {},
  });

  // Ensure React is fully ready before rendering complex components
  React.useEffect(() => {
    const checkReactReady = () => {
      if (React && 
          typeof React.useState === 'function' && 
          typeof React.useEffect === 'function' &&
          typeof React.useMemo === 'function' &&
          typeof React.useRef === 'function') {
        setIsReactReady(true);
        console.log('Onboarding: React is fully ready');
      } else {
        console.log('Onboarding: React not ready yet, retrying...');
        setTimeout(checkReactReady, 100);
      }
    };
    
    checkReactReady();
  }, []);

  // Show loading state until React is fully ready
  if (!isReactReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p>Initializing onboarding interface...</p>
        </div>
      </div>
    );
  }

  const progress = (currentStep / (OnboardingSteps.length - 1)) * 100;

  const handleNext = () => {
    if (currentStep < OnboardingSteps.length - 1) {
      // Save progress
      toast.success("Progress saved!");
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      toast.success("Onboarding completed! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 1500);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    toast.info("You can always complete this step later from the dashboard.");
    handleNext();
  };

  const handleExit = () => {
    // Save progress before exiting
    toast.info("Progress saved. You can continue onboarding later.");
    navigate("/dashboard");
  };

  const updateFormData = (step: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: data
    }));
  };

  const renderStepContent = () => {
    switch (OnboardingSteps[currentStep].id) {
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
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <div className="font-semibold text-lg">VoiceOrchestrate™</div>
        <Button variant="outline" onClick={handleExit}>
          Exit Setup
        </Button>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">
                Step {currentStep + 1} of {OnboardingSteps.length}: {OnboardingSteps[currentStep].title}
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
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <div className="space-x-2">
              {currentStep > 0 && currentStep < OnboardingSteps.length - 1 && (
                <Button variant="ghost" onClick={handleSkip}>
                  Skip for now
                </Button>
              )}
              <Button onClick={handleNext}>
                {currentStep === OnboardingSteps.length - 1 ? "Complete Setup" : "Continue"}
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
            {/* Replace with actual video player */}
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
            <h3 className="font-medium">About {OnboardingSteps[currentStep].title}</h3>
            <p>
              {OnboardingSteps[currentStep].description}
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
