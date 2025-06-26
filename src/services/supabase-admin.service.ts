
import { supabase } from '@/integrations/supabase/client';
import type { SupabaseAdminUser } from '@/types/supabase-admin.types';

/**
 * Type-safe wrapper around Supabase Admin API
 * 
 * TODO: Future improvements
 * - Add comprehensive tests
 * - Consider Result<T,E> pattern for better error handling
 * - Add monitoring for API failures
 * - Expand type definitions as needed
 */
export class SupabaseAdminService {
  /**
   * Lists all users from Supabase Auth
   * @returns Array of users or null on error
   */
  static async listUsers(): Promise<SupabaseAdminUser[] | null> {
    try {
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        console.error('[SupabaseAdminService] listUsers API error:', error);
        return null;
      }

      if (!data?.users || !Array.isArray(data.users)) {
        console.warn('[SupabaseAdminService] listUsers returned invalid data structure');
        return null;
      }
      
      // Type assertion with runtime validation
      return data.users as SupabaseAdminUser[];
    } catch (error) {
      console.error('[SupabaseAdminService] listUsers exception:', error);
      return null;
    }
  }
  
  /**
   * Checks if an email exists in Supabase Auth users
   * @param email - Email to check (case insensitive)
   * @returns true if email exists, false otherwise (including on errors)
   */
  static async emailExists(email: string): Promise<boolean> {
    const users = await this.listUsers();
    if (!users) {
      console.warn('[SupabaseAdminService] emailExists: Could not retrieve users list');
      return false; // Fail gracefully
    }
    
    return users.some(user => 
      user.email && user.email.toLowerCase() === email.toLowerCase()
    );
  }

  /**
   * Gets user by email with confirmation status
   * @param email - Email to search for
   * @returns User object with confirmation status or null
   */
  static async getUserByEmail(email: string): Promise<{
    user: SupabaseAdminUser;
    isConfirmed: boolean;
  } | null> {
    const users = await this.listUsers();
    if (!users) return null;
    
    const user = users.find(u => 
      u.email && u.email.toLowerCase() === email.toLowerCase()
    );
    
    if (!user) return null;
    
    return {
      user,
      isConfirmed: !!user.email_confirmed_at
    };
  }
}
