
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

const EmailConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the token from URL parameters
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        if (!token_hash || type !== 'email') {
          setStatus('error');
          setMessage('Invalid confirmation link. Please try again or request a new confirmation email.');
          return;
        }

        // Verify the email confirmation token
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: 'email'
        });

        if (error) {
          console.error('Email confirmation error:', error);
          setStatus('error');
          setMessage('Email confirmation failed. The link may have expired or already been used.');
          return;
        }

        if (data.user) {
          // SECURITY: Sign out the user immediately after confirmation
          // This forces them to log in explicitly with their password
          await supabase.auth.signOut();
          
          setStatus('success');
          setMessage('Your email has been successfully confirmed! You can now sign in to your account.');
        } else {
          setStatus('error');
          setMessage('Email confirmation failed. Please try again.');
        }
      } catch (error) {
        console.error('Email confirmation error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleEmailConfirmation();
  }, [searchParams]);

  const handleGoToLogin = () => {
    navigate('/auth', { 
      state: { 
        message: 'Email confirmed successfully! Please sign in with your credentials.',
        confirmedEmail: searchParams.get('email')
      } 
    });
  };

  const handleRequestNewLink = () => {
    navigate('/auth', { 
      state: { 
        tab: 'register',
        message: 'Please register again or contact support if you continue to have issues.'
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto mb-4">
              {status === 'loading' && (
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
              )}
              {status === 'success' && (
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              )}
              {status === 'error' && (
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl">
              {status === 'loading' && 'Confirming Email...'}
              {status === 'success' && 'Email Confirmed!'}
              {status === 'error' && 'Confirmation Failed'}
            </CardTitle>
            <CardDescription>
              VoiceOrchestrate™ Account Verification
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Alert className={
              status === 'success' ? 'border-green-200 bg-green-50 dark:bg-green-900/20' :
              status === 'error' ? 'border-red-200 bg-red-50 dark:bg-red-900/20' :
              'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
            }>
              <AlertDescription className={
                status === 'success' ? 'text-green-800 dark:text-green-300' :
                status === 'error' ? 'text-red-800 dark:text-red-300' :
                'text-blue-800 dark:text-blue-300'
              }>
                {message}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {status === 'success' && (
                <Button 
                  onClick={handleGoToLogin}
                  className="w-full"
                >
                  Sign In to Your Account
                </Button>
              )}
              
              {status === 'error' && (
                <>
                  <Button 
                    onClick={handleRequestNewLink}
                    className="w-full"
                  >
                    Request New Confirmation
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleGoToLogin}
                    className="w-full"
                  >
                    Go to Sign In
                  </Button>
                </>
              )}
              
              {status === 'loading' && (
                <div className="text-center text-sm text-muted-foreground">
                  Please wait while we verify your email address...
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground text-center">
                For security reasons, you'll need to sign in with your password after email confirmation.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmailConfirmation;
