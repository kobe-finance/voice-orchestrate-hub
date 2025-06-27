
// Organization utility functions
export const generateSlug = (companyName: string): string => {
  let slug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Handle empty slug
  if (!slug) {
    slug = 'organization';
  }
  
  // Add random suffix to ensure uniqueness
  slug += '-' + Math.random().toString(36).substring(2, 6);
  
  return slug;
};

// Ensure user has an organization (for orphaned users)
export const ensureUserHasOrganization = async (userId: string) => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  // Check if user has organization
  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (membership?.organization_id) {
    return membership.organization_id;
  }

  // Use the SQL function to create organization for orphaned users
  const { data: orgId, error } = await supabase
    .rpc('ensure_user_has_organization', {
      p_user_id: userId
    });
    
  if (error) {
    console.error('Failed to ensure user has organization:', error);
    throw error;
  }
  
  return orgId;
};
