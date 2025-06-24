
export interface Integration {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  icon_url: string | null;
  documentation_url: string | null;
  required_scopes: string[] | null;
  config_schema: ConfigSchema | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConfigSchema {
  fields: ConfigField[];
}

export interface ConfigField {
  name: string;
  type: 'string' | 'select' | 'password';
  required: boolean;
  label: string;
  description: string;
  options?: string[];
  default?: string;
}

export interface IntegrationCredential {
  id: string;
  tenant_id: string | null;
  user_id: string;
  integration_id: string;
  credential_name: string;
  encrypted_credentials: Record<string, any>;
  credential_type: string;
  expires_at: string | null;
  last_tested_at: string | null;
  last_test_status: 'not_tested' | 'success' | 'failed' | 'testing';
  last_test_error: any | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface UserIntegration {
  id: string;
  tenant_id: string | null;
  user_id: string;
  integration_id: string;
  credential_id: string;
  status: 'installing' | 'active' | 'paused' | 'error';
  config: Record<string, any> | null;
  installed_at: string | null;
  installed_by: string | null;
  last_sync_at: string | null;
  sync_status: string | null;
  error_count: number;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface IntegrationTestLog {
  id: string;
  credential_id: string;
  test_type: string;
  status: 'success' | 'failed';
  response_time_ms: number | null;
  error_details: any | null;
  tested_at: string;
  tested_by: string | null;
}
