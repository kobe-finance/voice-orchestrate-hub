
export interface FormField {
  name: string;
  type: 'text' | 'password' | 'select' | 'url';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    pattern?: string;
    message?: string;
    minLength?: number;
  };
  options?: string[];
}

export interface IntegrationFormSchema {
  fields: FormField[];
}

export interface Integration {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  auth_type: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IntegrationCredential {
  id: string;
  integration_id: string;
  credential_name: string;
  credential_type: string;
  last_test_status: 'not_tested' | 'success' | 'failed' | 'testing';
  created_at: string;
  updated_at: string;
}
