
// Voice providers data
export const voiceProviders = [
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    description: "High-quality AI voice generation",
    apiEndpoint: "https://api.elevenlabs.io/v1/text-to-speech",
    status: "operational", // operational, degraded, outage
    costPer1000Chars: 0.30,
    rateLimit: 100,
    supportedLanguages: ["English", "Spanish", "French", "German", "Italian", "Portuguese"],
    qualityRating: 5,
    isPrimary: true,
    fallbackPriority: 1,
    credentials: {
      isConfigured: true,
      lastVerified: "2025-05-02T14:30:00Z"
    }
  },
  {
    id: "deepgram",
    name: "Deepgram",
    description: "Enterprise-grade voice AI",
    apiEndpoint: "https://api.deepgram.com/v1/speak",
    status: "degraded", // operational, degraded, outage
    costPer1000Chars: 0.20,
    rateLimit: 150,
    supportedLanguages: ["English", "Spanish", "French", "German"],
    qualityRating: 4,
    isPrimary: false,
    fallbackPriority: 2,
    credentials: {
      isConfigured: true,
      lastVerified: "2025-05-03T09:15:00Z"
    }
  },
  {
    id: "googlecloud",
    name: "Google Cloud TTS",
    description: "Google's text-to-speech technology",
    apiEndpoint: "https://texttospeech.googleapis.com/v1/text:synthesize",
    status: "operational", // operational, degraded, outage
    costPer1000Chars: 0.16,
    rateLimit: 200,
    supportedLanguages: ["English", "Spanish", "French", "German", "Italian", "Japanese", "Korean"],
    qualityRating: 4,
    isPrimary: false,
    fallbackPriority: 3,
    credentials: {
      isConfigured: false,
      lastVerified: null
    }
  },
  {
    id: "azure",
    name: "Azure Cognitive Services",
    description: "Microsoft's speech services",
    apiEndpoint: "https://westus.tts.speech.microsoft.com/cognitiveservices/v1",
    status: "operational", // operational, degraded, outage
    costPer1000Chars: 0.16,
    rateLimit: 200,
    supportedLanguages: ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Italian"],
    qualityRating: 4,
    isPrimary: false,
    fallbackPriority: 4,
    credentials: {
      isConfigured: false,
      lastVerified: null
    }
  },
  {
    id: "amazon",
    name: "Amazon Polly",
    description: "Amazon's text-to-speech service",
    apiEndpoint: "https://polly.us-east-1.amazonaws.com",
    status: "outage", // operational, degraded, outage
    costPer1000Chars: 0.16,
    rateLimit: 80,
    supportedLanguages: ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Japanese"],
    qualityRating: 3,
    isPrimary: false,
    fallbackPriority: 5,
    credentials: {
      isConfigured: false,
      lastVerified: null
    }
  }
];

// Default voice samples
export const defaultVoices = [
  {
    id: "aria",
    name: "Aria",
    provider: "elevenlabs",
    description: "Professional female voice with clear diction",
    gender: "Female",
    age: "30-40",
    accent: "American",
    suitableFor: ["Customer Service", "Professional"]
  },
  {
    id: "roger",
    name: "Roger",
    provider: "elevenlabs",
    description: "Warm male voice with a friendly tone",
    gender: "Male",
    age: "40-50",
    accent: "British",
    suitableFor: ["Narration", "Education"]
  },
  {
    id: "sarah",
    name: "Sarah",
    provider: "elevenlabs",
    description: "Young energetic female voice",
    gender: "Female",
    age: "20-30",
    accent: "American",
    suitableFor: ["Marketing", "Entertainment"]
  },
  {
    id: "george",
    name: "George",
    provider: "elevenlabs",
    description: "Deep authoritative male voice",
    gender: "Male",
    age: "50-60",
    accent: "American",
    suitableFor: ["Announcements", "Formal"]
  },
  {
    id: "emily",
    name: "Emily",
    provider: "deepgram",
    description: "Clear articulate female voice",
    gender: "Female",
    age: "30-40",
    accent: "British",
    suitableFor: ["Professional", "Medical"]
  },
  {
    id: "david",
    name: "David",
    provider: "deepgram",
    description: "Smooth conversational male voice",
    gender: "Male",
    age: "30-40",
    accent: "American",
    suitableFor: ["Conversational", "Tech"]
  },
  {
    id: "sophia",
    name: "Sophia",
    provider: "googlecloud",
    description: "Bright and cheerful female voice",
    gender: "Female",
    age: "20-30",
    accent: "Australian",
    suitableFor: ["Retail", "Entertainment"]
  },
  {
    id: "james",
    name: "James",
    provider: "googlecloud",
    description: "Professional male voice with perfect enunciation",
    gender: "Male",
    age: "40-50",
    accent: "British",
    suitableFor: ["Finance", "Legal"]
  },
  {
    id: "olivia",
    name: "Olivia",
    provider: "azure",
    description: "Warm and natural female voice",
    gender: "Female",
    age: "30-40",
    accent: "American",
    suitableFor: ["Healthcare", "Education"]
  },
  {
    id: "michael",
    name: "Michael",
    provider: "azure",
    description: "Clear and authoritative male voice",
    gender: "Male",
    age: "40-50",
    accent: "American",
    suitableFor: ["Corporate", "Training"]
  }
];
