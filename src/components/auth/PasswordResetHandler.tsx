
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';

interface PasswordResetHandlerProps {
  onResetDetected: () => void;
}

export const PasswordResetHandler: React.FC<PasswordResetHandlerProps> = ({ onResetDetected }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handlePasswordReset = async () => {
      // Check if this is a password reset callback
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const tokenType = hashParams.get('type');
      
      console.log('Password reset handler - URL hash params:', {
        accessToken: accessToken ? 'present' : 'missing',
        tokenType,
        fullHash: window.location.hash
      });

      if (accessToken && (tokenType === 'recovery' || tokenType === 'signup')) {
        setIsProcessing(true);
        try {
          // Let Supabase handle the session from the URL
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error getting session:', error);
            toast.error('Invalid reset link. Please request a new password reset.');
            navigate('/forgot-password');
            return;
          }

          if (data.session) {
            console.log('Password reset session established');
            // Clear the URL hash to clean up the URL
            window.history.replaceState(null, '', window.location.pathname);
            // Notify parent component that we detected a reset
            onResetDetected();
            toast.success('Ready to set your new password');
          }
        } catch (error) {
          console.error('Password reset handling error:', error);
          toast.error('Something went wrong. Please try again.');
          navigate('/forgot-password');
        } finally {
          setIsProcessing(false);
        }
      }
    };

    handlePasswordReset();
  }, [navigate, onResetDetected]);

  if (isProcessing) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Processing reset link...</p>
      </div>
    );
  }

  return null;
};
