
import { useState, useEffect } from 'react';
import { getUserPermissions } from '@/data/user-data';

// In a real app, this would be integrated with auth system
const CURRENT_USER_ID = "1"; // Admin user by default

export function usePermissions() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be a proper API call
    const userPermissions = getUserPermissions(CURRENT_USER_ID);
    setPermissions(userPermissions);
    setIsLoading(false);
  }, []);
  
  const hasPermission = (permissionId: string): boolean => {
    return permissions.includes(permissionId);
  };
  
  const hasAnyPermission = (permissionIds: string[]): boolean => {
    return permissionIds.some(id => permissions.includes(id));
  };
  
  const hasAllPermissions = (permissionIds: string[]): boolean => {
    return permissionIds.every(id => permissions.includes(id));
  };
  
  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoading
  };
}
