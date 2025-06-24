
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { cn } from '@/lib/utils';

interface PageErrorProps {
  error: {
    message: string;
    code?: string;
    retry?: () => void;
  };
  onRetry?: () => void;
  onGoHome?: () => void;
  showHomeButton?: boolean;
  className?: string;
}

export const PageError: React.FC<PageErrorProps> = ({
  error,
  onRetry,
  onGoHome,
  showHomeButton = true,
  className
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else if (error.retry) {
      error.retry();
    }
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className={cn("flex items-center justify-center min-h-[400px] p-4", className)}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl font-semibold">Something went wrong</CardTitle>
          <CardDescription>
            {error.message || 'An unexpected error occurred while loading this page.'}
          </CardDescription>
          {error.code && (
            <p className="text-xs text-muted-foreground mt-2">
              Error Code: {error.code}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            {(onRetry || error.retry) && (
              <Button onClick={handleRetry} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            {showHomeButton && (
              <Button variant="outline" onClick={handleGoHome} className="flex-1">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
