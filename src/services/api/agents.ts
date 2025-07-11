/**
 * Voice Agents API Service
 * Handles voice agent management API calls
 */

import { apiClient } from './base';
import type {
  VoiceAgent,
  CreateVoiceAgentRequest,
  PaginatedRequest,
  PaginatedResponse
} from './types';

export interface VoiceProvider {
  id: string;
  name: string;
  type: 'premium' | 'standard';
  status: 'connected' | 'disconnected' | 'error';
  description: string;
  supported_languages: string[];
  cost_per_minute?: number;
  max_characters?: number;
}

export interface VoiceModel {
  id: string;
  name: string;
  provider_id: string;
  voice_type: 'male' | 'female' | 'neutral';
  language: string;
  accent?: string;
  sample_url?: string;
  is_premium: boolean;
}

export interface ConversationFlow {
  id: string;
  name: string;
  description?: string;
  tenant_id: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FlowNode {
  id: string;
  type: 'start' | 'message' | 'question' | 'condition' | 'action' | 'end';
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: Record<string, any>;
}

export class AgentsAPI {
  // Voice Agent Management
  async getVoiceAgents(params?: PaginatedRequest & { 
    search?: string; 
    is_active?: boolean; 
  }): Promise<PaginatedResponse<VoiceAgent>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.is_active !== undefined) searchParams.set('is_active', params.is_active.toString());
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    const query = searchParams.toString();
    return apiClient.get<PaginatedResponse<VoiceAgent>>(`/agents/voice${query ? `?${query}` : ''}`);
  }

  async getVoiceAgent(agentId: string): Promise<VoiceAgent> {
    return apiClient.get<VoiceAgent>(`/agents/voice/${agentId}`);
  }

  async createVoiceAgent(data: CreateVoiceAgentRequest): Promise<VoiceAgent> {
    return apiClient.post<VoiceAgent>('/agents/voice', data);
  }

  async updateVoiceAgent(agentId: string, data: Partial<CreateVoiceAgentRequest>): Promise<VoiceAgent> {
    return apiClient.put<VoiceAgent>(`/agents/voice/${agentId}`, data);
  }

  async deleteVoiceAgent(agentId: string): Promise<void> {
    return apiClient.delete<void>(`/agents/voice/${agentId}`);
  }

  async cloneVoiceAgent(agentId: string, name: string): Promise<VoiceAgent> {
    return apiClient.post<VoiceAgent>(`/agents/voice/${agentId}/clone`, { name });
  }

  async toggleVoiceAgent(agentId: string, isActive: boolean): Promise<VoiceAgent> {
    return apiClient.patch<VoiceAgent>(`/agents/voice/${agentId}/toggle`, { is_active: isActive });
  }

  // Voice Provider Management
  async getVoiceProviders(): Promise<VoiceProvider[]> {
    return apiClient.get<VoiceProvider[]>('/agents/voice-providers');
  }

  async getVoiceProvider(providerId: string): Promise<VoiceProvider> {
    return apiClient.get<VoiceProvider>(`/agents/voice-providers/${providerId}`);
  }

  async connectVoiceProvider(providerId: string, credentials: Record<string, any>): Promise<VoiceProvider> {
    return apiClient.post<VoiceProvider>(`/agents/voice-providers/${providerId}/connect`, credentials);
  }

  async disconnectVoiceProvider(providerId: string): Promise<void> {
    return apiClient.post<void>(`/agents/voice-providers/${providerId}/disconnect`);
  }

  async testVoiceProvider(providerId: string, text?: string): Promise<{
    success: boolean;
    audio_url?: string;
    error?: string;
  }> {
    return apiClient.post<{
      success: boolean;
      audio_url?: string;
      error?: string;
    }>(`/agents/voice-providers/${providerId}/test`, { text: text || 'Hello, this is a test.' });
  }

  // Voice Model Management
  async getVoiceModels(providerId?: string): Promise<VoiceModel[]> {
    const query = providerId ? `?provider_id=${providerId}` : '';
    return apiClient.get<VoiceModel[]>(`/agents/voice-models${query}`);
  }

  async getVoiceModel(modelId: string): Promise<VoiceModel> {
    return apiClient.get<VoiceModel>(`/agents/voice-models/${modelId}`);
  }

  // Conversation Flow Management
  async getConversationFlows(params?: PaginatedRequest & { 
    search?: string; 
    is_active?: boolean; 
  }): Promise<PaginatedResponse<ConversationFlow>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.is_active !== undefined) searchParams.set('is_active', params.is_active.toString());
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    const query = searchParams.toString();
    return apiClient.get<PaginatedResponse<ConversationFlow>>(`/agents/flows${query ? `?${query}` : ''}`);
  }

  async getConversationFlow(flowId: string): Promise<ConversationFlow> {
    return apiClient.get<ConversationFlow>(`/agents/flows/${flowId}`);
  }

  async createConversationFlow(data: {
    name: string;
    description?: string;
    nodes: FlowNode[];
    edges: FlowEdge[];
  }): Promise<ConversationFlow> {
    return apiClient.post<ConversationFlow>('/agents/flows', data);
  }

  async updateConversationFlow(flowId: string, data: Partial<{
    name: string;
    description?: string;
    nodes: FlowNode[];
    edges: FlowEdge[];
    is_active: boolean;
  }>): Promise<ConversationFlow> {
    return apiClient.put<ConversationFlow>(`/agents/flows/${flowId}`, data);
  }

  async deleteConversationFlow(flowId: string): Promise<void> {
    return apiClient.delete<void>(`/agents/flows/${flowId}`);
  }

  async validateConversationFlow(flowId: string): Promise<{
    is_valid: boolean;
    errors: Array<{
      node_id?: string;
      message: string;
      type: 'error' | 'warning';
    }>;
  }> {
    return apiClient.post<{
      is_valid: boolean;
      errors: Array<{
        node_id?: string;
        message: string;
        type: 'error' | 'warning';
      }>;
    }>(`/agents/flows/${flowId}/validate`);
  }

  // Agent Testing
  async testVoiceAgent(agentId: string, input: {
    text?: string;
    audio_url?: string;
    context?: Record<string, any>;
  }): Promise<{
    response_text: string;
    audio_url?: string;
    response_time_ms: number;
    tokens_used?: number;
    cost_cents?: number;
  }> {
    return apiClient.post<{
      response_text: string;
      audio_url?: string;
      response_time_ms: number;
      tokens_used?: number;
      cost_cents?: number;
    }>(`/agents/voice/${agentId}/test`, input);
  }

  // Agent Templates
  async getAgentTemplates(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    configuration: any;
    use_cases: string[];
  }>> {
    return apiClient.get<Array<{
      id: string;
      name: string;
      description: string;
      category: string;
      configuration: any;
      use_cases: string[];
    }>>('/agents/templates');
  }

  async createAgentFromTemplate(templateId: string, data: {
    name: string;
    customizations?: Record<string, any>;
  }): Promise<VoiceAgent> {
    return apiClient.post<VoiceAgent>(`/agents/templates/${templateId}/create`, data);
  }
}

export const agentsAPI = new AgentsAPI();