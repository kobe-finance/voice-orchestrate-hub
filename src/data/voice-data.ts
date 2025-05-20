
// Voice providers data
export const voiceProviders = [
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    description: "High-quality AI voice generation",
    apiEndpoint: "https://api.elevenlabs.io/v1/text-to-speech"
  },
  {
    id: "deepgram",
    name: "Deepgram",
    description: "Enterprise-grade voice AI",
    apiEndpoint: "https://api.deepgram.com/v1/speak"
  },
  {
    id: "googlecloud",
    name: "Google Cloud TTS",
    description: "Google's text-to-speech technology",
    apiEndpoint: "https://texttospeech.googleapis.com/v1/text:synthesize"
  },
  {
    id: "azure",
    name: "Azure Cognitive Services",
    description: "Microsoft's speech services",
    apiEndpoint: "https://westus.tts.speech.microsoft.com/cognitiveservices/v1"
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
