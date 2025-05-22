
import React, { useState, useEffect } from "react";
import { X, Mic } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VoiceWaveform from "@/components/voice/VoiceWaveform";

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);

  // Request microphone permission
  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMicPermission(true);
      setIsListening(true);
      // In a real implementation, we would do something with the stream
      // For demo purposes, we'll just track that we have permission
      return stream;
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setHasMicPermission(false);
      return null;
    }
  };

  // Handle start conversation
  const handleStartConversation = async () => {
    const stream = await requestMicPermission();
    if (stream) {
      // Simulate AI responses in transcript
      setTimeout(() => {
        setTranscript(prev => [...prev, "AI: Hello! How can I assist you today?"]);
      }, 1000);
    }
  };

  // Handle end conversation
  const handleEndConversation = () => {
    setIsListening(false);
    setTranscript(prev => [...prev, "AI: Thank you for the conversation. Goodbye!"]);
  };

  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  // Timer effect
  useEffect(() => {
    let timerId: number | undefined;
    
    if (isListening) {
      timerId = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isListening]);

  // Auto-request mic permission when modal opens
  useEffect(() => {
    if (isOpen && hasMicPermission === null) {
      handleStartConversation();
    }
    
    // Reset state when modal closes
    if (!isOpen) {
      setIsListening(false);
      setElapsedTime(0);
      setTranscript([]);
    }
  }, [isOpen]);

  // Add simulated user speech to transcript
  useEffect(() => {
    if (isListening) {
      const phrases = [
        "User: Hi there, I need some information about your service.",
        "User: Can you tell me about your pricing plans?",
        "User: How does your voice AI technology work?",
        "User: That sounds interesting. What about data privacy?"
      ];
      
      let index = 0;
      const addUserSpeech = () => {
        if (index < phrases.length && isListening) {
          setTranscript(prev => [...prev, phrases[index]]);
          index++;
          setTimeout(addUserSpeech, Math.random() * 5000 + 3000);
        }
      };
      
      setTimeout(addUserSpeech, 3000);
    }
  }, [isListening]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md shadow-lg rounded-xl overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isListening ? (
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                <span className="font-medium">Talking...</span>
              </div>
            ) : (
              <span className="font-medium">Voice Assistant</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono">{formatTime(elapsedTime)}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="px-4 py-6 flex flex-col items-center">
          <div className="w-full h-20 mb-4">
            {isListening ? (
              <VoiceWaveform voiceId="default" isActive={true} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Mic className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="w-full bg-muted p-4 rounded-md h-64 overflow-y-auto mb-4">
            {transcript.length > 0 ? (
              transcript.map((line, idx) => (
                <p key={idx} className={`mb-2 ${line.startsWith('AI:') ? 'text-primary' : ''}`}>
                  {line}
                </p>
              ))
            ) : (
              <p className="text-center text-muted-foreground p-4">
                Speak to start the conversation...
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            {isListening ? (
              <Button variant="destructive" onClick={handleEndConversation}>
                End Conversation
              </Button>
            ) : (
              <Button onClick={handleStartConversation}>
                <Mic className="mr-2 h-4 w-4" /> Start Talking
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
