
import React, { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AuthContextType {
  user: any;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const authState = useAuth();

  // Extract the loading state from the existing auth hook
  const contextValue: AuthContextType = {
    user: authState.user,
    loading: authState.isLoading, // Use the correct property name from useAuth
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
