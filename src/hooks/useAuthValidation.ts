
import { supabase } from '@/integrations/supabase/client';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const useAuthValidation = () => {
  const validateEmailUniqueness = async (email: string): Promise<ValidationResult> => {
    try {
      // Check if user already exists in auth.users
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        // Fallback: try to sign in to check if user exists
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: 'dummy-password-for-check'
        });
        
        if (signInError?.message?.includes('Invalid login credentials')) {
          // User doesn't exist, email is available
          return { isValid: true };
        } else if (signInError?.message?.includes('Email not confirmed')) {
          // User exists but email not confirmed
          return { 
            isValid: false, 
            error: 'An account with this email already exists but is not yet verified. Please check your email for the verification link or contact support.' 
          };
        } else {
          // User exists and is active
          return { 
            isValid: false, 
            error: 'An account with this email already exists. Please sign in instead.' 
          };
        }
      }
      
      // Check if email exists in the user list - use explicit type checking
      if (data?.users && Array.isArray(data.users)) {
        // Find user with matching email using explicit type checking
        let existingUser = null;
        for (const user of data.users) {
          if (user && 
              typeof user === 'object' && 
              'email' in user && 
              typeof user.email === 'string' && 
              user.email.toLowerCase() === email.toLowerCase()) {
            existingUser = user;
            break;
          }
        }
        
        if (existingUser) {
          // Type assertion after we've confirmed the structure
          const typedUser = existingUser as { email: string; email_confirmed_at?: string };
          if (typedUser.email_confirmed_at) {
            return { 
              isValid: false, 
              error: 'An account with this email already exists. Please sign in instead.' 
            };
          } else {
            return { 
              isValid: false, 
              error: 'An account with this email already exists but is not yet verified. Please check your email for the verification link.' 
            };
          }
        }
      }
      
      return { isValid: true };
    } catch (error) {
      console.error('Email validation error:', error);
      return { 
        isValid: false, 
        error: 'Unable to validate email. Please try again.' 
      };
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
