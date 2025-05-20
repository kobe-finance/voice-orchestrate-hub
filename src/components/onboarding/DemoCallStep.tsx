
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";

type DemoCallProps = {
  onUpdate: (data: any) => void;
  initialData: any;
  businessData: any;
  voiceAgentData: any;
};

const DemoCallStep = ({ onUpdate, initialData, businessData, voiceAgentData }: DemoCallProps) => {
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'completed'>('idle');
  const [callProgress, setCallProgress] = useState(0);
  const [transcript, setTranscript] = useState<Array<{speaker: string; text: string}>>([]);
  const [showTips, setShowTips] = useState(true);

  // Demo transcript - this would normally be generated dynamically
  const demoScript = [
    { speaker: "Agent", text: `Hello, this is ${voiceAgentData?.agentName || 'Alex'} from ${businessData?.businessName || 'VoiceOrchestrate'}. How may I assist you today?` },
    { speaker: "Caller", text: "Hi, I'm interested in learning more about your services." },
    { speaker: "Agent", text: "I'd be happy to tell you about our services. We specialize in [services based on industry]. Would you like me to go into more detail about any specific service?" },
    { speaker: "Caller", text: "Yes, can you tell me about your pricing?" },
    { speaker: "Agent", text: "Our pricing is structured based on your specific needs. We offer several tiers starting at $99 per month. Would you like me to schedule a detailed consultation with one of our specialists?" },
    { speaker: "Caller", text: "That would be helpful, yes." },
    { speaker: "Agent", text: "Great! I can schedule that for you. What date and time works best for you?" },
    { speaker: "Caller", text: "How about next Tuesday at 2pm?" },
    { speaker: "Agent", text: "Tuesday at 2pm works perfectly. May I have your name and email address to send a confirmation?" },
    { speaker: "Caller", text: "My name is Sam Johnson and my email is sam@example.com" },
    { speaker: "Agent", text: "Thank you, Sam. I've scheduled a consultation for next Tuesday at 2pm. You'll receive a confirmation email shortly. Is there anything else I can help you with today?" },
    { speaker: "Caller", text: "No, that's all for now. Thank you!" },
    { speaker: "Agent", text: "You're welcome! Thank you for your interest in our services. We look forward to speaking with you on Tuesday. Have a great day!" },
  ];

  // Simulate a demo call
  const startDemoCall = () => {
    setCallStatus('connecting');
    setTranscript([]);
    setCallProgress(0);
    
    // Simulate connection delay
    setTimeout(() => {
      setCallStatus('connected');
      playDemoScript();
    }, 2000);
    
    // Update parent with call initiated status
    onUpdate({ 
      demoCompleted: false,
      callInitiated: true,
      timestamp: new Date().toISOString(),
      ...initialData 
    });
  };

  // Play through the demo script
  const playDemoScript = () => {
    let currentIndex = 0;
    const totalMessages = demoScript.length;
    
    const scriptInterval = setInterval(() => {
      if (currentIndex < totalMessages) {
        // Add next message to transcript
        setTranscript(prev => [...prev, demoScript[currentIndex]]);
        
        // Update progress
        const progress = ((currentIndex + 1) / totalMessages) * 100;
        setCallProgress(progress);
        
        currentIndex++;
      } else {
        // End of script
        clearInterval(scriptInterval);
        setCallStatus('completed');
        
        // Update parent with demo completed status
        onUpdate({ 
          demoCompleted: true,
          callInitiated: true,
          timestamp: new Date().toISOString(),
          ...initialData 
        });
        
        toast.success("Demo call completed!");
      }
    }, 2000); // Add a new message every 2 seconds
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Experience Your Voice Agent</h2>
        <p className="text-muted-foreground">
          Try a simulated call with your configured AI voice agent
        </p>
      </div>

      {showTips && (
        <Card className="bg-secondary/30 mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium mb-2">Demo Call Tips</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>This is a simulated conversation to show how your agent will sound</li>
                  <li>The demo uses your business profile and voice agent settings</li>
                  <li>In a real deployment, callers can interact naturally with your agent</li>
                  <li>Your agent can handle interruptions, questions, and transfer to humans when needed</li>
                </ul>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowTips(false)}
              >
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-2 border-dashed">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center">
            {callStatus === 'idle' && (
              <div className="text-center space-y-4 py-12">
                <div className="text-5xl mb-4">📞</div>
                <h3 className="text-xl font-medium">Ready for Your Demo Call</h3>
                <p className="text-muted-foreground max-w-md">
                  Experience how your AI voice agent will interact with real callers
                </p>
                <Button 
                  size="lg" 
                  onClick={startDemoCall}
                  className="mt-4"
                >
                  Start Demo Call
                </Button>
              </div>
            )}

            {callStatus === 'connecting' && (
              <div className="text-center space-y-4 py-12">
                <div className="animate-pulse text-5xl mb-4">📞</div>
                <h3 className="text-xl font-medium">Connecting...</h3>
                <p className="text-muted-foreground">
                  Setting up your demo call experience
                </p>
              </div>
            )}

            {(callStatus === 'connected' || callStatus === 'completed') && (
              <div className="w-full space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Demo Call</h3>
                    <p className="text-sm text-muted-foreground">
                      {callStatus === 'completed' ? 'Call completed' : 'Call in progress...'}
                    </p>
                  </div>
                  {callStatus === 'connected' && (
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></span>
                      <span className="text-sm">Live</span>
                    </div>
                  )}
                </div>

                <Progress value={callProgress} className="h-1" />

                <div className="border rounded-md h-80 overflow-y-auto p-4 bg-background">
                  <div className="space-y-4">
                    {transcript.map((entry, index) => (
                      <div 
                        key={index} 
                        className={`flex ${entry.speaker === 'Agent' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            entry.speaker === 'Agent' 
                              ? 'bg-muted text-foreground' 
                              : 'bg-primary text-primary-foreground'
                          }`}
                        >
                          <div className="text-xs font-medium mb-1">
                            {entry.speaker === 'Agent' 
                              ? (voiceAgentData?.agentName || 'AI Assistant') 
                              : 'You'}
                          </div>
                          <div>{entry.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {callStatus === 'completed' && (
                  <div className="flex justify-center">
                    <Button onClick={startDemoCall}>
                      Replay Demo
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoCallStep;
