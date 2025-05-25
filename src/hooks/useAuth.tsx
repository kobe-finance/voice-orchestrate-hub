
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { useAppStore } from '@/stores/useAppStore';

interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthContextType {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'voiceorchestrate_token';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { user, setUser, setLoading, logout: storeLogout } = useAppStore();

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem('voiceorchestrate_user');

    if (storedToken && storedUser) {
      try {
        const parsedToken = JSON.parse(storedToken);
        const parsedUser = JSON.parse(storedUser);
        
        // Check if token is still valid
        if (parsedToken.expiresAt > Date.now()) {
          setUser(parsedUser);
        } else {
          // Token expired, try to refresh
          refreshTokenSilently(parsedToken.refreshToken);
        }
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        clearAuthData();
      }
    }
  }, [setUser]);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!user) return;

    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!storedToken) return;

    try {
      const token = JSON.parse(storedToken);
      const timeUntilExpiry = token.expiresAt - Date.now();
      const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 60 * 1000);

      const refreshTimer = setTimeout(() => {
        refreshToken();
      }, refreshTime);

      return () => clearTimeout(refreshTimer);
    } catch (error) {
      console.error('Error setting up token refresh:', error);
    }
  }, [user]);

  const clearAuthData = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem('voiceorchestrate_user');
    storeLogout();
  };

  const storeAuthData = (tokenData: AuthToken, userData: any, remember: boolean = false) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenData));
    storage.setItem('voiceorchestrate_user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setLoading(true);
    try {
      // Simulate API call with enhanced error handling
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate occasional failures for demo
          if (Math.random() > 0.9) {
            reject(new Error('Network error'));
          } else {
            resolve(true);
          }
        }, 1500);
      });

      // Mock successful response
      const mockTokenData: AuthToken = {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        expiresAt: Date.now() + 3600 * 1000, // 1 hour
      };

      const mockUser = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
        tenantId: 'tenant_1',
        isEmailVerified: true,
      };

      storeAuthData(mockTokenData, mockUser, rememberMe);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.9) {
            reject(new Error('Registration failed'));
          } else {
            resolve(true);
          }
        }, 2000);
      });

      console.log('Registration successful (mock):', data);
    } finally {
      setLoading(false);
    }
  };

  const refreshTokenSilently = async (refreshTokenValue: string) => {
    try {
      // Simulate refresh token API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTokenData: AuthToken = {
        accessToken: 'refreshed_access_token_' + Date.now(),
        refreshToken: refreshTokenValue,
        expiresAt: Date.now() + 3600 * 1000,
      };

      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(newTokenData));
    } catch (error) {
      console.error('Silent token refresh failed:', error);
      clearAuthData();
      navigate('/auth');
    }
  };

  const refreshToken = async () => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!storedToken) {
      logout();
      return;
    }

    try {
      const token = JSON.parse(storedToken);
      await refreshTokenSilently(token.refreshToken);
    } catch (error) {
      logout();
    }
  };

  const logout = () => {
    clearAuthData();
    navigate('/auth');
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
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
