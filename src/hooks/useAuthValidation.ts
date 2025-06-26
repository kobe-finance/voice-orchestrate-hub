
import { supabase } from '@/integrations/supabase/client';
import { SupabaseAdminService } from '@/services/supabase-admin.service';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const useAuthValidation = () => {
  const validateEmailUniqueness = async (email: string): Promise<ValidationResult> => {
    try {
      // First try the new type-safe service approach
      const userInfo = await SupabaseAdminService.getUserByEmail(email);
      
      if (userInfo) {
        if (userInfo.isConfirmed) {
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
      
      // If service approach worked and no user found, email is available
      return { isValid: true };
      
    } catch (error) {
      console.error('Email validation error with service approach:', error);
      
      // Fallback to original approach for backward compatibility
      try {
        console.log('Falling back to direct sign-in attempt for email validation');
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
      } catch (fallbackError) {
        console.error('Fallback email validation also failed:', fallbackError);
        return { 
          isValid: false, 
          error: 'Unable to validate email. Please try again.' 
        };
      }
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
