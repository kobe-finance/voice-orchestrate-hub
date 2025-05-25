
// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Voice Agent Types
export interface VoiceAgent {
  id: string;
  name: string;
  description: string;
  voiceId: string;
  tenantId: string;
  isActive: boolean;
  configuration: VoiceAgentConfig;
  createdAt: string;
  updatedAt: string;
}

export interface VoiceAgentConfig {
  language: string;
  tone: string;
  personality: string;
  instructions: string;
  fallbackResponses: string[];
  integrations: string[];
}

// Conversation Types
export interface Conversation {
  id: string;
  agentId: string;
  customerId: string;
  status: 'active' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  duration?: number;
  transcript: ConversationMessage[];
  metadata: ConversationMetadata;
}

export interface ConversationMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  confidence?: number;
  metadata?: Record<string, any>;
}

export interface ConversationMetadata {
  customerPhone?: string;
  customerEmail?: string;
  tags: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  outcome: string;
  customFields: Record<string, any>;
}

// Integration Types
export interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  configuration: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface AnalyticsMetrics {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  averageDuration: number;
  satisfactionScore: number;
  topIntents: Array<{ intent: string; count: number }>;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  metadata?: Record<string, any>;
}

// Billing Types
export interface Subscription {
  id: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  usage: SubscriptionUsage;
}

export interface SubscriptionUsage {
  calls: number;
  minutes: number;
  storage: number;
  limits: {
    calls: number;
    minutes: number;
    storage: number;
  };
}
