/**
 * Phase 2.3: API-based Authentication Hook
 * 
 * Replaces business logic from useAuth with pure API calls
 * - Removes organization creation logic from frontend
 * - Uses backend API for all auth operations
 * - Maintains same interface for seamless migration
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  password: string;
}

interface UseAuthAPIReturn {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<any>;
  register: (data: RegisterRequest) => Promise<any>;
  logout: () => Promise<any>;
}

export const useAuthAPI = (): UseAuthAPIReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
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

    initializeAuth();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session);
      setSession(session);
      setUser(session?.user || null);
      setIsAuthenticated(!!session?.user);
      
      // Clear all cached data when auth state changes
      if (event === 'SIGNED_OUT') {
        queryClient.clear();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [queryClient]);

  // Login mutation - pure auth, no business logic
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: LoginRequest) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        setIsAuthenticated(true);
        toast.success('Login successful');
      }
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
      toast.error(`Login failed: ${error.message}`);
    },
  });

  // Register mutation - just creates user, backend handles org setup
  const registerMutation = useMutation({
    mutationFn: async ({ firstName, lastName, companyName, email, password }: RegisterRequest) => {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/email-confirmation`,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            company_name: companyName.trim(),
          }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      console.log('Registration successful:', data);
      if (data.session) {
        // User is immediately signed in
        setUser(data.user);
        setSession(data.session);
        setIsAuthenticated(true);
        toast.success('Registration successful');
      } else {
        // Email confirmation required
        toast.success('Please check your email to confirm your account');
      }
    },
    onError: (error: any) => {
      console.error('Registration failed:', error);
      toast.error(`Registration failed: ${error.message}`);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      queryClient.clear();
      navigate('/auth');
      toast.success('Logged out successfully');
    },
    onError: (error: any) => {
      console.error('Logout failed:', error);
      toast.error(`Logout failed: ${error.message}`);
    },
  });

  return {
    user,
    session,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    login: ({ email, password, rememberMe }: LoginRequest) => 
      loginMutation.mutateAsync({ email, password, rememberMe }),
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
  };
};