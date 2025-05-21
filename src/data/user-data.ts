
import { Permission, Role, User, ActivityLog } from "@/types/user";

// Permissions
export const permissions: Permission[] = [
  {
    id: "voice-agents-view",
    name: "View Voice Agents",
    description: "Can view voice agent details",
    category: "Voice Agents",
  },
  {
    id: "voice-agents-create",
    name: "Create Voice Agents",
    description: "Can create new voice agents",
    category: "Voice Agents",
  },
  {
    id: "voice-agents-edit",
    name: "Edit Voice Agents",
    description: "Can modify voice agent settings",
    category: "Voice Agents",
  },
  {
    id: "voice-agents-delete",
    name: "Delete Voice Agents",
    description: "Can delete voice agents",
    category: "Voice Agents",
  },
  {
    id: "documents-view",
    name: "View Documents",
    description: "Can view documents",
    category: "Documents",
  },
  {
    id: "documents-upload",
    name: "Upload Documents",
    description: "Can upload new documents",
    category: "Documents",
  },
  {
    id: "documents-delete",
    name: "Delete Documents",
    description: "Can delete documents",
    category: "Documents",
  },
  {
    id: "analytics-view",
    name: "View Analytics",
    description: "Can view analytics dashboards",
    category: "Analytics",
  },
  {
    id: "reports-view",
    name: "View Reports",
    description: "Can view reports",
    category: "Reports",
  },
  {
    id: "reports-create",
    name: "Create Reports",
    description: "Can create new reports",
    category: "Reports",
  },
  {
    id: "integrations-manage",
    name: "Manage Integrations",
    description: "Can manage system integrations",
    category: "Integrations",
  },
  {
    id: "users-view",
    name: "View Users",
    description: "Can view user accounts",
    category: "User Management",
  },
  {
    id: "users-create",
    name: "Create Users",
    description: "Can create new user accounts",
    category: "User Management",
  },
  {
    id: "users-edit",
    name: "Edit Users",
    description: "Can edit user accounts",
    category: "User Management",
  },
  {
    id: "roles-manage",
    name: "Manage Roles",
    description: "Can manage system roles",
    category: "User Management",
  },
];

// Roles
export const roles: Role[] = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full system access",
    permissions: permissions.map(p => p.id),
    isSystem: true,
  },
  {
    id: "manager",
    name: "Manager",
    description: "Can manage voice agents and view analytics",
    permissions: [
      "voice-agents-view",
      "voice-agents-create",
      "voice-agents-edit",
      "documents-view",
      "documents-upload",
      "analytics-view",
      "reports-view",
      "reports-create",
      "users-view",
    ],
  },
  {
    id: "agent",
    name: "Agent",
    description: "Basic access to voice agents",
    permissions: [
      "voice-agents-view",
      "documents-view",
    ],
  },
  {
    id: "analyst",
    name: "Analyst",
    description: "Access to analytics and reports",
    permissions: [
      "analytics-view",
      "reports-view",
      "reports-create",
    ],
  },
];

// Users
export const users: User[] = [
  {
    id: "1",
    email: "admin@voiceorchestrate.com",
    firstName: "Admin",
    lastName: "User",
    roleIds: ["admin"],
    isActive: true,
    createdAt: "2024-01-15T10:30:00Z",
    lastLogin: "2024-05-20T08:45:12Z",
  },
  {
    id: "2",
    email: "manager@voiceorchestrate.com",
    firstName: "Alex",
    lastName: "Johnson",
    roleIds: ["manager"],
    isActive: true,
    createdAt: "2024-01-20T14:20:00Z",
    lastLogin: "2024-05-19T16:30:05Z",
  },
  {
    id: "3",
    email: "sarah@voiceorchestrate.com",
    firstName: "Sarah",
    lastName: "Williams",
    roleIds: ["agent"],
    isActive: true,
    createdAt: "2024-02-10T09:15:00Z",
    lastLogin: "2024-05-20T09:10:22Z",
  },
  {
    id: "4",
    email: "michael@voiceorchestrate.com",
    firstName: "Michael",
    lastName: "Brown",
    roleIds: ["agent"],
    isActive: true,
    createdAt: "2024-02-15T11:45:00Z",
    lastLogin: "2024-05-18T14:22:18Z",
  },
  {
    id: "5",
    email: "jessica@voiceorchestrate.com",
    firstName: "Jessica",
    lastName: "Davis",
    roleIds: ["analyst"],
    isActive: true,
    createdAt: "2024-03-05T13:10:00Z",
    lastLogin: "2024-05-20T10:05:33Z",
  },
  {
    id: "6",
    email: "david@voiceorchestrate.com",
    firstName: "David",
    lastName: "Miller",
    roleIds: ["analyst", "agent"],
    isActive: false,
    createdAt: "2024-03-10T10:00:00Z",
    lastLogin: "2024-04-15T11:30:45Z",
  },
];

// Activity Logs
export const activityLogs: ActivityLog[] = [
  {
    id: "1",
    userId: "1",
    action: "User Create",
    details: "Created user account for Jessica Davis",
    timestamp: "2024-05-18T14:30:22Z",
  },
  {
    id: "2",
    userId: "1",
    action: "Role Modify",
    details: "Updated permissions for Manager role",
    timestamp: "2024-05-18T14:35:10Z",
  },
  {
    id: "3",
    userId: "2",
    action: "Login",
    details: "User logged in from IP 192.168.1.45",
    timestamp: "2024-05-19T16:30:05Z",
  },
  {
    id: "4",
    userId: "1",
    action: "User Deactivate",
    details: "Deactivated user account for David Miller",
    timestamp: "2024-05-19T17:15:33Z",
  },
  {
    id: "5",
    userId: "3",
    action: "Login",
    details: "User logged in from IP 192.168.1.62",
    timestamp: "2024-05-20T09:10:22Z",
  },
];

// Helper functions
export function getUserWithRoles(userId: string) {
  const user = users.find(u => u.id === userId);
  if (!user) return null;
  
  const userRoles = roles.filter(role => user.roleIds.includes(role.id));
  
  return {
    ...user,
    roles: userRoles
  };
}

export function getAllUsersWithRoles() {
  return users.map(user => {
    const userRoles = roles.filter(role => user.roleIds.includes(role.id));
    return {
      ...user,
      roles: userRoles
    };
  });
}

export function getUserPermissions(userId: string): string[] {
  const user = users.find(u => u.id === userId);
  if (!user) return [];
  
  const userRoles = roles.filter(role => user.roleIds.includes(role.id));
  const permissionIds = new Set<string>();
  
  userRoles.forEach(role => {
    role.permissions.forEach(permId => {
      permissionIds.add(permId);
    });
  });
  
  return Array.from(permissionIds);
}
