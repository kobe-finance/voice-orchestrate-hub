
import React, { useState } from 'react';
import { User, Role } from '@/types/user';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface UserDetailDialogProps {
  user: User;
  roles: Role[];
  onClose: () => void;
  onSave: (user: User) => void;
}

const userFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  isActive: z.boolean(),
  roleIds: z.array(z.string()).min(1, "At least one role is required"),
});

export const UserDetailDialog = ({ user, roles, onClose, onSave }: UserDetailDialogProps) => {
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive,
      roleIds: user.roleIds,
    },
  });
  
  const handleSubmit = (values: z.infer<typeof userFormSchema>) => {
    const updatedUser = {
      ...user,
      ...values,
    };
    
    onSave(updatedUser);
    toast.success("User updated successfully");
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Active Account
                  </FormLabel>
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel>Assigned Roles</FormLabel>
              <div className="space-y-2 border rounded-md p-4 mt-2">
                {roles.map((role) => (
                  <FormField
                    key={role.id}
                    control={form.control}
                    name="roleIds"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value.includes(role.id)}
                            onCheckedChange={(checked) => {
                              const updatedRoles = checked
                                ? [...field.value, role.id]
                                : field.value.filter((id) => id !== role.id);
                              field.onChange(updatedRoles);
                            }}
                          />
                        </FormControl>
                        <div>
                          <FormLabel className="font-medium mb-0">{role.name}</FormLabel>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage className="mt-1">
                {form.formState.errors.roleIds?.message}
              </FormMessage>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
