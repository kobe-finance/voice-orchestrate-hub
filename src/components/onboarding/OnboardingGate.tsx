
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Loader2 } from 'lucide-react';

interface OnboardingGateProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export const OnboardingGate: React.FC<OnboardingGateProps> = ({ 
  children, 
  requireOnboarding = false 
}) => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { onboardingStatus, isLoading: onboardingLoading, initializeOnboarding } = useOnboarding();
  const location = useLocation();

  // Initialize onboarding record if user is authenticated but no record exists
  useEffect(() => {
    if (isAuthenticated && user && !onboardingLoading && !onboardingStatus) {
      console.log('Initializing onboarding for new user');
      initializeOnboarding();
    }
  }, [isAuthenticated, user, onboardingStatus, onboardingLoading, initializeOnboarding]);

  // Show loading while checking authentication or onboarding status
  if (authLoading || onboardingLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If onboarding is required but not completed, redirect to onboarding
  if (requireOnboarding && onboardingStatus && !onboardingStatus.isCompleted) {
    // Allow access to onboarding page itself
    if (location.pathname === '/onboarding') {
      return <>{children}</>;
    }
    
    return <Navigate to="/onboarding" replace />;
  }

  // If user is on onboarding page but onboarding is completed, redirect to dashboard
  if (location.pathname === '/onboarding' && onboardingStatus?.isCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
