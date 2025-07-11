import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Role, Permission } from '@/types/user';

const roleFormSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string(),
  permissions: z.array(z.string()).min(1, "At least one permission is required"),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;

export const useRoleManagement = (initialRoles: Role[]) => {
  const [rolesData, setRolesData] = useState<Role[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showCreateRole, setShowCreateRole] = useState(false);

  const canDeleteRole = (role: Role) => {
    return !role.isSystem;
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
  };

  const handleDeleteRole = (roleId: string) => {
    const role = rolesData.find(r => r.id === roleId);
    if (!role || !canDeleteRole(role)) {
      return { success: false, error: "Cannot delete a system role" };
    }
    
    setRolesData(rolesData.filter(r => r.id !== roleId));
    return { success: true };
  };

  const handleSaveRole = (role: Role) => {
    setRolesData(prev => 
      prev.map(r => r.id === role.id ? role : r)
    );
    setSelectedRole(null);
    return { success: true };
  };

  const handleCreateRole = (role: Omit<Role, 'id'>) => {
    const newId = `role-${Date.now()}`;
    const newRole: Role = {
      id: newId,
      ...role
    };
    
    setRolesData([...rolesData, newRole]);
    setShowCreateRole(false);
    return { success: true, role: newRole };
  };

  const groupPermissionsByCategory = (permissions: Permission[]) => {
    return permissions.reduce<Record<string, Permission[]>>((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    }, {});
  };

  const getRolePermissions = (role: Role, allPermissions: Permission[]) => {
    return allPermissions.filter(p => role.permissions.includes(p.id));
  };

  const handlePermissionToggle = (permissionId: string, currentPermissions: string[]) => {
    return currentPermissions.includes(permissionId)
      ? currentPermissions.filter(id => id !== permissionId)
      : [...currentPermissions, permissionId];
  };

  return {
    rolesData,
    selectedRole,
    showCreateRole,
    setShowCreateRole,
    handleEditRole,
    handleDeleteRole,
    handleSaveRole,
    handleCreateRole,
    groupPermissionsByCategory,
    getRolePermissions,
    handlePermissionToggle,
    canDeleteRole
  };
};

export const useRoleFormState = (role?: Role) => {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: role?.name || '',
      description: role?.description || '',
      permissions: role?.permissions || [],
    },
  });

  const isSystemRole = role?.isSystem ?? false;

  return {
    form,
    isSystemRole
  };
};