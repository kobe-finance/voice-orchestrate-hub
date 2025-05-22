
import React, { useState, useEffect } from "react";
import { X, Mic, AudioWaveform } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoiceWaveform from "@/components/voice/VoiceWaveform";
import { cn } from "@/lib/utils";

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

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
    setTimeout(() => {
      onClose();
      setElapsedTime(0);
      setTranscript([]);
    }, 1500);
  };

  // Toggle expanded transcript view
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    return [
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
      setIsExpanded(false);
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
    <div className="fixed z-50">
      {/* Compact floating voice button with waveform */}
      <div className="fixed bottom-6 right-6 flex items-center">
        <div 
          className={cn(
            "flex items-center bg-white rounded-full shadow-lg pr-3 border border-gray-200",
            isExpanded ? "min-w-[360px]" : ""
          )}
        >
          <div 
            onClick={toggleExpanded}
            className="flex items-center gap-2 px-3 py-2 cursor-pointer h-12"
          >
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
              {isListening ? (
                <div className="w-6 h-6">
                  <VoiceWaveform voiceId="default" isActive={true} />
                </div>
              ) : (
                <AudioWaveform className="h-4 w-4 text-primary" />
              )}
            </div>
            <span className="font-mono text-sm">{formatTime(elapsedTime)}</span>
          </div>
          
          <Button 
            variant="destructive" 
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleEndConversation}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Expanded transcript view */}
      {isExpanded && (
        <div className="fixed bottom-20 right-6 w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-3 border-b flex items-center justify-between">
            <span className="font-medium">Conversation</span>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-muted/50 p-4 h-64 overflow-y-auto">
            {transcript.length > 0 ? (
              transcript.map((line, idx) => (
                <p 
                  key={idx} 
                  className={`mb-2 ${line && line.startsWith('AI:') ? 'text-primary' : ''}`}
                >
                  {line}
                </p>
              ))
            ) : (
              <p className="text-center text-muted-foreground p-4">
                Speak to start the conversation...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
