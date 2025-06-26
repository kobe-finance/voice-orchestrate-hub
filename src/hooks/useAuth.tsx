import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface RegisterData {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  password: string;
}

interface AuthContextType {
  // State properties
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  
  // Methods
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

// Generate slug from company name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state and set up listener
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('AuthProvider: Initializing auth');
        
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
            
            // SECURITY: Handle email confirmation event
            if (event === 'TOKEN_REFRESHED' && session?.user && !session.user.email_confirmed_at) {
              console.log('Email confirmation detected, but user not verified');
              // Sign out unverified users for security
              await supabase.auth.signOut();
              return;
            }
            
            if (mounted) {
              setSession(session);
              setUser(session?.user ?? null);
              setIsAuthenticated(!!session);
              
              // Sync with Zustand store after auth state changes
              if (session?.user) {
                setTimeout(() => {
                  syncWithZustandStore(session.user);
                }, 0);
              }
            }
          }
        );

        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        }

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          setIsAuthenticated(!!initialSession);
          setIsLoading(false);

          if (initialSession?.user) {
            await syncWithZustandStore(initialSession.user);
          }
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const syncWithZustandStore = async (userData: User) => {
    try {
      const { useAppStore } = await import('@/stores/useAppStore');
      const store = useAppStore.getState();
      
      // Convert Supabase User to app user format
      const appUser = {
        id: userData.id,
        email: userData.email || '',
        firstName: userData.user_metadata?.first_name || '',
        lastName: userData.user_metadata?.last_name || '',
        role: userData.user_metadata?.role || 'user',
        tenantId: userData.user_metadata?.tenant_id || 'default',
        isEmailVerified: userData.email_confirmed_at != null,
      };
      
      store.setUser(appUser);
      console.log('Successfully synced user with Zustand store:', appUser);
    } catch (error) {
      console.error('Failed to sync with Zustand store:', error);
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    console.log('Login attempt for:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please check your credentials.');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please verify your email address before signing in.');
        } else {
          toast.error(error.message || 'Login failed. Please try again.');
        }
        throw error;
      }

      if (data.user && data.session) {
        console.log('Login successful:', data.user.email);
        toast.success('Welcome back! Login successful.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    console.log('🚀 Registration started for:', data.email);
    setIsLoading(true);
    
    try {
      // Enhanced input validation with detailed logging
      console.log('✅ Step 1: Validating input data...');
      if (!data.email?.trim()) {
        throw new Error('Email is required');
      }
      if (!data.password?.trim()) {
        throw new Error('Password is required');
      }
      if (!data.firstName?.trim()) {
        throw new Error('First name is required');
      }
      if (!data.lastName?.trim()) {
        throw new Error('Last name is required');
      }
      if (!data.companyName?.trim()) {
        throw new Error('Company name is required');
      }

      if (data.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      console.log('✅ Step 2: Input validation passed');

      // Test database connection
      console.log('🔍 Step 3: Testing database connection...');
      const { data: testConnection, error: connectionError } = await supabase
        .from('organizations')
        .select('count')
        .limit(1);
      
      if (connectionError) {
        console.error('❌ Database connection failed:', connectionError);
        throw new Error(`Database connection failed: ${connectionError.message}`);
      }
      console.log('✅ Step 3: Database connection successful');

      // 1. Create the user FIRST to get proper authentication context
      const redirectUrl = `${window.location.origin}/email-confirmation`;
      console.log('👤 Step 4: Creating user with redirect URL:', redirectUrl);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email.toLowerCase().trim(),
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: data.firstName.trim(),
            last_name: data.lastName.trim(),
            role: 'owner'
          }
        }
      });

      if (authError) {
        console.error('❌ User creation failed:', authError);
        
        // Handle specific error cases
        if (authError.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        } else if (authError.message.includes('Password should be at least')) {
          throw new Error('Password must be at least 6 characters long.');
        } else if (authError.message.includes('Invalid email')) {
          throw new Error('Please enter a valid email address.');
        } else {
          throw new Error(authError.message || 'Registration failed. Please try again.');
        }
      }

      if (!authData.user?.id) {
        console.error('❌ User creation returned no user data');
        throw new Error('User registration failed - no user data returned');
      }

      console.log('✅ Step 4: User created successfully:', authData.user.id);

      // 2. Create the organization with the user's session context
      const orgSlug = generateSlug(data.companyName);
      console.log('🏢 Step 5: Creating organization with slug:', orgSlug);
      
      // Wait a moment for the session to be established
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: data.companyName.trim(),
          slug: orgSlug
        })
        .select()
        .single();

      if (orgError) {
        console.error('❌ Organization creation failed:', orgError);
        if (orgError.code === '23505') { // Unique constraint violation
          throw new Error(`An organization with this name already exists. Please choose a different company name.`);
        }
        throw new Error(`Failed to create organization: ${orgError.message}`);
      }

      if (!orgData?.id) {
        console.error('❌ Organization creation returned no data');
        throw new Error('Organization creation failed - no data returned');
      }

      console.log('✅ Step 5: Organization created successfully:', orgData.id);
      
      // 3. Create organization membership
      console.log('🤝 Step 6: Creating organization membership...');
      const { error: membershipError } = await supabase
        .from('organization_members')
        .insert({
          user_id: authData.user.id,
          organization_id: orgData.id,
          role: 'owner'
        });

      if (membershipError) {
        console.error('❌ Membership creation failed:', membershipError);
        console.warn('User created but membership creation failed - this may need manual cleanup');
      } else {
        console.log('✅ Step 6: Organization membership created successfully');
      }

      // 4. Update user metadata with organization info
      console.log('🔄 Step 7: Updating user metadata with organization info...');
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          tenant_id: orgData.id,
          first_name: data.firstName.trim(),
          last_name: data.lastName.trim(),
          role: 'owner'
        }
      });

      if (updateError) {
        console.warn('⚠️ User metadata update failed:', updateError);
        // Not critical - continue with registration
      } else {
        console.log('✅ Step 7: User metadata updated successfully');
      }

      // 5. Sign out for email confirmation (security requirement)
      if (authData.session) {
        console.log('🔐 Step 8: Signing out user to force email confirmation');
        await supabase.auth.signOut();
      }
      
      console.log('🎉 Registration completed successfully for:', data.email);
      toast.success('Registration successful! Please check your email for verification.');
      
    } catch (error) {
      console.error('💥 Registration failed with error:', error);
      
      // Show user-friendly error message
      if (error instanceof Error) {
        toast.error(error.message);
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      } else {
        toast.error('Registration failed. Please try again.');
        console.error('Unknown error type:', error);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
      console.log('🏁 Registration process completed (success or failure)');
    }
  };

  const refreshToken = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Token refresh failed:', error);
        await logout();
        return;
      }

      if (data.session) {
        console.log('Token refreshed successfully');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
    }
  };

  const logout = async () => {
    console.log('Logout initiated');
    
    try {
      // Clear Zustand store first
      try {
        const { useAppStore } = await import('@/stores/useAppStore');
        const store = useAppStore.getState();
        store.setUser(null);
        console.log('Zustand store cleared');
      } catch (error) {
        console.error('Failed to clear store:', error);
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error('Error during logout. Please try again.');
      } else {
        console.log('Logout successful');
        toast.success('Logged out successfully');
        
        // Use navigate since we're now inside Router context
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    session,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
