
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
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        console.log('🔍 Email confirmation started');
        console.log('📋 URL params:', Object.fromEntries(searchParams.entries()));

        // Get all possible token parameters
        const token_hash = searchParams.get('token_hash');
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        const redirect_to = searchParams.get('redirect_to');

        setDebugInfo({
          token_hash: token_hash ? token_hash.substring(0, 10) + '...' : null,
          token: token ? token.substring(0, 10) + '...' : null,
          type,
          redirect_to,
          full_url: window.location.href
        });

        // Check if we have required parameters
        if (!token_hash && !token) {
          console.error('❌ No token found in URL');
          setStatus('error');
          setMessage('No confirmation token found in the URL. Please check the link in your email.');
          return;
        }

        if (!type) {
          console.error('❌ No type parameter found');
          setStatus('error');
          setMessage('Invalid confirmation link format. Please use the exact link from your email.');
          return;
        }

        console.log('✅ Token validation passed, attempting verification...');

        // Try to verify the token
        let verificationResult;

        if (token_hash) {
          // Use token_hash for newer format
          verificationResult = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any
          });
        } else if (token) {
          // Use token for older format
          verificationResult = await supabase.auth.verifyOtp({
            token,
            type: type as any
          });
        }

        console.log('📧 Verification result:', verificationResult);

        if (verificationResult?.error) {
          console.error('❌ Email confirmation error:', verificationResult.error);
          
          // Handle specific error cases
          if (verificationResult.error.message.includes('expired')) {
            setStatus('error');
            setMessage('The confirmation link has expired. Please request a new one.');
          } else if (verificationResult.error.message.includes('invalid') || verificationResult.error.message.includes('not found')) {
            setStatus('error');
            setMessage('Invalid confirmation link. The link may have already been used or is malformed.');
          } else {
            setStatus('error');
            setMessage(`Email confirmation failed: ${verificationResult.error.message}`);
          }
          return;
        }

        if (verificationResult?.data?.user) {
          console.log('✅ Email confirmation successful for user:', verificationResult.data.user.email);
          
          // Sign out the user immediately for security (force password login)
          await supabase.auth.signOut();
          
          setStatus('success');
          setMessage('Your email has been successfully confirmed! You can now sign in to your account.');
        } else {
          console.error('❌ No user data returned from verification');
          setStatus('error');
          setMessage('Email confirmation failed. Please try again or contact support.');
        }
      } catch (error) {
        console.error('💥 Email confirmation error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during email confirmation. Please try again.');
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

  const handleRequestNewLink = async () => {
    // Try to extract email from the redirect URL or ask user to register again
    const email = searchParams.get('email');
    
    if (email) {
      try {
        console.log('🔄 Requesting new confirmation for:', email);
        
        // Resend confirmation email
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email
        });

        if (error) {
          console.error('❌ Resend failed:', error);
          navigate('/auth', { 
            state: { 
              tab: 'register',
              message: 'Failed to resend confirmation. Please register again or contact support.'
            } 
          });
        } else {
          setMessage('New confirmation email sent! Please check your inbox.');
        }
      } catch (error) {
        console.error('💥 Resend error:', error);
        navigate('/auth', { 
          state: { 
            tab: 'register',
            message: 'Please register again or contact support if you continue to have issues.'
          } 
        });
      }
    } else {
      navigate('/auth', { 
        state: { 
          tab: 'register',
          message: 'Please register again to receive a new confirmation email.'
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-6"
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
                  Continue to Sign In
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

            {/* Debug information for development */}
            {debugInfo && process.env.NODE_ENV === 'development' && (
              <details className="mt-4">
                <summary className="text-xs text-muted-foreground cursor-pointer">Debug Info</summary>
                <pre className="text-xs text-muted-foreground mt-2 p-2 bg-gray-100 rounded overflow-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            )}

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
