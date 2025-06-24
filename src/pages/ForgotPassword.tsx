
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModernForm, FormItem, FormActions } from "@/components/ui/form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Clock } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { supabase } from "@/integrations/supabase/client";

const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { isLoading, setLoading } = useAppStore();
  const [lastRequestTime, setLastRequestTime] = useState<number | null>(null);
  const [remainingCooldown, setRemainingCooldown] = useState(0);
  
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  // Rate limiting: 30 seconds between requests
  const checkRateLimit = () => {
    if (!lastRequestTime) return true;
    
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    const cooldownPeriod = 30000; // 30 seconds
    
    if (timeSinceLastRequest < cooldownPeriod) {
      const remaining = Math.ceil((cooldownPeriod - timeSinceLastRequest) / 1000);
      setRemainingCooldown(remaining);
      return false;
    }
    
    return true;
  };

  // Update countdown timer
  React.useEffect(() => {
    if (remainingCooldown > 0) {
      const timer = setTimeout(() => {
        setRemainingCooldown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [remainingCooldown]);

  const onSubmit = async (values: ForgotPasswordFormData) => {
    // Check rate limiting
    if (!checkRateLimit()) {
      toast.error(`Please wait ${remainingCooldown} seconds before requesting another reset`);
      return;
    }

    setLoading(true);
    try {
      console.log("Sending password reset request for:", values.email);
      
      // Use the correct Lovable project URL
      const redirectUrl = "https://lovable.dev/projects/8fd8949c-9dd4-4889-9f32-e6b6e177fb3e/auth";
      
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error("Password reset error:", error);
        
        // Handle specific Supabase errors with user-friendly messages
        if (error.message.includes('rate limit')) {
          toast.error("Too many reset requests. Please wait a few minutes before trying again.");
        } else if (error.message.includes('email not found') || error.message.includes('user not found')) {
          toast.error("Please double check your email address and try again.");
        } else {
          toast.error("Please double check your email address and try again.");
        }
        throw error;
      }

      // Set rate limiting timestamp
      setLastRequestTime(Date.now());
      
      console.log("Password reset email sent successfully");
      toast.success("Password reset instructions have been sent to your email");
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
      
    } catch (error) {
      console.error("Password reset failed:", error);
      // Error already handled above, don't show additional toast
    } finally {
      setLoading(false);
    }
  };

  const isRateLimited = remainingCooldown > 0;

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
              <FormItem
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
                  disabled={isLoading || isRateLimited}
                />
              </FormItem>

              {isRateLimited && (
                <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-sm text-orange-700 dark:text-orange-300">
                  <Clock className="h-4 w-4" />
                  <span>Please wait {remainingCooldown} seconds before trying again</span>
                </div>
              )}

              <FormActions align="center">
                <Button
                  type="submit"
                  variant="gradient"
                  size="sm"
                  className="w-full"
                  loading={isLoading}
                  disabled={!form.formState.isValid || isRateLimited}
                >
                  Send Reset Instructions
                </Button>
              </FormActions>
            </ModernForm>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                size="sm"
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
