
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBackendAuth } from '@/hooks/useBackendAuth';
import { User, Session } from '@supabase/supabase-js';
import { BackendUser } from '@/services/backendService';

interface HybridAuthContextType {
  // Supabase Auth
  supabaseUser: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  
  // Backend Integration
  backendUser: BackendUser | null;
  isBackendConnected: boolean;
  isLoading: boolean;
  refreshBackendUser: () => Promise<void>;
  updateBackendProfile: (updates: Partial<BackendUser>) => Promise<boolean>;
}

const HybridAuthContext = createContext<HybridAuthContextType | undefined>(undefined);

export const HybridAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const supabaseAuth = useAuth();
  const backendAuth = useBackendAuth();

  const value: HybridAuthContextType = {
    // Supabase Auth
    supabaseUser: supabaseAuth.user,
    session: supabaseAuth.session,
    isAuthenticated: supabaseAuth.isAuthenticated,
    login: supabaseAuth.login,
    register: supabaseAuth.register,
    logout: supabaseAuth.logout,
    
    // Backend Integration
    backendUser: backendAuth.backendUser,
    isBackendConnected: backendAuth.isBackendConnected,
    isLoading: supabaseAuth.isLoading || backendAuth.isLoading,
    refreshBackendUser: backendAuth.refreshBackendUser,
    updateBackendProfile: backendAuth.updateBackendProfile,
  };

  return (
    <HybridAuthContext.Provider value={value}>
      {children}
    </HybridAuthContext.Provider>
  );
};

export const useHybridAuth = (): HybridAuthContextType => {
  const context = useContext(HybridAuthContext);
  if (context === undefined) {
    throw new Error('useHybridAuth must be used within a HybridAuthProvider');
  }
  return context;
};
