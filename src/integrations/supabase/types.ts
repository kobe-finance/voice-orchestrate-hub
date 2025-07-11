export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      api_usage_logs: {
        Row: {
          cost_cents: number | null
          created_at: string
          credential_id: string | null
          error_message: string | null
          from_cache: boolean | null
          id: string
          operation: string
          provider: string
          response_time_ms: number
          status_code: number
          tenant_id: string
          tokens_used: number | null
          user_id: string | null
        }
        Insert: {
          cost_cents?: number | null
          created_at?: string
          credential_id?: string | null
          error_message?: string | null
          from_cache?: boolean | null
          id?: string
          operation: string
          provider: string
          response_time_ms: number
          status_code: number
          tenant_id: string
          tokens_used?: number | null
          user_id?: string | null
        }
        Update: {
          cost_cents?: number | null
          created_at?: string
          credential_id?: string | null
          error_message?: string | null
          from_cache?: boolean | null
          id?: string
          operation?: string
          provider?: string
          response_time_ms?: number
          status_code?: number
          tenant_id?: string
          tokens_used?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_credential"
            columns: ["credential_id"]
            isOneToOne: false
            referencedRelation: "integration_credentials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          target_entity: string | null
          target_entity_id: string | null
          tenant_id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          target_entity?: string | null
          target_entity_id?: string | null
          tenant_id: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_entity?: string | null
          target_entity_id?: string | null
          tenant_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      business_profiles: {
        Row: {
          business_name: string | null
          business_size: string | null
          created_at: string
          description: string | null
          id: string
          industry: string | null
          phone_number: string | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          business_name?: string | null
          business_size?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          phone_number?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          business_name?: string | null
          business_size?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          phone_number?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      integration_audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          integration_id: string | null
          ip_address: unknown | null
          tenant_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          integration_id?: string | null
          ip_address?: unknown | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          integration_id?: string | null
          ip_address?: unknown | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_audit_log_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_credentials: {
        Row: {
          created_at: string | null
          created_by: string | null
          credential_name: string
          credential_type: string
          custom_quota_limits: Json | null
          encrypted_credentials: Json
          expires_at: string | null
          id: string
          integration_id: string
          last_test_error: Json | null
          last_test_status: string | null
          last_tested_at: string | null
          tenant_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          credential_name: string
          credential_type: string
          custom_quota_limits?: Json | null
          encrypted_credentials: Json
          expires_at?: string | null
          id?: string
          integration_id: string
          last_test_error?: Json | null
          last_test_status?: string | null
          last_tested_at?: string | null
          tenant_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          credential_name?: string
          credential_type?: string
          custom_quota_limits?: Json | null
          encrypted_credentials?: Json
          expires_at?: string | null
          id?: string
          integration_id?: string
          last_test_error?: Json | null
          last_test_status?: string | null
          last_tested_at?: string | null
          tenant_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_credentials_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_test_logs: {
        Row: {
          credential_id: string
          error_details: Json | null
          id: string
          response_time_ms: number | null
          status: string
          test_type: string
          tested_at: string | null
          tested_by: string | null
        }
        Insert: {
          credential_id: string
          error_details?: Json | null
          id?: string
          response_time_ms?: number | null
          status: string
          test_type: string
          tested_at?: string | null
          tested_by?: string | null
        }
        Update: {
          credential_id?: string
          error_details?: Json | null
          id?: string
          response_time_ms?: number | null
          status?: string
          test_type?: string
          tested_at?: string | null
          tested_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_test_logs_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: false
            referencedRelation: "integration_credentials"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          auth_type: string | null
          category: string
          config_schema: Json | null
          created_at: string | null
          credentials_schema: Json | null
          description: string | null
          documentation_url: string | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
          required_scopes: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          auth_type?: string | null
          category: string
          config_schema?: Json | null
          created_at?: string | null
          credentials_schema?: Json | null
          description?: string | null
          documentation_url?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          required_scopes?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          auth_type?: string | null
          category?: string
          config_schema?: Json | null
          created_at?: string | null
          credentials_schema?: Json | null
          description?: string | null
          documentation_url?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          required_scopes?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          created_by: string | null
          email: string
          expires_at: string
          id: string
          organization_id: string
          role: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          created_by?: string | null
          email: string
          expires_at: string
          id?: string
          organization_id: string
          role?: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          created_by?: string | null
          email?: string
          expires_at?: string
          id?: string
          organization_id?: string
          role?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          id: string
          invited_by: string | null
          is_active: boolean
          joined_at: string
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          invited_by?: string | null
          is_active?: boolean
          joined_at?: string
          organization_id: string
          role?: string
          user_id: string
        }
        Update: {
          id?: string
          invited_by?: string | null
          is_active?: boolean
          joined_at?: string
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          settings: Json | null
          slug: string
          subscription_tier: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          settings?: Json | null
          slug: string
          subscription_tier?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          settings?: Json | null
          slug?: string
          subscription_tier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      registration_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tenant_quota_limits: {
        Row: {
          created_at: string
          daily_tokens: number | null
          monthly_tokens: number | null
          per_minute_requests: number | null
          provider: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          daily_tokens?: number | null
          monthly_tokens?: number | null
          per_minute_requests?: number | null
          provider: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          daily_tokens?: number | null
          monthly_tokens?: number | null
          per_minute_requests?: number | null
          provider?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_quota_limits_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_integrations: {
        Row: {
          config: Json | null
          created_at: string | null
          credential_id: string
          error_count: number | null
          id: string
          installed_at: string | null
          installed_by: string | null
          integration_id: string
          last_sync_at: string | null
          metadata: Json | null
          status: string
          sync_status: string | null
          tenant_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          credential_id: string
          error_count?: number | null
          id?: string
          installed_at?: string | null
          installed_by?: string | null
          integration_id: string
          last_sync_at?: string | null
          metadata?: Json | null
          status?: string
          sync_status?: string | null
          tenant_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          credential_id?: string
          error_count?: number | null
          id?: string
          installed_at?: string | null
          installed_by?: string | null
          integration_id?: string
          last_sync_at?: string | null
          metadata?: Json | null
          status?: string
          sync_status?: string | null
          tenant_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_integrations_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: false
            referencedRelation: "integration_credentials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_integrations_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_organization_for_user: {
        Args: { p_user_id: string; p_email: string; p_company_name: string }
        Returns: string
      }
      ensure_user_has_organization: {
        Args: { p_user_id: string }
        Returns: string
      }
      get_aggregated_usage_analytics: {
        Args: {
          p_tenant_id: string
          p_start_date: string
          p_end_date: string
          p_provider?: string
          p_group_by?: string
        }
        Returns: Json
      }
      get_user_organizations: {
        Args: Record<PropertyKey, never>
        Returns: {
          organization_id: string
          role: string
        }[]
      }
      test_registration_trigger: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      user_belongs_to_organization: {
        Args: { org_id: string }
        Returns: boolean
      }
      user_can_manage_organization: {
        Args: { org_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
