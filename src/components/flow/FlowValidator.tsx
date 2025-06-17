
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

interface ValidationIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  nodeId?: string;
  message: string;
  suggestion?: string;
}

interface FlowValidatorProps {
  issues: ValidationIssue[];
  onFixIssue: (issueId: string) => void;
  onValidate: () => void;
  isValidating: boolean;
}

export const FlowValidator: React.FC<FlowValidatorProps> = ({
  issues,
  onFixIssue,
  onValidate,
  isValidating
}) => {
  const getIssueIcon = (type: ValidationIssue['type']) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getIssueBadge = (type: ValidationIssue['type']) => {
    const colors = {
      error: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      info: 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge variant="outline" className={colors[type]}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const errorCount = issues.filter(i => i.type === 'error').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;
  const infoCount = issues.filter(i => i.type === 'info').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Flow Validation
            {issues.length === 0 && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
          </CardTitle>
          <Button 
            size="sm" 
            onClick={onValidate}
            disabled={isValidating}
          >
            {isValidating ? 'Validating...' : 'Validate'}
          </Button>
        </div>
        {issues.length > 0 && (
          <div className="flex gap-2">
            {errorCount > 0 && (
              <Badge variant="destructive">{errorCount} errors</Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {warningCount} warnings
              </Badge>
            )}
            {infoCount > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {infoCount} info
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {issues.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p>Flow validation passed! No issues found.</p>
            </div>
          ) : (
            issues.map((issue) => (
              <div key={issue.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getIssueIcon(issue.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getIssueBadge(issue.type)}
                        {issue.nodeId && (
                          <Badge variant="outline" className="text-xs">
                            Node: {issue.nodeId}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium">{issue.message}</p>
                      {issue.suggestion && (
                        <p className="text-xs text-gray-600 mt-1">
                          Suggestion: {issue.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onFixIssue(issue.id)}
                  >
                    Fix
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
