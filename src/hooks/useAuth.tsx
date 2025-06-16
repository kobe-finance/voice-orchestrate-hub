
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
  // State properties
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
  token: AuthToken | null;
  
  // Methods
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'voiceorchestrate_token';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout: storeLogout } = useAppStore();
  const [token, setToken] = React.useState<AuthToken | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    setLoading(true);
    
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem('voiceorchestrate_user');

    if (storedToken && storedUser) {
      try {
        const parsedToken = JSON.parse(storedToken);
        const parsedUser = JSON.parse(storedUser);
        
        // Check if token is still valid
        if (parsedToken.expiresAt > Date.now()) {
          setUser(parsedUser);
          setToken(parsedToken);
        } else {
          // Token expired, try to refresh
          refreshTokenSilently(parsedToken.refreshToken);
        }
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        clearAuthData();
      }
    }
    
    setLoading(false);
  }, [setUser, setLoading]);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!user || !token) return;

    const timeUntilExpiry = token.expiresAt - Date.now();
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 60 * 1000);

    const refreshTimer = setTimeout(() => {
      refreshTokenMethod();
    }, refreshTime);

    return () => clearTimeout(refreshTimer);
  }, [user, token]);

  const clearAuthData = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem('voiceorchestrate_user');
    setToken(null);
    storeLogout();
  };

  const storeAuthData = (tokenData: AuthToken, userData: any, remember: boolean = false) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenData));
    storage.setItem('voiceorchestrate_user', JSON.stringify(userData));
    setToken(tokenData);
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
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
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

      toast.success('Registration successful! Please verify your email.');
      console.log('Registration successful (mock):', data);
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      throw error;
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
      setToken(newTokenData);
    } catch (error) {
      console.error('Silent token refresh failed:', error);
      clearAuthData();
      navigate('/auth');
    }
  };

  const refreshTokenMethod = async () => {
    if (!token) {
      logout();
      return;
    }

    try {
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
    isAuthenticated,
    user,
    isLoading,
    token,
    login,
    register,
    logout,
    refreshToken: refreshTokenMethod,
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
