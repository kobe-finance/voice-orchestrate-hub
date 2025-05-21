
import React, { useState } from 'react';
import { Role, Permission } from '@/types/user';
import { roles, permissions } from '@/data/user-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/sonner';
import * as z from 'zod';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';

export const RoleManagement = () => {
  const [rolesData, setRolesData] = useState<Role[]>(roles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showCreateRole, setShowCreateRole] = useState(false);
  
  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
  };
  
  const handleDeleteRole = (roleId: string) => {
    if (rolesData.find(r => r.id === roleId)?.isSystem) {
      toast.error("Cannot delete a system role");
      return;
    }
    
    setRolesData(rolesData.filter(r => r.id !== roleId));
    toast.success("Role deleted successfully");
  };
  
  const handleSaveRole = (role: Role) => {
    setRolesData(prev => 
      prev.map(r => r.id === role.id ? role : r)
    );
    setSelectedRole(null);
    toast.success("Role updated successfully");
  };
  
  const handleCreateRole = (role: Omit<Role, 'id'>) => {
    const newId = `role-${Date.now()}`;
    const newRole: Role = {
      id: newId,
      ...role
    };
    
    setRolesData([...rolesData, newRole]);
    setShowCreateRole(false);
    toast.success("Role created successfully");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowCreateRole(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>
      
      <div className="grid gap-4">
        {rolesData.map((role) => (
          <RoleCard 
            key={role.id} 
            role={role} 
            permissions={permissions}
            onEdit={handleEditRole} 
            onDelete={handleDeleteRole}
          />
        ))}
      </div>
      
      {selectedRole && (
        <RoleDialog
          mode="edit"
          role={selectedRole}
          permissions={permissions}
          onClose={() => setSelectedRole(null)}
          onSave={handleSaveRole}
        />
      )}
      
      {showCreateRole && (
        <RoleDialog
          mode="create"
          permissions={permissions}
          onClose={() => setShowCreateRole(false)}
          onSave={handleCreateRole}
        />
      )}
    </div>
  );
};

interface RoleCardProps {
  role: Role;
  permissions: Permission[];
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
}

const RoleCard = ({ role, permissions, onEdit, onDelete }: RoleCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const rolePermissions = permissions.filter(p => role.permissions.includes(p.id));
  const permissionsByCategory = rolePermissions.reduce<Record<string, Permission[]>>((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});
  
  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="flex items-center justify-between p-4">
          <div>
            <h3 className="font-medium text-lg">{role.name}</h3>
            <p className="text-sm text-muted-foreground">{role.description}</p>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => onEdit(role)}>
              <Edit className="h-4 w-4" />
            </Button>
            
            {!role.isSystem && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDelete(role.id)}
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            )}
            
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? 'Hide Permissions' : 'View Permissions'}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        
        <CollapsibleContent>
          <div className="p-4 pt-0 border-t">
            <h4 className="font-medium mb-2">Permissions</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(permissionsByCategory).map(([category, perms]) => (
                <div key={category} className="border rounded-md p-3">
                  <h5 className="font-medium text-sm mb-2">{category}</h5>
                  <ul className="space-y-1">
                    {perms.map(perm => (
                      <li key={perm.id} className="text-sm">{perm.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

interface RoleDialogProps {
  mode: 'create' | 'edit';
  role?: Role;
  permissions: Permission[];
  onClose: () => void;
  onSave: (role: any) => void;
}

const roleFormSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string(),
  permissions: z.array(z.string()).min(1, "At least one permission is required"),
});

const RoleDialog = ({ mode, role, permissions, onClose, onSave }: RoleDialogProps) => {
  const form = useForm<z.infer<typeof roleFormSchema>>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: role?.name || '',
      description: role?.description || '',
      permissions: role?.permissions || [],
    },
  });
  
  const handleSubmit = (values: z.infer<typeof roleFormSchema>) => {
    if (mode === 'edit' && role) {
      onSave({
        ...role,
        ...values
      });
    } else {
      onSave(values);
    }
  };
  
  // Group permissions by category
  const permissionsByCategory = permissions.reduce<Record<string, Permission[]>>((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create Role' : 'Edit Role'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={role?.isSystem} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={role?.isSystem} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel>Permissions</FormLabel>
              <div className="border rounded-md p-4 mt-2 max-h-[300px] overflow-y-auto">
                {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
                  <div key={category} className="mb-4 last:mb-0">
                    <h4 className="font-medium mb-2">{category}</h4>
                    <div className="space-y-2 pl-4">
                      {categoryPermissions.map((permission) => (
                        <FormField
                          key={permission.id}
                          control={form.control}
                          name="permissions"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value.includes(permission.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedPermissions = checked
                                      ? [...field.value, permission.id]
                                      : field.value.filter((id) => id !== permission.id);
                                    field.onChange(updatedPermissions);
                                  }}
                                  disabled={role?.isSystem}
                                />
                              </FormControl>
                              <div>
                                <FormLabel className="font-normal mb-0">{permission.name}</FormLabel>
                                <p className="text-xs text-muted-foreground">{permission.description}</p>
                              </div>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <FormMessage className="mt-1">
                {form.formState.errors.permissions?.message}
              </FormMessage>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button 
                type="submit"
                disabled={role?.isSystem}
              >
                {mode === 'create' ? 'Create Role' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
