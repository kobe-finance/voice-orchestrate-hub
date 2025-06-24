
import { useState, useCallback } from 'react';
import { useErrorBoundary } from './useErrorBoundary';

export interface PageError {
  message: string;
  code?: string;
  retry?: () => void;
}

export interface UsePageStateOptions {
  initialLoading?: boolean;
  onError?: (error: PageError) => void;
}

export const usePageState = (options: UsePageStateOptions = {}) => {
  const [isLoading, setIsLoading] = useState(options.initialLoading || false);
  const [error, setError] = useState<PageError | null>(null);
  const { captureError } = useErrorBoundary();

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
    if (loading) {
      setError(null); // Clear errors when starting new loading
    }
  }, []);

  const setPageError = useCallback((error: PageError | string) => {
    const errorObj = typeof error === 'string' ? { message: error } : error;
    setError(errorObj);
    setIsLoading(false);
    
    // Also capture for global error handling
    captureError(errorObj.message, { pageError: true }, 'medium');
    
    options.onError?.(errorObj);
  }, [captureError, options.onError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retry = useCallback(() => {
    if (error?.retry) {
      clearError();
      error.retry();
    }
  }, [error, clearError]);

  return {
    isLoading,
    error,
    setLoading,
    setError: setPageError,
    clearError,
    retry,
    hasError: !!error
  };
};
