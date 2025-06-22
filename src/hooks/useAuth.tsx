

import { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface RegisterData {
  firstName: string;
  lastName: string;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state and set up listener
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
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
    setIsLoading(true);
    console.log('Registration attempt for:', data.email);
    
    try {
      // SECURITY: Update redirect URL to go to confirmation page instead of auto-login
      const redirectUrl = `${window.location.origin}/email-confirmation`;
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: 'user',
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        
        // Handle specific error cases
        if (error.message.includes('User already registered')) {
          toast.error('An account with this email already exists. Please sign in instead.');
        } else if (error.message.includes('Password should be at least')) {
          toast.error('Password must be at least 6 characters long.');
        } else {
          toast.error(error.message || 'Registration failed. Please try again.');
        }
        throw error;
      }

      if (authData.user) {
        console.log('Registration successful:', authData.user.email);
        
        // SECURITY: Always sign out after registration to force email confirmation
        if (authData.session) {
          await supabase.auth.signOut();
        }
        
        toast.success('Registration successful! Please check your email for verification.');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
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
        
        // Redirect to home page
        setTimeout(() => {
          window.location.href = '/';
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

