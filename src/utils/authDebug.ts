
import { supabase } from '@/integrations/supabase/client';

/**
 * Debug utility to verify JWT contents after registration
 * This helps ensure tenant_id is properly included in the JWT
 */
export const verifyJWTContents = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    
    if (!session) {
      console.log('No active session');
      return null;
    }
    
    // Parse JWT payload (base64 decode the middle part)
    const jwt = session.access_token;
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    
    console.log('🔍 JWT Debug Information:');
    console.log('User ID:', payload.sub);
    console.log('Email:', payload.email);
    console.log('User Metadata:', payload.user_metadata);
    console.log('App Metadata:', payload.app_metadata);
    
    // Check for tenant_id in user metadata
    const tenantId = payload.user_metadata?.tenant_id;
    if (tenantId) {
      console.log('✅ tenant_id found in JWT:', tenantId);
    } else {
      console.warn('⚠️ tenant_id NOT found in JWT metadata');
    }
    
    return {
      userId: payload.sub,
      email: payload.email,
      tenantId: tenantId,
      userMetadata: payload.user_metadata,
      appMetadata: payload.app_metadata,
      hasValidTenantId: !!tenantId
    };
    
  } catch (error) {
    console.error('Error verifying JWT contents:', error);
    return null;
  }
};

/**
 * Utility to check if user has organization membership
 */
export const verifyOrganizationMembership = async (userId: string) => {
  try {
    const { data: membership, error } = await supabase
      .from('organization_members')
      .select(`
        id,
        role,
        is_active,
        organization_id,
        organizations (
          id,
          name,
          slug
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('Error checking membership:', error);
      return null;
    }
    
    console.log('🏢 Organization Membership:', membership);
    return membership;
    
  } catch (error) {
    console.error('Error verifying organization membership:', error);
    return null;
  }
};
