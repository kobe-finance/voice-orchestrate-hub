
import React from 'react';
import { AlertTriangle, RefreshCw, X, Bug, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ErrorInfo } from '@/hooks/useErrorBoundary';
import { cn } from '@/lib/utils';

interface ErrorRecoveryProps {
  error: ErrorInfo;
  onRecover: () => void;
  onRetry: () => void;
  onDismiss: () => void;
  canRetry: boolean;
  className?: string;
}

export const ErrorRecovery: React.FC<ErrorRecoveryProps> = ({
  error,
  onRecover,
  onRetry,
  onDismiss,
  canRetry,
  className
}) => {
  const getSeverityColor = (severity: ErrorInfo['severity']) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: ErrorInfo['severity']) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <Bug className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <Card className={cn("border-l-4 border-l-red-500", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getSeverityIcon(error.severity)}
            <CardTitle className="text-lg">Error Occurred</CardTitle>
            <Badge className={getSeverityColor(error.severity)}>
              {error.severity.toUpperCase()}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {error.message}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          {error.recoverable && (
            <Button
              onClick={onRecover}
              className="flex items-center gap-2"
              size="sm"
            >
              <Shield className="h-4 w-4" />
              Auto Recover
            </Button>
          )}
          
          {canRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="flex items-center gap-2"
              size="sm"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          )}
        </div>

        {error.context && Object.keys(error.context).length > 0 && (
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs">
                Show Error Details
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 p-3 bg-muted rounded-md">
                <h4 className="text-sm font-medium mb-2">Error Context:</h4>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(error.context, null, 2)}
                </pre>
                {error.stack && (
                  <details className="mt-2">
                    <summary className="text-xs font-medium cursor-pointer">
                      Stack Trace
                    </summary>
                    <pre className="text-xs mt-1 overflow-auto whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        <div className="text-xs text-muted-foreground">
          Error ID: {error.id} • {error.timestamp.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

// Error boundary fallback component
interface ErrorFallbackProps {
  errors: ErrorInfo[];
  onRecover: (errorId?: string) => void;
  onRetry: () => void;
  onClearAll: () => void;
  canRetry: boolean;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  errors,
  onRecover,
  onRetry,
  onClearAll,
  canRetry
}) => {
  if (errors.length === 0) return null;

  const criticalErrors = errors.filter(e => e.severity === 'critical');
  const hasCriticalErrors = criticalErrors.length > 0;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full max-h-[80vh] overflow-auto space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {hasCriticalErrors ? 'Critical Error' : 'Application Error'}
          </h2>
          <p className="text-muted-foreground">
            {hasCriticalErrors 
              ? 'A critical error has occurred. The application may be unstable.'
              : 'Some errors have occurred. You can try to recover or continue.'
            }
          </p>
        </div>

        <div className="space-y-3">
          {errors.map((error) => (
            <ErrorRecovery
              key={error.id}
              error={error}
              onRecover={() => onRecover(error.id)}
              onRetry={onRetry}
              onDismiss={() => onRecover(error.id)}
              canRetry={canRetry && error.recoverable}
            />
          ))}
        </div>

        <div className="flex justify-center gap-2 pt-4">
          <Button onClick={onClearAll} variant="outline">
            Clear All Errors
          </Button>
          <Button onClick={() => window.location.reload()} variant="destructive">
            Reload Application
          </Button>
        </div>
      </div>
    </div>
  );
};
