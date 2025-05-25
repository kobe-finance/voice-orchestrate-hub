
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth, AuthProvider } from '../useAuth';

// Mock dependencies
jest.mock('@/stores/useAppStore', () => ({
  useAppStore: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    setUser: jest.fn(),
    setLoading: jest.fn(),
    logout: jest.fn(),
  }),
}));

jest.mock('@/components/ui/sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('provides auth context values', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('register');
    expect(result.current).toHaveProperty('logout');
    expect(result.current).toHaveProperty('isAuthenticated');
    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('isLoading');
  });

  it('handles login correctly', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    // Check if localStorage was set (mocked behavior)
    expect(localStorage.getItem).toHaveBeenCalled();
  });

  it('handles registration correctly', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });
    });

    // Registration should complete without error
    expect(result.current.isLoading).toBe(false);
  });

  it('throws error when used outside AuthProvider', () => {
    // Temporarily suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');

    console.error = originalError;
  });
});
