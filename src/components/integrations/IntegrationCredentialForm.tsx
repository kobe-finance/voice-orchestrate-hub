
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, ExternalLink } from 'lucide-react';
import type { Integration, ConfigField } from '@/types/integration';

interface IntegrationCredentialFormProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    integration_id: string;
    credential_name: string;
    credentials: Record<string, string>;
    credential_type: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

const IntegrationCredentialForm: React.FC<IntegrationCredentialFormProps> = ({
  integration,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Build dynamic schema based on integration config
  const buildSchema = () => {
    const schemaObj: Record<string, any> = {
      credential_name: z.string().min(1, 'Credential name is required'),
    };

    if (integration.config_schema?.fields) {
      integration.config_schema.fields.forEach((field: ConfigField) => {
        let fieldSchema = z.string();
        
        if (field.required) {
          fieldSchema = fieldSchema.min(1, `${field.label} is required`);
        } else {
          fieldSchema = fieldSchema.optional();
        }
        
        schemaObj[field.name] = fieldSchema;
      });
    }

    return z.object(schemaObj);
  };

  const schema = buildSchema();
  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      credential_name: `${integration.name} - Primary`,
    },
  });

  const handleSubmit = async (data: FormData) => {
    const { credential_name, ...credentials } = data;
    
    await onSubmit({
      integration_id: integration.id,
      credential_name,
      credentials: credentials as Record<string, string>,
      credential_type: 'api_key', // Default for now
    });
    
    form.reset();
    onClose();
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const renderField = (field: ConfigField) => {
    if (field.type === 'select') {
      return (
        <FormField
          key={field.name}
          control={form.control}
          name={field.name as keyof FormData}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label} {field.required && '*'}</FormLabel>
              <Select onValueChange={formField.onChange} defaultValue={field.default}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${field.label}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {field.options?.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>{field.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    const isPasswordField = field.name.toLowerCase().includes('key') || 
                           field.name.toLowerCase().includes('secret') ||
                           field.name.toLowerCase().includes('password');

    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name as keyof FormData}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>{field.label} {field.required && '*'}</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  {...formField}
                  type={isPasswordField && !showPasswords[field.name] ? 'password' : 'text'}
                  placeholder={field.description}
                  className={isPasswordField ? 'pr-10' : ''}
                />
                {isPasswordField && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility(field.name)}
                  >
                    {showPasswords[field.name] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </FormControl>
            <FormDescription>{field.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add {integration.name} Credentials</DialogTitle>
          <DialogDescription>
            Connect your {integration.name} account to enable this integration.
            {integration.documentation_url && (
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto ml-1"
                onClick={() => window.open(integration.documentation_url!, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View setup guide
              </Button>
            )}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="credential_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credential Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Production API" />
                  </FormControl>
                  <FormDescription>
                    A name to identify this credential set
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {integration.config_schema?.fields?.map(renderField)}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Credential'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationCredentialForm;
