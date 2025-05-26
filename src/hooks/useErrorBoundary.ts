
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface ErrorInfo {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  context?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
}

interface ErrorBoundaryState {
  errors: ErrorInfo[];
  hasError: boolean;
  currentError: ErrorInfo | null;
}

interface UseErrorBoundaryOptions {
  onError?: (error: ErrorInfo) => void;
  enableReporting?: boolean;
  autoRecovery?: boolean;
  maxRetries?: number;
}

export const useErrorBoundary = ({
  onError,
  enableReporting = true,
  autoRecovery = true,
  maxRetries = 3
}: UseErrorBoundaryOptions = {}) => {
  const [state, setState] = useState<ErrorBoundaryState>({
    errors: [],
    hasError: false,
    currentError: null
  });

  const [retryCount, setRetryCount] = useState(0);

  const captureError = useCallback((
    error: Error | string,
    context?: Record<string, any>,
    severity: ErrorInfo['severity'] = 'medium'
  ) => {
    const errorInfo: ErrorInfo = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      timestamp: new Date(),
      context,
      severity,
      recoverable: severity !== 'critical'
    };

    setState(prev => ({
      errors: [...prev.errors, errorInfo],
      hasError: true,
      currentError: errorInfo
    }));

    // Log error for debugging
    console.error('Error captured:', errorInfo);

    // Show toast notification
    if (severity === 'critical') {
      toast.error(`Critical Error: ${errorInfo.message}`);
    } else if (severity === 'high') {
      toast.error(`Error: ${errorInfo.message}`);
    } else {
      toast.warning(`Warning: ${errorInfo.message}`);
    }

    // Call external error handler
    onError?.(errorInfo);

    // Report error if enabled
    if (enableReporting) {
      reportError(errorInfo);
    }

    return errorInfo;
  }, [onError, enableReporting]);

  const recoverFromError = useCallback(async (errorId?: string) => {
    try {
      // Clear specific error or current error
      setState(prev => {
        const targetError = errorId 
          ? prev.errors.find(e => e.id === errorId)
          : prev.currentError;

        if (!targetError?.recoverable) {
          toast.error('This error cannot be automatically recovered');
          return prev;
        }

        return {
          ...prev,
          hasError: prev.errors.filter(e => e.id !== (errorId || prev.currentError?.id)).length > 0,
          currentError: null,
          errors: prev.errors.filter(e => e.id !== (errorId || prev.currentError?.id))
        };
      });

      setRetryCount(0);
      toast.success('Error recovered successfully');
    } catch (recoveryError) {
      console.error('Recovery failed:', recoveryError);
      toast.error('Recovery failed. Please refresh the page.');
    }
  }, []);

  const retryLastAction = useCallback(async (action?: () => Promise<void> | void) => {
    if (retryCount >= maxRetries) {
      toast.error('Maximum retry attempts reached');
      return false;
    }

    try {
      setRetryCount(prev => prev + 1);
      
      if (action) {
        await action();
      }
      
      // Clear current error on successful retry
      setState(prev => ({
        ...prev,
        hasError: false,
        currentError: null
      }));
      
      setRetryCount(0);
      toast.success('Action completed successfully');
      return true;
    } catch (error) {
      console.error('Retry failed:', error);
      captureError(error as Error, { retryAttempt: retryCount + 1 }, 'high');
      return false;
    }
  }, [retryCount, maxRetries, captureError]);

  const clearAllErrors = useCallback(() => {
    setState({
      errors: [],
      hasError: false,
      currentError: null
    });
    setRetryCount(0);
  }, []);

  const reportError = useCallback(async (errorInfo: ErrorInfo) => {
    try {
      // In a real app, this would send to an error reporting service
      console.log('Reporting error:', errorInfo);
      
      // Simulate API call to error reporting service
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }, []);

  return {
    ...state,
    captureError,
    recoverFromError,
    retryLastAction,
    clearAllErrors,
    retryCount,
    canRetry: retryCount < maxRetries
  };
};

// Global error boundary hook
export const useGlobalErrorHandler = () => {
  const errorBoundary = useErrorBoundary({
    enableReporting: true,
    autoRecovery: true
  });

  // Handle unhandled promise rejections
  useState(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      errorBoundary.captureError(
        event.reason || 'Unhandled promise rejection',
        { type: 'unhandledRejection' },
        'high'
      );
    };

    const handleError = (event: ErrorEvent) => {
      errorBoundary.captureError(
        event.error || event.message,
        { 
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        },
        'high'
      );
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  });

  return errorBoundary;
};
