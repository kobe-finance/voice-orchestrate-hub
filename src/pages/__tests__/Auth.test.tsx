
import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Auth from '../Auth';

// Mock useAuth hook
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    login: jest.fn(),
    register: jest.fn(),
    isLoading: false,
  }),
}));

// Mock useAppStore
jest.mock('@/stores/useAppStore', () => ({
  useAppStore: () => ({
    isLoading: false,
    setLoading: jest.fn(),
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Auth Page', () => {
  it('renders login form by default', () => {
    const { getByText, getByRole } = renderWithRouter(<Auth />);
    
    expect(getByText('VoiceOrchestrate™')).toBeInTheDocument();
    expect(getByRole('tab', { name: 'Login' })).toBeInTheDocument();
    expect(getByRole('tab', { name: 'Register' })).toBeInTheDocument();
  });

  it('switches between login and register tabs', async () => {
    const user = userEvent.setup();
    const { getByRole, getByLabelText } = renderWithRouter(<Auth />);
    
    const registerTab = getByRole('tab', { name: 'Register' });
    await user.click(registerTab);
    
    expect(getByLabelText('First Name')).toBeInTheDocument();
    expect(getByLabelText('Last Name')).toBeInTheDocument();
  });

  it('validates login form fields', async () => {
    const user = userEvent.setup();
    const { getByRole, findByText } = renderWithRouter(<Auth />);
    
    const submitButton = getByRole('button', { name: 'Log in' });
    await user.click(submitButton);
    
    const errorMessage = await findByText('Email is required');
    expect(errorMessage).toBeInTheDocument();
  });

  it('validates register form fields', async () => {
    const user = userEvent.setup();
    const { getByRole, findByText } = renderWithRouter(<Auth />);
    
    const registerTab = getByRole('tab', { name: 'Register' });
    await user.click(registerTab);
    
    const submitButton = getByRole('button', { name: 'Create account' });
    await user.click(submitButton);
    
    const errorMessage = await findByText('First name is required');
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders SSO buttons', () => {
    const { getByText } = renderWithRouter(<Auth />);
    
    expect(getByText('Google')).toBeInTheDocument();
    expect(getByText('Microsoft')).toBeInTheDocument();
  });

  it('handles forgot password navigation', async () => {
    const { getByText } = renderWithRouter(<Auth />);
    
    const forgotPasswordButton = getByText('Forgot password?');
    expect(forgotPasswordButton).toBeInTheDocument();
  });
});
