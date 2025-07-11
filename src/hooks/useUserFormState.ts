import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Role, User } from '@/types/user';

const createUserFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  isActive: z.boolean().default(true),
  roleIds: z.array(z.string()).min(1, "At least one role is required"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;

export const useUserFormState = (user?: User) => {
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
      isActive: user?.isActive ?? true,
      roleIds: user?.roleIds || [],
    },
  });

  const transformForSave = (values: CreateUserFormValues): Omit<User, 'id' | 'createdAt'> => {
    return {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      isActive: values.isActive,
      roleIds: values.roleIds,
    };
  };

  const handleRoleToggle = (roleId: string, currentRoles: string[]) => {
    return currentRoles.includes(roleId)
      ? currentRoles.filter(id => id !== roleId)
      : [...currentRoles, roleId];
  };

  return {
    form,
    transformForSave,
    handleRoleToggle
  };
};