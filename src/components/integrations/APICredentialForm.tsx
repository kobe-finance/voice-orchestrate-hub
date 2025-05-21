import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Shield } from "lucide-react";

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Credential name must be at least 3 characters.",
  }),
  value: z.string().min(1, {
    message: "API key/value is required.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  subCategory: z.string().min(1, {
    message: "Please enter a provider/model name.",
  }),
});

const categories = [
  { value: "llm", label: "Large Language Model" },
  { value: "voice", label: "Voice Processing" },
  { value: "telephony", label: "Telephony" },
  { value: "crm", label: "CRM" },
  { value: "email", label: "Email Marketing" },
  { value: "calendar", label: "Calendar" },
  { value: "accounting", label: "Accounting" },
  { value: "webhook", label: "Webhook" },
];

interface APICredentialFormProps {
  initialValues?: any;
  onSubmit: (values: any) => void;
  isEditing?: boolean;
}

export const APICredentialForm = ({
  initialValues,
  onSubmit,
  isEditing = false,
}: APICredentialFormProps) => {
  // Set up form with initial values if editing
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
      ? {
          name: initialValues.name,
          value: "", // Don't show the actual value when editing
          category: initialValues.category,
          subCategory: initialValues.subCategory,
        }
      : {
          name: "",
          value: "",
          category: "",
          subCategory: "",
        },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // If editing and no new value provided, keep the old value
    if (isEditing && !values.value) {
      onSubmit({
        ...values,
        value: initialValues.value,
      });
    } else {
      // Mask the credential value for display
      const maskedValue = values.value.substring(0, 2) + "-" + "•".repeat(20);
      onSubmit({
        ...values,
        value: maskedValue,
        lastUsed: new Date().toISOString(),
      });
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
                <Input placeholder="OpenAI API Key" {...field} />
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
                API Key/Secret Value
                <Shield className="inline-block ml-2 h-4 w-4 text-muted-foreground" />
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={isEditing ? "Leave blank to keep current value" : "sk-..."}
                  {...field}
                  autoComplete="off"
                />
              </FormControl>
              <FormDescription>
                Your credential is encrypted at rest and never exposed in the UI.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provider/Model</FormLabel>
                <FormControl>
                  <Input placeholder="OpenAI, Twilio, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="submit">
            {isEditing ? "Save Changes" : "Add Credential"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
