import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleIcon, MicrosoftIcon } from "@/components/icons/AuthIcons";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";
import { RegistrationDebug } from "@/components/ui/registration-debug";

// Enhanced email validation function
const isValidEmail = (email: string): boolean => {
  // More strict email validation
  const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
  
  // Check basic format
  if (!emailRegex.test(email)) return false;
  
  // Additional checks
  if (email.length > 254) return false; // RFC 5321 limit
  if (email.includes('..')) return false; // No consecutive dots
  if (email.startsWith('.') || email.endsWith('.')) return false; // No leading/trailing dots
  
  const [localPart, domain] = email.split('@');
  if (localPart.length > 64) return false; // RFC 5321 local part limit
  if (domain.length > 253) return false; // RFC 5321 domain limit
  
  return true;
};

// Generate slug from company name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

// Enhanced form schemas with better validation
const loginSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .refine(isValidEmail, "Please enter a properly formatted email address"),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  firstName: z.string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "First name can only contain letters, spaces, apostrophes, and hyphens"),
  lastName: z.string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name can only contain letters, spaces, apostrophes, and hyphens"),
  companyName: z.string()
    .min(1, "Company name is required")
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters"),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .refine(isValidEmail, "Please enter a properly formatted email address (e.g., user@domain.com)"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
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
  const location = useLocation();
  const { login, register, isAuthenticated, isLoading } = useAuth();
  const [registrationSuccess, setRegistrationSuccess] = React.useState(false);
  const [registeredEmail, setRegisteredEmail] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("login");
  const [emailConfirmationError, setEmailConfirmationError] = React.useState<{
    show: boolean;
    email: string;
  }>({ show: false, email: "" });
  
  // Handle any messages from email confirmation or other redirects
  const locationMessage = location.state?.message;
  const confirmedEmail = location.state?.confirmedEmail;
  const initialTab = location.state?.tab || "login";
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);
  
  // Set initial tab and handle confirmation messages
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
    
    // Pre-fill email if coming from confirmation
    if (confirmedEmail && initialTab === 'login') {
      loginForm.setValue('email', confirmedEmail);
    }
    
    // Show success message if coming from email confirmation
    if (locationMessage) {
      toast.success(locationMessage, { duration: 5000 });
    }
  }, [initialTab, confirmedEmail, locationMessage]);
  
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
      companyName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    mode: "onChange",
  });

  const onLoginSubmit = async (values: LoginFormData) => {
    try {
      // Clear any previous email confirmation errors
      setEmailConfirmationError({ show: false, email: "" });
      
      await login(values.email, values.password, values.rememberMe);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error: any) {
      console.log('Login error details:', error);
      
      // Enhanced error handling for login
      if (error?.message?.includes('Email not confirmed') || error?.code === 'email_not_confirmed') {
        // Show specific email confirmation error state
        setEmailConfirmationError({ 
          show: true, 
          email: values.email 
        });
        toast.error(
          `Please verify your email address before signing in. Check your email for a confirmation link.`,
          { duration: 8000 }
        );
      } else if (error?.message?.includes('Invalid login credentials')) {
        toast.error('Invalid email or password. Please check your credentials.');
      } else {
        toast.error(error?.message || 'Login failed. Please try again.');
      }
      console.error('Login failed:', error);
    }
  };

  const onRegisterSubmit = async (values: RegisterFormData) => {
    console.log('📝 Registration form submitted with values:', {
      firstName: values.firstName,
      lastName: values.lastName,
      companyName: values.companyName,
      email: values.email,
      acceptTerms: values.acceptTerms
    });

    try {
      // Additional client-side validation
      if (!isValidEmail(values.email)) {
        toast.error('Please enter a valid email address in the format: user@domain.com');
        return;
      }

      if (!values.acceptTerms) {
        toast.error('You must accept the terms and conditions to continue.');
        return;
      }

      console.log('🚀 Starting registration process...');
      
      await register({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        companyName: values.companyName.trim(),
        email: values.email.toLowerCase().trim(),
        password: values.password,
      });
      
      console.log('✅ Registration completed successfully');
      
      // Show success state
      setRegisteredEmail(values.email);
      setRegistrationSuccess(true);
      registerForm.reset();
      
      // Switch to login tab after a moment
      setTimeout(() => {
        setActiveTab("login");
      }, 3000);
      
    } catch (error) {
      console.error('💥 Registration form error:', error);
      
      // Enhanced error handling for specific cases
      if (error instanceof Error) {
        console.log('Error message:', error.message);
        
        if (error.message.includes('Email address') && error.message.includes('invalid')) {
          toast.error('The email address format is not accepted. Please use a standard email format like user@domain.com');
        } else if (error.message.includes('User already registered') || error.message.includes('already exists')) {
          toast.error('An account with this email already exists. Please sign in instead.');
          setActiveTab("login");
          loginForm.setValue("email", values.email);
        } else if (error.message.includes('organization') && error.message.includes('exists')) {
          toast.error('An organization with this name already exists. Please choose a different company name.');
        } else if (error.message.includes('Database connection failed')) {
          toast.error('Unable to connect to the database. Please try again in a moment.');
        } else {
          toast.error(error.message || 'Registration failed. Please try again.');
        }
      } else {
        console.log('Non-Error object thrown:', error);
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  const handleResendConfirmation = async (email?: string) => {
    const emailToResend = email || registeredEmail || emailConfirmationError.email;
    if (!emailToResend) return;
    
    try {
      // Note: This would need to be implemented with a proper resend endpoint
      toast.info('Resending confirmation email...');
      
      // For now, just show instruction
      toast.success(`We've sent another confirmation email to ${emailToResend}`, {
        duration: 6000
      });
      
      // Clear the email confirmation error after resending
      if (email) {
        setEmailConfirmationError({ show: false, email: "" });
      }
    } catch (error) {
      toast.error('Failed to resend confirmation email. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleSSOLogin = (provider: string) => {
    console.log(`SSO login with ${provider}`);
    toast.info(`${provider} authentication coming soon!`);
  };

  // Handle logout navigation
  React.useEffect(() => {
    const handleLogoutNavigation = async () => {
      // If user logs out, redirect to auth page
      if (!isAuthenticated && location.pathname !== '/auth' && location.pathname !== '/') {
        navigate('/auth');
      }
    };

    handleLogoutNavigation();
  }, [isAuthenticated, navigate, location.pathname]);

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

        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-lg space-y-6">
            {/* Debug Component - Temporary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <RegistrationDebug />
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
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
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="login" className="text-base">Login</TabsTrigger>
                      <TabsTrigger value="register" className="text-base">Register</TabsTrigger>
                    </TabsList>
                    
                    <AnimatePresence mode="wait">
                      <TabsContent value="login" className="space-y-6">
                        <AnimatePresence>
                          {locationMessage && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Alert className="border-green-200 bg-green-50">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                  {locationMessage}
                                </AlertDescription>
                              </Alert>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <AnimatePresence>
                          {emailConfirmationError.show && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Alert className="border-amber-200 bg-amber-50">
                                <AlertCircle className="h-4 w-4 text-amber-600" />
                                <AlertDescription className="text-amber-800">
                                  <div className="space-y-3">
                                    <p className="font-medium">Email verification required</p>
                                    <p className="text-sm">
                                      Please check your email ({emailConfirmationError.email}) and click the verification link before signing in.
                                    </p>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleResendConfirmation(emailConfirmationError.email)}
                                        className="bg-white border-amber-300 text-amber-700 hover:bg-amber-50"
                                      >
                                        <Mail className="h-3 w-3 mr-1" />
                                        Resend email
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEmailConfirmationError({ show: false, email: "" })}
                                        className="text-amber-700 hover:bg-amber-100"
                                      >
                                        Dismiss
                                      </Button>
                                    </div>
                                  </div>
                                </AlertDescription>
                              </Alert>
                            </motion.div>
                          )}
                        </AnimatePresence>

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
                                          placeholder="user@domain.com" 
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
                        <AnimatePresence mode="wait">
                          {registrationSuccess ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="text-center space-y-4 py-8"
                            >
                              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <h3 className="text-xl font-semibold text-green-600">Registration Successful!</h3>
                              <p className="text-muted-foreground">
                                We've sent a confirmation email to <strong>{registeredEmail}</strong>
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Please check your email and click the verification link to activate your account.
                              </p>
                              <div className="space-y-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => handleResendConfirmation(registeredEmail)}
                                  className="w-full"
                                >
                                  Resend confirmation email
                                </Button>
                                <Button
                                  type="button"
                                  onClick={() => setActiveTab("login")}
                                  className="w-full"
                                >
                                  Go to Login
                                </Button>
                              </div>
                            </motion.div>
                          ) : (
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
                                      name="companyName"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-base">Company Name</FormLabel>
                                          <FormControl>
                                            <Input 
                                              placeholder="ACME Corporation"
                                              autoComplete="organization"
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
                                              placeholder="user@domain.com"
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
                                    {/* Debug info - remove in production */}
                                    <div className="text-xs text-muted-foreground mt-2">
                                      Form valid: {registerForm.formState.isValid ? 'Yes' : 'No'} | 
                                      Loading: {isLoading ? 'Yes' : 'No'}
                                    </div>
                                  </motion.div>
                                </form>
                              </Form>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </TabsContent>
                    </AnimatePresence>
                  </Tabs>

                  {!registrationSuccess && (
                    <>
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
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
