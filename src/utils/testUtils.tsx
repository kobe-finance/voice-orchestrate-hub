
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Helper functions for common test scenarios
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'admin',
  tenantId: 'tenant_1',
  isEmailVerified: true,
};

export const mockAuthToken = {
  accessToken: 'mock_access_token',
  refreshToken: 'mock_refresh_token',
  expiresAt: Date.now() + 3600 * 1000,
};

export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0));
