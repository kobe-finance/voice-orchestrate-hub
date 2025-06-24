
export interface Integration {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
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

// Database to frontend type converters
export const convertDatabaseIntegration = (dbIntegration: any): Integration => ({
  id: dbIntegration.id,
  name: dbIntegration.name,
  slug: dbIntegration.slug,
  category: dbIntegration.category,
  description: dbIntegration.description,
  icon_url: dbIntegration.icon_url,
  documentation_url: dbIntegration.documentation_url,
  required_scopes: Array.isArray(dbIntegration.required_scopes) ? dbIntegration.required_scopes : null,
  config_schema: dbIntegration.config_schema as ConfigSchema | null,
  is_active: dbIntegration.is_active,
  created_at: dbIntegration.created_at,
  updated_at: dbIntegration.updated_at,
});

export const convertDatabaseUserIntegration = (dbUserIntegration: any): UserIntegration & { integration?: Integration; credential?: IntegrationCredential } => ({
  id: dbUserIntegration.id,
  tenant_id: dbUserIntegration.tenant_id,
  user_id: dbUserIntegration.user_id,
  integration_id: dbUserIntegration.integration_id,
  credential_id: dbUserIntegration.credential_id,
  status: dbUserIntegration.status as 'installing' | 'active' | 'paused' | 'error',
  config: dbUserIntegration.config as Record<string, any> | null,
  installed_at: dbUserIntegration.installed_at,
  installed_by: dbUserIntegration.installed_by,
  last_sync_at: dbUserIntegration.last_sync_at,
  sync_status: dbUserIntegration.sync_status,
  error_count: dbUserIntegration.error_count,
  metadata: dbUserIntegration.metadata as Record<string, any> | null,
  created_at: dbUserIntegration.created_at,
  updated_at: dbUserIntegration.updated_at,
  integration: dbUserIntegration.integration ? convertDatabaseIntegration(dbUserIntegration.integration) : undefined,
  credential: dbUserIntegration.credential as IntegrationCredential | undefined,
});
