
/**
 * User and role management types
 */

export type Permission = {
  id: string;
  name: string;
  description: string;
  category: string;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Permission IDs
  isSystem?: boolean; // System roles cannot be modified
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roleIds: string[]; // Role IDs assigned to user
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
};

export type UserWithRoles = User & {
  roles: Role[];
};

export type ActivityLog = {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
};
