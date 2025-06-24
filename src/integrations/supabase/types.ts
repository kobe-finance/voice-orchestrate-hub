export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      onboarding_backups: {
        Row: {
          backup_data: Json
          backup_reason: string | null
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          backup_data: Json
          backup_reason?: string | null
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          backup_data?: Json
          backup_reason?: string | null
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_business_profile: {
        Row: {
          business_name: string
          business_size: Database["public"]["Enums"]["business_size"] | null
          created_at: string
          current_tools: Json | null
          description: string | null
          goals: Json | null
          id: string
          industry: string | null
          phone_number: string | null
          target_audience: Json | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          business_name: string
          business_size?: Database["public"]["Enums"]["business_size"] | null
          created_at?: string
          current_tools?: Json | null
          description?: string | null
          goals?: Json | null
          id?: string
          industry?: string | null
          phone_number?: string | null
          target_audience?: Json | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          business_name?: string
          business_size?: Database["public"]["Enums"]["business_size"] | null
          created_at?: string
          current_tools?: Json | null
          description?: string | null
          goals?: Json | null
          id?: string
          industry?: string | null
          phone_number?: string | null
          target_audience?: Json | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      onboarding_demo_call: {
        Row: {
          call_recording_url: string | null
          created_at: string
          demo_completed: boolean | null
          demo_feedback: Json | null
          id: string
          improvement_suggestions: string | null
          satisfaction_rating: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          call_recording_url?: string | null
          created_at?: string
          demo_completed?: boolean | null
          demo_feedback?: Json | null
          id?: string
          improvement_suggestions?: string | null
          satisfaction_rating?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          call_recording_url?: string | null
          created_at?: string
          demo_completed?: boolean | null
          demo_feedback?: Json | null
          id?: string
          improvement_suggestions?: string | null
          satisfaction_rating?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_integrations: {
        Row: {
          created_at: string
          custom_requirements: Json | null
          id: string
          integration_configs: Json | null
          priority_integrations: Json | null
          selected_integrations: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_requirements?: Json | null
          id?: string
          integration_configs?: Json | null
          priority_integrations?: Json | null
          selected_integrations?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          custom_requirements?: Json | null
          id?: string
          integration_configs?: Json | null
          priority_integrations?: Json | null
          selected_integrations?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_voice_config: {
        Row: {
          agent_name: string | null
          conversation_style: Json | null
          created_at: string
          id: string
          language: string | null
          personality_traits: Json | null
          response_guidelines: Json | null
          sample_conversations: Json | null
          updated_at: string
          user_id: string
          voice_id: string | null
          voice_provider: string | null
        }
        Insert: {
          agent_name?: string | null
          conversation_style?: Json | null
          created_at?: string
          id?: string
          language?: string | null
          personality_traits?: Json | null
          response_guidelines?: Json | null
          sample_conversations?: Json | null
          updated_at?: string
          user_id: string
          voice_id?: string | null
          voice_provider?: string | null
        }
        Update: {
          agent_name?: string | null
          conversation_style?: Json | null
          created_at?: string
          id?: string
          language?: string | null
          personality_traits?: Json | null
          response_guidelines?: Json | null
          sample_conversations?: Json | null
          updated_at?: string
          user_id?: string
          voice_id?: string | null
          voice_provider?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_onboarding: {
        Row: {
          completed_at: string | null
          completed_steps:
            | Database["public"]["Enums"]["onboarding_step"][]
            | null
          created_at: string
          current_step: Database["public"]["Enums"]["onboarding_step"] | null
          id: string
          is_completed: boolean
          last_reminder_sent: string | null
          reminder_dismissed_until: string | null
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_steps?:
            | Database["public"]["Enums"]["onboarding_step"][]
            | null
          created_at?: string
          current_step?: Database["public"]["Enums"]["onboarding_step"] | null
          id?: string
          is_completed?: boolean
          last_reminder_sent?: string | null
          reminder_dismissed_until?: string | null
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_steps?:
            | Database["public"]["Enums"]["onboarding_step"][]
            | null
          created_at?: string
          current_step?: Database["public"]["Enums"]["onboarding_step"] | null
          id?: string
          is_completed?: boolean
          last_reminder_sent?: string | null
          reminder_dismissed_until?: string | null
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_onboarding_status: {
        Args: { user_uuid: string }
        Returns: {
          is_completed: boolean
          current_step: string
          completed_steps: string[]
          needs_reminder: boolean
        }[]
      }
    }
    Enums: {
      business_size: "startup" | "small" | "medium" | "large" | "enterprise"
      onboarding_step:
        | "welcome"
        | "business-profile"
        | "voice-agent-config"
        | "integration-setup"
        | "demo-call"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      business_size: ["startup", "small", "medium", "large", "enterprise"],
      onboarding_step: [
        "welcome",
        "business-profile",
        "voice-agent-config",
        "integration-setup",
        "demo-call",
      ],
    },
  },
} as const
