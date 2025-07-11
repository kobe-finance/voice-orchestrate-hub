/**
 * Phase 2.4: API-based Voice Agents Hook
 * 
 * Replaces agent management logic with pure API calls
 * - Uses agentsAPI for all operations
 * - No business logic in frontend
 * - Pure CRUD operations only
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agentsAPI } from '@/services/api/agents';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';
import type { VoiceAgent, CreateVoiceAgentRequest } from '@/services/api/types';

export const useAgentsAPI = () => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Get all voice agents
  const { data: agentsResponse, isLoading } = useQuery({
    queryKey: ['voice-agents-api', user?.user_metadata?.tenant_id],
    queryFn: async () => {
      return await agentsAPI.getVoiceAgents();
    },
    enabled: !!isAuthenticated && !!user?.user_metadata?.tenant_id,
  });

  const agents = agentsResponse?.data || [];

  // Get single agent
  const getAgent = (agentId: string) => {
    return useQuery({
      queryKey: ['voice-agent-api', agentId],
      queryFn: async (): Promise<VoiceAgent> => {
        return await agentsAPI.getVoiceAgent(agentId);
      },
      enabled: !!agentId && !!isAuthenticated,
    });
  };

  // Create new agent
  const createAgent = useMutation({
    mutationFn: async (data: CreateVoiceAgentRequest): Promise<VoiceAgent> => {
      return await agentsAPI.createVoiceAgent(data);
    },
    onSuccess: (newAgent) => {
      queryClient.setQueryData(['voice-agents-api', user?.user_metadata?.tenant_id], 
        (old: VoiceAgent[] = []) => [newAgent, ...old]
      );
      queryClient.invalidateQueries({ queryKey: ['voice-agents-api'] });
      toast.success('Voice agent created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating agent:', error);
      toast.error('Failed to create voice agent');
    },
  });

  // Update agent
  const updateAgent = useMutation({
    mutationFn: async ({ agentId, data }: { agentId: string; data: Partial<CreateVoiceAgentRequest> }): Promise<VoiceAgent> => {
      return await agentsAPI.updateVoiceAgent(agentId, data);
    },
    onSuccess: (updatedAgent) => {
      queryClient.setQueryData(['voice-agent-api', updatedAgent.id], updatedAgent);
      queryClient.invalidateQueries({ queryKey: ['voice-agents-api'] });
      toast.success('Voice agent updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating agent:', error);
      toast.error('Failed to update voice agent');
    },
  });

  // Delete agent
  const deleteAgent = useMutation({
    mutationFn: async (agentId: string): Promise<void> => {
      return await agentsAPI.deleteVoiceAgent(agentId);
    },
    onSuccess: (_, agentId) => {
      queryClient.removeQueries({ queryKey: ['voice-agent-api', agentId] });
      queryClient.setQueryData(['voice-agents-api', user?.user_metadata?.tenant_id], 
        (old: VoiceAgent[] = []) => old.filter(agent => agent.id !== agentId)
      );
      toast.success('Voice agent deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting agent:', error);
      toast.error('Failed to delete voice agent');
    },
  });

  // Activate/Deactivate agent
  const toggleAgentStatus = useMutation({
    mutationFn: async ({ agentId, isActive }: { agentId: string; isActive: boolean }): Promise<VoiceAgent> => {
      return await agentsAPI.toggleVoiceAgent(agentId, isActive);
    },
    onSuccess: (updatedAgent) => {
      queryClient.setQueryData(['voice-agent-api', updatedAgent.id], updatedAgent);
      queryClient.invalidateQueries({ queryKey: ['voice-agents-api'] });
      toast.success(`Voice agent ${updatedAgent.is_active ? 'activated' : 'deactivated'}`);
    },
    onError: (error: any) => {
      console.error('Error toggling agent status:', error);
      toast.error('Failed to update agent status');
    },
  });

  return {
    agents,
    isLoading,
    getAgent,
    createAgent: createAgent.mutateAsync,
    updateAgent: updateAgent.mutateAsync,
    deleteAgent: deleteAgent.mutateAsync,
    toggleAgentStatus: toggleAgentStatus.mutateAsync,
    isCreating: createAgent.isPending,
    isUpdating: updateAgent.isPending,
    isDeleting: deleteAgent.isPending,
    isToggling: toggleAgentStatus.isPending,
  };
};