
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { generateSlug } from '@/utils/organization';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    companyName: string;
    email: string;
    password: string;
  }) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        setSession(session);
        setUser(session?.user || null);
        setIsAuthenticated(!!session?.user);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        console.log('Initial session:', session);
      } else {
        console.log('Auth state change:', event, session);
      }
      
      setSession(session);
      setUser(session?.user || null);
      setIsAuthenticated(!!session?.user);
    });

    // Unsubscribe on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    companyName: string;
    email: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      console.log('🚀 Starting registration process...');

      // Step 1: Create user account
      console.log('📧 Creating user account...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email.toLowerCase().trim(),
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/email-confirmation`,
          data: {
            first_name: data.firstName.trim(),
            last_name: data.lastName.trim(),
          }
        }
      });

      if (authError) {
        console.error('❌ Auth signup failed:', authError);
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error('No user returned from signup');
      }

      console.log('✅ User created successfully:', authData.user.id);

      // Step 2: If we have a session, proceed with organization setup
      if (authData.session) {
        console.log('🏢 Creating organization...');
        
        try {
          // Create organization
          const orgSlug = generateSlug(data.companyName);
          const { data: org, error: orgError } = await supabase
            .from('organizations')
            .insert({
              name: data.companyName.trim(),
              slug: orgSlug
            })
            .select()
            .single();

          if (orgError) {
            console.error('❌ Organization creation failed:', orgError);
            // Log for monitoring (in production, this would go to Sentry)
            console.error('Organization creation error details:', {
              error: orgError,
              context: {
                userId: authData.user.id,
                email: data.email,
                companyName: data.companyName
              }
            });
            
            return {
              user: authData.user,
              session: authData.session,
              error: 'Account created but organization setup failed. Please contact support.',
              requiresOrgSetup: true
            };
          }

          console.log('✅ Organization created:', org.id);

          // Step 3: Create membership
          const { error: membershipError } = await supabase
            .from('organization_members')
            .insert({
              user_id: authData.user.id,
              organization_id: org.id,
              role: 'owner'
            });

          if (membershipError) {
            console.error('❌ Membership creation failed:', membershipError);
            return {
              user: authData.user,
              session: authData.session,
              organization: org,
              error: 'Account and organization created but membership setup failed. Please contact support.',
              requiresOrgSetup: true
            };
          }

          console.log('✅ Membership created successfully');

          // Step 4: Update user metadata (CRITICAL for JWT)
          console.log('📝 Updating user metadata...');
          const { error: updateError } = await supabase.auth.updateUser({
            data: {
              tenant_id: org.id,                    // For RLS policies and JWT
              default_organization: org.id,         // For multi-org future support
              onboarding_completed: false,          // Track onboarding status
              registration_completed_at: new Date().toISOString(),
              role: 'owner',
              organization_name: org.name,
              organization_slug: org.slug
            }
          });

          if (updateError) {
            console.warn('⚠️ Failed to update user metadata:', updateError);
            // This is critical - log for monitoring
            console.error('Metadata update error details:', {
              error: updateError,
              context: {
                userId: authData.user.id,
                orgId: org.id,
                email: data.email
              }
            });
            
            return {
              user: authData.user,
              session: authData.session,
              organization: org,
              error: 'Account and organization created but user setup incomplete. Please contact support.',
              requiresMetadataUpdate: true
            };
          }

          // Debug: Verify metadata was set correctly
          console.log('🔍 Verifying user metadata after update:', authData.user.user_metadata);

          // Log successful registration
          await supabase
            .from('registration_logs')
            .insert({
              user_id: authData.user.id,
              action: 'frontend_registration_completed',
              details: {
                org_id: org.id,
                org_slug: org.slug,
                org_name: org.name,
                method: 'frontend_driven_flow',
                metadata_updated: true
              }
            });

          console.log('🎉 Registration completed successfully!');

          return {
            user: authData.user,
            session: authData.session,
            organization: org,
            success: true
          };

        } catch (orgCreationError) {
          console.error('💥 Organization setup failed:', orgCreationError);
          // Log for monitoring
          console.error('Organization setup error details:', {
            error: orgCreationError,
            context: {
              userId: authData.user.id,
              email: data.email,
              companyName: data.companyName
            }
          });
          
          return {
            user: authData.user,
            session: authData.session,
            error: 'Account created but organization setup failed. You can continue and we\'ll set this up later.',
            requiresOrgSetup: true
          };
        }
      }

      // No session (email confirmation required)
      console.log('📧 Email confirmation required - org creation deferred');
      return {
        user: authData.user,
        session: null,
        requiresEmailConfirmation: true,
        organization: null
      };

    } catch (error: any) {
      console.error('💥 Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthState = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
