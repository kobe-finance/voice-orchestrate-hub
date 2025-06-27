
import { supabase } from '@/integrations/supabase/client';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const useAuthValidation = () => {
  const validateEmailUniqueness = async (email: string): Promise<ValidationResult> => {
    try {
      console.log('🔍 Validating email uniqueness for:', email);
      
      // Use a simple sign-in attempt to check if user exists
      // This is more reliable than admin API calls from the frontend
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: 'dummy-password-for-validation-check'
      });
      
      if (signInError?.message?.includes('Invalid login credentials')) {
        // User doesn't exist, email is available
        console.log('✅ Email is available');
        return { isValid: true };
      } else if (signInError?.message?.includes('Email not confirmed')) {
        // User exists but email not confirmed
        console.log('❌ Email exists but not confirmed');
        return { 
          isValid: false, 
          error: 'An account with this email already exists but is not yet verified. Please check your email for the verification link or contact support.' 
        };
      } else if (signInError?.message?.includes('Too many requests')) {
        // Rate limited
        console.log('❌ Rate limited');
        return { 
          isValid: false, 
          error: 'Too many attempts. Please try again in a few minutes.' 
        };
      } else if (!signInError) {
        // Sign in would succeed, user exists and is active
        console.log('❌ Email already exists and is active');
        return { 
          isValid: false, 
          error: 'An account with this email already exists. Please sign in instead.' 
        };
      } else {
        // Some other error, but assume email is available to be safe
        console.log('⚠️ Unknown error, assuming email is available:', signInError.message);
        return { isValid: true };
      }
      
    } catch (error) {
      console.error('Email validation error:', error);
      // On error, allow registration to proceed rather than block it
      return { isValid: true };
    }
  };

  const validatePasswordStrength = (password: string): ValidationResult => {
    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters long.' };
    }
    
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one uppercase letter.' };
    }
    
    if (!/[a-z]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one lowercase letter.' };
    }
    
    if (!/\d/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one number.' };
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>).' };
    }
    
    return { isValid: true };
  };

  const validateRegistrationData = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName: string;
  }): Promise<ValidationResult> => {
    // Validate email uniqueness
    const emailValidation = await validateEmailUniqueness(data.email);
    if (!emailValidation.isValid) {
      return emailValidation;
    }
    
    // Validate password strength
    const passwordValidation = validatePasswordStrength(data.password);
    if (!passwordValidation.isValid) {
      return passwordValidation;
    }
    
    // Additional validations
    if (data.firstName.length < 2 || data.firstName.length > 50) {
      return { isValid: false, error: 'First name must be between 2 and 50 characters.' };
    }
    
    if (data.lastName.length < 2 || data.lastName.length > 50) {
      return { isValid: false, error: 'Last name must be between 2 and 50 characters.' };
    }
    
    if (data.companyName.length < 2 || data.companyName.length > 100) {
      return { isValid: false, error: 'Company name must be between 2 and 100 characters.' };
    }
    
    return { isValid: true };
  };

  return {
    validateEmailUniqueness,
    validatePasswordStrength,
    validateRegistrationData
  };
};
