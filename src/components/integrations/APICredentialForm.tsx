
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { Shield, Loader2 } from "lucide-react";
import { Integration } from "@/services/credentialService";

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Credential name must be at least 3 characters.",
  }),
  value: z.string().min(1, {
    message: "API key/value is required.",
  }),
});

interface APICredentialFormProps {
  integration: Integration;
  onSubmit: (values: { name: string; value: string; credentialKey: string }) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export const APICredentialForm = ({
  integration,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: APICredentialFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      value: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Determine the credential key based on auth type
      const credentialKey = integration.auth_type === 'api_key' ? 'api_key' : 'token';
      
      await onSubmit({
        name: values.name,
        value: values.value,
        credentialKey,
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCancel) {
      onCancel();
    }
  };

  const getPlaceholder = () => {
    switch (integration.auth_type) {
      case 'api_key':
        return integration.slug === 'openai' ? 'sk-...' : 'Enter your API key';
      default:
        return 'Enter your credential value';
    }
  };

  const getFieldLabel = () => {
    switch (integration.auth_type) {
      case 'api_key':
        return 'API Key';
      default:
        return 'Credential Value';
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Credential Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder={`My ${integration.name} Key`} 
                  {...field} 
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                A descriptive name to identify this credential.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {getFieldLabel()}
                <Shield className="inline-block ml-2 h-4 w-4 text-muted-foreground" />
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={getPlaceholder()}
                  {...field}
                  autoComplete="off"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Your credential is encrypted at rest and never exposed in the UI.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="gap-2">
          <Button 
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Adding & Testing...' : 'Add Credential'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
