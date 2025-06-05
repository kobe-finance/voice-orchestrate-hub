
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    renderWithRouter(<Auth />);
    
    expect(screen.getByText('VoiceOrchestrate™')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Register' })).toBeInTheDocument();
  });

  it('switches between login and register tabs', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Auth />);
    
    const registerTab = screen.getByRole('tab', { name: 'Register' });
    await user.click(registerTab);
    
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
  });

  it('validates login form fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Auth />);
    
    const submitButton = screen.getByRole('button', { name: 'Log in' });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  it('validates register form fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Auth />);
    
    const registerTab = screen.getByRole('tab', { name: 'Register' });
    await user.click(registerTab);
    
    const submitButton = screen.getByRole('button', { name: 'Create account' });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
    });
  });

  it('renders SSO buttons', () => {
    renderWithRouter(<Auth />);
    
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Microsoft')).toBeInTheDocument();
  });

  it('handles forgot password navigation', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Auth />);
    
    const forgotPasswordButton = screen.getByText('Forgot password?');
    expect(forgotPasswordButton).toBeInTheDocument();
  });
});
