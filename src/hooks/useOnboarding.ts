import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

export interface OnboardingStatus {
  isCompleted: boolean;
  currentStep: string;
  completedSteps: string[];
  needsReminder: boolean;
}

export interface BusinessProfileData {
  businessName: string;
  industry?: string;
  businessSize?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  websiteUrl?: string;
  phoneNumber?: string;
  description?: string;
  goals?: any[];
  targetAudience?: any[];
  currentTools?: any[];
}

export interface VoiceConfigData {
  agentName?: string;
  voiceProvider?: string;
  voiceId?: string;
  language?: string;
  personalityTraits?: any;
  conversationStyle?: any;
  responseGuidelines?: any;
  sampleConversations?: any[];
}

export interface IntegrationsData {
  selectedIntegrations?: string[];
  integrationConfigs?: any;
  priorityIntegrations?: string[];
  customRequirements?: any;
}

export interface DemoCallData {
  demoCompleted?: boolean;
  demoFeedback?: any;
  callRecordingUrl?: string;
  satisfactionRating?: number;
  improvementSuggestions?: string;
}

export const useOnboarding = () => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Get onboarding status
  const { data: onboardingStatus, isLoading } = useQuery({
    queryKey: ['onboarding-status', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .rpc('get_user_onboarding_status', { user_uuid: user.id });
      
      if (error) throw error;
      
      // Transform snake_case to camelCase
      const result = data?.[0];
      if (!result) return null;
      
      return {
        isCompleted: result.is_completed,
        currentStep: result.current_step,
        completedSteps: result.completed_steps,
        needsReminder: result.needs_reminder,
      } as OnboardingStatus;
    },
    enabled: !!user?.id && isAuthenticated,
  });

  // Get business profile data
  const { data: businessProfile } = useQuery({
    queryKey: ['business-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('onboarding_business_profile')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && isAuthenticated,
  });

  // Get voice config data
  const { data: voiceConfig } = useQuery({
    queryKey: ['voice-config', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('onboarding_voice_config')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && isAuthenticated,
  });

  // Get integrations data
  const { data: integrations } = useQuery({
    queryKey: ['integrations', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('onboarding_integrations')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && isAuthenticated,
  });

  // Get demo call data
  const { data: demoCall } = useQuery({
    queryKey: ['demo-call', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('onboarding_demo_call')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && isAuthenticated,
  });

  // Initialize onboarding record
  const initializeOnboarding = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('user_onboarding')
        .insert({
          user_id: user.id,
          current_step: 'welcome',
          started_at: new Date().toISOString(),
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-status'] });
    },
  });

  // Update onboarding step
  const updateStep = useMutation({
    mutationFn: async ({ step, completed = false }: { step: string; completed?: boolean }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const currentSteps = onboardingStatus?.completedSteps || [];
      const newCompletedSteps = completed && !currentSteps.includes(step) 
        ? [...currentSteps, step] 
        : currentSteps;
      
      const { error } = await supabase
        .from('user_onboarding')
        .update({
          current_step: step,
          completed_steps: newCompletedSteps,
          is_completed: newCompletedSteps.length >= 5, // All 5 steps completed
          completed_at: newCompletedSteps.length >= 5 ? new Date().toISOString() : null,
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-status'] });
    },
  });

  // Save business profile
  const saveBusinessProfile = useMutation({
    mutationFn: async (data: BusinessProfileData) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('onboarding_business_profile')
        .upsert({
          user_id: user.id,
          business_name: data.businessName,
          industry: data.industry,
          business_size: data.businessSize,
          website_url: data.websiteUrl,
          phone_number: data.phoneNumber,
          description: data.description,
          goals: data.goals,
          target_audience: data.targetAudience,
          current_tools: data.currentTools,
        }, { onConflict: 'user_id' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-profile'] });
      toast.success('Business profile saved successfully');
    },
  });

  // Save voice config
  const saveVoiceConfig = useMutation({
    mutationFn: async (data: VoiceConfigData) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('onboarding_voice_config')
        .upsert({
          user_id: user.id,
          agent_name: data.agentName,
          voice_provider: data.voiceProvider,
          voice_id: data.voiceId,
          language: data.language,
          personality_traits: data.personalityTraits,
          conversation_style: data.conversationStyle,
          response_guidelines: data.responseGuidelines,
          sample_conversations: data.sampleConversations,
        }, { onConflict: 'user_id' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voice-config'] });
      toast.success('Voice configuration saved successfully');
    },
  });

  // Save integrations
  const saveIntegrations = useMutation({
    mutationFn: async (data: IntegrationsData) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('onboarding_integrations')
        .upsert({
          user_id: user.id,
          selected_integrations: data.selectedIntegrations,
          integration_configs: data.integrationConfigs,
          priority_integrations: data.priorityIntegrations,
          custom_requirements: data.customRequirements,
        }, { onConflict: 'user_id' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast.success('Integration settings saved successfully');
    },
  });

  // Save demo call data
  const saveDemoCall = useMutation({
    mutationFn: async (data: DemoCallData) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('onboarding_demo_call')
        .upsert({
          user_id: user.id,
          demo_completed: data.demoCompleted,
          demo_feedback: data.demoFeedback,
          call_recording_url: data.callRecordingUrl,
          satisfaction_rating: data.satisfactionRating,
          improvement_suggestions: data.improvementSuggestions,
        }, { onConflict: 'user_id' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demo-call'] });
      toast.success('Demo call data saved successfully');
    },
  });

  // Create backup before re-onboarding
  const createBackup = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Collect all current onboarding data and convert to JSON-safe format
      const backupData = {
        businessProfile,
        voiceConfig,
        integrations,
        demoCall,
        onboardingStatus: onboardingStatus ? {
          isCompleted: onboardingStatus.isCompleted,
          currentStep: onboardingStatus.currentStep,
          completedSteps: onboardingStatus.completedSteps,
          needsReminder: onboardingStatus.needsReminder,
        } : null,
      };
      
      const { error } = await supabase
        .from('onboarding_backups')
        .insert({
          user_id: user.id,
          backup_data: backupData as any,
          backup_reason: 're-onboarding',
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Settings backed up successfully');
    },
  });

  // Dismiss reminder temporarily
  const dismissReminder = useMutation({
    mutationFn: async (dismissUntil: Date) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('user_onboarding')
        .update({
          reminder_dismissed_until: dismissUntil.toISOString(),
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-status'] });
    },
  });

  const skipToStep = useCallback(async (step: string) => {
    await updateStep.mutateAsync({ step });
  }, [updateStep]);

  const completeStep = useCallback(async (step: string) => {
    await updateStep.mutateAsync({ step, completed: true });
  }, [updateStep]);

  return {
    // Status
    onboardingStatus,
    isLoading,
    
    // Data
    businessProfile,
    voiceConfig,
    integrations,
    demoCall,
    
    // Mutations
    initializeOnboarding: initializeOnboarding.mutateAsync,
    saveBusinessProfile: saveBusinessProfile.mutateAsync,
    saveVoiceConfig: saveVoiceConfig.mutateAsync,
    saveIntegrations: saveIntegrations.mutateAsync,
    saveDemoCall: saveDemoCall.mutateAsync,
    createBackup: createBackup.mutateAsync,
    dismissReminder: dismissReminder.mutateAsync,
    skipToStep,
    completeStep,
    
    // Loading states
    isInitializing: initializeOnboarding.isPending,
    isSaving: saveBusinessProfile.isPending || saveVoiceConfig.isPending || 
              saveIntegrations.isPending || saveDemoCall.isPending,
    isCreatingBackup: createBackup.isPending,
  };
};
