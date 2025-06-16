
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card-modern";
import { Button } from "@/components/ui/button-modern";
import { Input } from "@/components/ui/input-modern";
import { ModernForm, FormField, FormActions } from "@/components/ui/form-modern";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";

const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { isLoading, setLoading } = useAppStore();
  
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Password reset requested for:", values.email);
      toast.success("Password reset instructions have been sent to your email");
      setTimeout(() => navigate("/auth"), 2000);
    } catch (error) {
      toast.error("Failed to send reset instructions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Card variant="elevated" className="w-full max-w-md">
          <div className="p-6">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-center mb-6"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Enter your email address and we'll send you instructions to reset your password
              </p>
            </motion.div>

            <ModernForm onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                label="Email Address"
                error={form.formState.errors.email?.message}
                required
              >
                <Input
                  {...form.register("email")}
                  placeholder="your@email.com"
                  type="email"
                  autoComplete="email"
                  leftIcon={<Mail className="h-4 w-4" />}
                />
              </FormField>

              <FormActions align="center">
                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full"
                  loading={isLoading}
                  disabled={!form.formState.isValid}
                >
                  Send Reset Instructions
                </Button>
              </FormActions>
            </ModernForm>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/auth")}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
                disabled={isLoading}
              >
                Back to Login
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
