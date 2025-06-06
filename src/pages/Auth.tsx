
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { GoogleIcon, MicrosoftIcon } from "@/components/icons/AuthIcons";
import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/stores/useAppStore";

// Enhanced form schemas with better validation
const loginSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  firstName: z.string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z.string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number" 
    })
    .max(128, "Password must be less than 128 characters"),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

const Auth = () => {
  const navigate = useNavigate();
  const { login, register: registerUser } = useAuth();
  const { isLoading, setLoading } = useAppStore();
  
  // Form configurations with improved default values
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    mode: "onChange",
  });

  const onLoginSubmit = async (values: LoginFormData) => {
    setLoading(true);
    try {
      await login(values.email, values.password, values.rememberMe);
      toast.success("Welcome back! Login successful.");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  const onRegisterSubmit = async (values: RegisterFormData) => {
    setLoading(true);
    try {
      await registerUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });
      toast.success("Account created successfully! Please check your email for verification.");
      navigate("/onboarding");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleSSOLogin = (provider: string) => {
    setLoading(true);
    console.log(`SSO login with ${provider}`);
    toast.info(`Redirecting to ${provider} for authentication...`);
    setTimeout(() => setLoading(false), 2000);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left side - Branding/Information */}
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
              The Future of Voice AI
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Create intelligent voice agents that understand context, respond naturally, and deliver exceptional user experiences.
            </p>
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Natural conversation flows</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Advanced analytics & insights</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Seamless integrations</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right side - Auth Form */}
        <div className="flex items-center justify-center px-6 py-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
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
                  <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
                  <CardDescription className="text-base">
                    Sign in to your account or create a new one
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login" className="text-base">Login</TabsTrigger>
                    <TabsTrigger value="register" className="text-base">Register</TabsTrigger>
                  </TabsList>
                  
                  <AnimatePresence mode="wait">
                    <TabsContent value="login" className="space-y-6">
                      <motion.div
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Form {...loginForm}>
                          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                            <motion.div variants={fieldVariants}>
                              <FormField
                                control={loginForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-base">Email</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="your@email.com" 
                                        type="email"
                                        autoComplete="email"
                                        className="h-12 text-base"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </motion.div>
                            
                            <motion.div variants={fieldVariants}>
                              <FormField
                                control={loginForm.control}
                                name="password"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-base">Password</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="password" 
                                        placeholder="********"
                                        autoComplete="current-password"
                                        className="h-12 text-base"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </motion.div>
                            
                            <motion.div 
                              variants={fieldVariants}
                              className="flex items-center justify-between"
                            >
                              <FormField
                                control={loginForm.control}
                                name="rememberMe"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-base">Remember me</FormLabel>
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                variant="link"
                                onClick={handleForgotPassword}
                                className="text-base p-0"
                              >
                                Forgot password?
                              </Button>
                            </motion.div>
                            
                            <motion.div variants={fieldVariants}>
                              <Button 
                                type="submit" 
                                className="w-full h-12 text-base font-medium" 
                                disabled={isLoading || !loginForm.formState.isValid}
                              >
                                {isLoading ? "Logging in..." : "Log in"}
                              </Button>
                            </motion.div>
                          </form>
                        </Form>
                      </motion.div>
                    </TabsContent>
                    
                    <TabsContent value="register" className="space-y-6">
                      <motion.div
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Form {...registerForm}>
                          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                            <motion.div 
                              variants={fieldVariants}
                              className="grid grid-cols-2 gap-4"
                            >
                              <FormField
                                control={registerForm.control}
                                name="firstName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-base">First Name</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="John"
                                        autoComplete="given-name"
                                        className="h-12 text-base"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={registerForm.control}
                                name="lastName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-base">Last Name</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="Doe"
                                        autoComplete="family-name"
                                        className="h-12 text-base"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </motion.div>
                            
                            <motion.div variants={fieldVariants}>
                              <FormField
                                control={registerForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-base">Email</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="your@email.com"
                                        type="email"
                                        autoComplete="email"
                                        className="h-12 text-base"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </motion.div>
                            
                            <motion.div variants={fieldVariants}>
                              <FormField
                                control={registerForm.control}
                                name="password"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-base">Password</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="password" 
                                        placeholder="********"
                                        autoComplete="new-password"
                                        className="h-12 text-base"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </motion.div>
                            
                            <motion.div variants={fieldVariants}>
                              <FormField
                                control={registerForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-base">Confirm Password</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="password" 
                                        placeholder="********"
                                        autoComplete="new-password"
                                        className="h-12 text-base"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </motion.div>
                            
                            <motion.div variants={fieldVariants}>
                              <FormField
                                control={registerForm.control}
                                name="acceptTerms"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-base">
                                        I accept the <a href="/terms" className="underline">terms and conditions</a>
                                      </FormLabel>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            </motion.div>
                            
                            <motion.div variants={fieldVariants}>
                              <Button 
                                type="submit" 
                                className="w-full h-12 text-base font-medium" 
                                disabled={isLoading || !registerForm.formState.isValid}
                              >
                                {isLoading ? "Creating account..." : "Create account"}
                              </Button>
                            </motion.div>
                          </form>
                        </Form>
                      </motion.div>
                    </TabsContent>
                  </AnimatePresence>
                </Tabs>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="relative my-6"
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <Button 
                    variant="outline" 
                    onClick={() => handleSSOLogin("Google")}
                    className="flex items-center justify-center gap-2 h-12 text-base"
                    disabled={isLoading}
                  >
                    <GoogleIcon />
                    Google
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleSSOLogin("Microsoft")}
                    className="flex items-center justify-center gap-2 h-12 text-base"
                    disabled={isLoading}
                  >
                    <MicrosoftIcon />
                    Microsoft
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
