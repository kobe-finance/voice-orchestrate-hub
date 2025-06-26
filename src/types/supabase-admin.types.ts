
/**
 * Minimal Supabase Admin API types
 * TODO: Expand as needed when more admin API features are used
 */
export interface SupabaseAdminUser {
  id: string;
  email?: string;
  email_confirmed_at?: string | null;
  created_at?: string;
}

export interface SupabaseAdminListUsersResponse {
  users: SupabaseAdminUser[];
  aud?: string;
}
