
import React, { ReactNode } from 'react';
import { usePermissions } from '@/hooks/use-permissions';

interface PermissionGuardProps {
  permissionId?: string;
  anyPermissions?: string[];
  allPermissions?: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGuard = ({
  permissionId,
  anyPermissions,
  allPermissions,
  children,
  fallback = null
}: PermissionGuardProps) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isLoading } = usePermissions();
  
  if (isLoading) {
    return null; // Or a loading indicator
  }
  
  let hasAccess = true;
  
  if (permissionId && !hasPermission(permissionId)) {
    hasAccess = false;
  }
  
  if (anyPermissions && !hasAnyPermission(anyPermissions)) {
    hasAccess = false;
  }
  
  if (allPermissions && !hasAllPermissions(allPermissions)) {
    hasAccess = false;
  }
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
