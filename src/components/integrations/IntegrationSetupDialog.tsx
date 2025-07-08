
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { integrationAPI } from "@/services/integrationAPI";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { IntegrationFormSchema, FormField } from "@/types/integration.types";

interface IntegrationSetupDialogProps {
  integration: any;
  isOpen: boolean;
  onClose: () => void;
}

export const IntegrationSetupDialog: React.FC<IntegrationSetupDialogProps> = ({
  integration,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  // Get form schema from backend with proper typing
  const { data: schema, isLoading: schemaLoading } = useQuery<IntegrationFormSchema>({
    queryKey: ['form-schema', integration?.id],
    queryFn: () => integrationAPI.getFormSchema(integration.id),
    enabled: !!integration?.id,
  });

  // Create credential mutation
  const createCredentialMutation = useMutation({
    mutationFn: (data: any) => integrationAPI.createCredential(data),
    onSuccess: () => {
      toast.success("Integration connected successfully!");
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
      onClose();
      setFormData({});
    },
    onError: (error: any) => {
      toast.error(`Failed to connect: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const credentialData = {
      integration_id: integration.id,
      credential_name: formData.credential_name || `${integration.name} Key`,
      credentials: { ...formData },
    };

    createCredentialMutation.mutate(credentialData);
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  if (!integration) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect {integration.name}</DialogTitle>
          <DialogDescription>
            Enter your credentials to connect to {integration.name}
          </DialogDescription>
        </DialogHeader>

        {schemaLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {schema?.fields?.map((field: FormField) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && " *"}
                </Label>
                <Input
                  id={field.name}
                  type={field.type === 'password' ? 'password' : 'text'}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  required={field.required}
                />
              </div>
            ))}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createCredentialMutation.isPending}
              >
                {createCredentialMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
