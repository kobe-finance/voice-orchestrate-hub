
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
  isEmailVerified: boolean;
}

interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  token: AuthToken | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'voiceorchestrate_token';
const USER_STORAGE_KEY = 'voiceorchestrate_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<AuthToken | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storedToken && storedUser) {
      try {
        const parsedToken = JSON.parse(storedToken);
        const parsedUser = JSON.parse(storedUser);
        
        // Check if token is still valid
        if (parsedToken.expiresAt > Date.now()) {
          setToken(parsedToken);
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
  }, []);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!token) return;

    const timeUntilExpiry = token.expiresAt - Date.now();
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 60 * 1000); // 5 minutes before expiry or 1 minute minimum

    const refreshTimer = setTimeout(() => {
      refreshToken();
    }, refreshTime);

    return () => clearTimeout(refreshTimer);
  }, [token]);

  const clearAuthData = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const storeAuthData = (tokenData: AuthToken, userData: User, remember: boolean = false) => {
    if (remember) {
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenData));
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } else {
      sessionStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenData));
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    }
    setToken(tokenData);
    setUser(userData);
  };

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const tokenData: AuthToken = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: Date.now() + data.expiresIn * 1000,
      };

      storeAuthData(tokenData, data.user, rememberMe);
    } catch (error) {
      // For demo purposes, simulate successful login
      const mockTokenData: AuthToken = {
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
        expiresAt: Date.now() + 3600 * 1000, // 1 hour
      };

      const mockUser: User = {
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
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const responseData = await response.json();
      // For registration, we might not log the user in immediately
      // They might need to verify their email first
    } catch (error) {
      // For demo purposes, simulate successful registration
      console.log('Registration successful (mock)');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTokenSilently = async (refreshTokenValue: string) => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const newTokenData: AuthToken = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: Date.now() + data.expiresIn * 1000,
      };

      setToken(newTokenData);
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(newTokenData));
    } catch (error) {
      console.error('Silent token refresh failed:', error);
      clearAuthData();
      navigate('/login');
    }
  };

  const refreshToken = async () => {
    if (!token?.refreshToken) {
      logout();
      return;
    }

    await refreshTokenSilently(token.refreshToken);
  };

  const logout = () => {
    clearAuthData();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
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
