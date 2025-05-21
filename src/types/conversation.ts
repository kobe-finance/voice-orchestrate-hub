
export interface Speaker {
  id: string;
  type: "user" | "agent";
  name: string;
}

export interface Message {
  id: string;
  speakerId: string;
  text: string;
  timestamp: string;
  sentiment?: "positive" | "neutral" | "negative";
}

export interface Conversation {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // in seconds
  agents: Speaker[];
  users: Speaker[];
  messages: Message[];
  outcome: "completed" | "transferred" | "abandoned";
  intentRecognized: string[];
  entities: Record<string, string[]>;
  sentimentScore: number; // -1 to 1
  tags: string[];
  audioUrl?: string;
}

export interface ConversationFilters {
  searchTerm?: string;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  duration?: {
    min?: number;
    max?: number;
  };
  intents?: string[];
  entities?: Record<string, string[]>;
  sentiment?: "positive" | "neutral" | "negative";
  agentResponses?: string[];
  tags?: string[];
  outcome?: "completed" | "transferred" | "abandoned";
}
