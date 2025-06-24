
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Lock, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const passwordResetSchema = z.object({
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [samePasswordError, setSamePasswordError] = useState(false);

  const form = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const validateResetToken = async () => {
      // Check if this is a password reset callback
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const tokenType = hashParams.get('type');
      
      console.log('Password reset validation - URL hash params:', {
        accessToken: accessToken ? 'present' : 'missing',
        tokenType,
        fullHash: window.location.hash
      });
      
      if (accessToken && tokenType === 'recovery') {
        try {
          // Let Supabase handle the session from the URL
          const { data, error } = await supabase.auth.getSession();
          
          if (error || !data.session) {
            console.error('Error validating reset token:', error);
            setIsValidToken(false);
            toast.error('Invalid or expired reset link. Please request a new password reset.');
            setTimeout(() => navigate('/forgot-password'), 3000);
            return;
          }

          console.log('Password reset session established');
          setIsValidToken(true);
          // Clear the URL hash to clean up the URL
          window.history.replaceState(null, '', window.location.pathname);
        } catch (error) {
          console.error('Password reset validation error:', error);
          setIsValidToken(false);
          toast.error('Something went wrong. Please try again.');
          setTimeout(() => navigate('/forgot-password'), 3000);
        }
      } else {
        // No valid reset token found
        setIsValidToken(false);
        toast.error('No valid reset token found. Please request a new password reset.');
        setTimeout(() => navigate('/forgot-password'), 3000);
      }
    };

    validateResetToken();
  }, [navigate]);

  const onSubmit = async (values: PasswordResetFormData) => {
    setIsLoading(true);
    setSamePasswordError(false);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });
      
      if (error) {
        // Check if it's a "same password" error
        if (error.message?.includes('same password') || error.message?.includes('should be different')) {
          setSamePasswordError(true);
          toast.error('New password must be different from your current password.');
          return;
        }
        
        toast.error('Failed to update password. Please try again.');
        console.error('Password update error:', error);
        return;
      }
      
      setIsSuccess(true);
      toast.success('Password updated successfully!');
      
      // Sign out the user to ensure they use the new password
      await supabase.auth.signOut();
      
      // Redirect to login after success
      setTimeout(() => {
        navigate('/auth', { 
          state: { 
            message: 'Password updated successfully. Please sign in with your new password.',
            tab: 'login'
          } 
        });
      }, 2000);
      
    } catch (error) {
      toast.error('Failed to update password. Please try again.');
      console.error('Password update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  if (isValidToken === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (isValidToken === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-red-600">Invalid Reset Link</CardTitle>
              <CardDescription>
                This password reset link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Redirecting you to request a new password reset...
              </p>
              <Button onClick={() => navigate('/forgot-password')} className="w-full">
                Request New Reset Link
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="grid lg:grid-cols-2 min-h-screen">
        <div className="hidden lg:flex flex-col justify-center items-center px-12 bg-gradient-to-br from-primary/5 to-accent-orange/5">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md text-center space-y-6"
          >
            <div className="text-4xl font-bold">
              VoiceOrchestrate<span className="text-accent-orange">™</span>
            </div>
            <h2 className="text-2xl font-semibold text-muted-foreground">
              Reset Your Password
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Create a new secure password for your account.
            </p>
          </motion.div>
        </div>

        <div className="flex items-center justify-center px-6 py-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-lg"
          >
            <Card className="shadow-xl border-0">
              <CardHeader className="space-y-1 text-center pb-6">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="lg:hidden text-2xl font-bold mb-2">
                    VoiceOrchestrate<span className="text-accent-orange">™</span>
                  </div>
                  {isSuccess ? (
                    <>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-green-600">Password Updated!</CardTitle>
                      <CardDescription className="text-base">
                        Your password has been successfully updated. Redirecting to login...
                      </CardDescription>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-blue-600" />
                      </div>
                      <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                      <CardDescription className="text-base">
                        Enter your new password below
                      </CardDescription>
                    </>
                  )}
                </motion.div>
              </CardHeader>
              
              {!isSuccess && (
                <CardContent className="space-y-6">
                  {samePasswordError && (
                    <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-700 dark:text-orange-300">
                        Your new password must be different from your current password. Please choose a password you haven't used recently.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">New Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter your new password"
                                autoComplete="new-password"
                                className="h-12 text-base"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Confirm New Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Confirm your new password"
                                autoComplete="new-password"
                                className="h-12 text-base"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full h-12 text-base font-medium"
                        disabled={isLoading || !form.formState.isValid}
                      >
                        {isLoading ? "Updating Password..." : "Update Password"}
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="text-center">
                    <Button
                      variant="link"
                      onClick={() => navigate('/auth')}
                      className="text-base"
                    >
                      Back to Login
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
