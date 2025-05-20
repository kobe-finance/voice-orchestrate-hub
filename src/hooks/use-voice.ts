
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { voiceProviders, defaultVoices } from "@/data/voice-data";

// Cache for audio samples
const audioCache = new Map<string, HTMLAudioElement>();

type VoiceParams = {
  speed: number;
  pitch: number;
  clarity: number;
  emotion: string;
};

export function useVoice(providerId: string) {
  const [voices, setVoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get available voices based on provider
  useEffect(() => {
    const fetchVoices = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be an API call to the selected provider
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          const providerVoices = defaultVoices.filter(v => v.provider === providerId);
          setVoices(providerVoices);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching voices:", error);
        toast.error("Failed to load voices", {
          description: "Please try again or select a different provider"
        });
        setIsLoading(false);
      }
    };
    
    fetchVoices();
  }, [providerId]);

  // Generate an audio sample for a voice
  const generateSample = async (voiceId: string, text: string, params: VoiceParams): Promise<HTMLAudioElement> => {
    // Create a cache key based on voice, text and parameters
    const cacheKey = `${voiceId}-${text}-${JSON.stringify(params)}`;
    
    // Check cache first
    if (audioCache.has(cacheKey)) {
      const cachedAudio = audioCache.get(cacheKey)!;
      cachedAudio.currentTime = 0; // Reset to beginning
      return cachedAudio;
    }
    
    // In a real app, this would call the voice provider's API
    // For demo purposes, we'll use a mock implementation
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Create an audio element with a sample sound
        const audio = new Audio("/sample-voice.mp3");
        
        // Apply audio parameters (in a real implementation)
        // audio.playbackRate = params.speed;
        // audio.preservesPitch = false;
        
        // Cache the audio for future use
        audioCache.set(cacheKey, audio);
        
        resolve(audio);
      }, 500);
    });
  };

  return {
    voices,
    isLoading,
    generateSample
  };
}
