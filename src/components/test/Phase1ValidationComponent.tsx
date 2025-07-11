/**
 * Phase 1 Validation Component
 * UI component to test and display Phase 1 validation results
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Play, Loader2 } from 'lucide-react';
import validatePhase1 from '@/services/api/phase1-validator';

export const Phase1ValidationComponent: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runValidation = async () => {
    setIsRunning(true);
    setResults(null);
    
    try {
      const validationResults = await validatePhase1();
      setResults(validationResults);
    } catch (error) {
      console.error('Validation failed:', error);
      setResults({
        success: false,
        results: { passed: 0, failed: 1, tests: [] },
        summary: { passed: 0, failed: 1, successRate: 0 },
        error: error instanceof Error ? error.message : 'Validation failed'
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Phase 1: API Client Foundation Validation</span>
          <Badge variant={results?.success ? 'default' : 'destructive'}>
            {results ? (results.success ? 'COMPLETE' : 'NEEDS WORK') : 'PENDING'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={runValidation} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running Validation...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Phase 1 Validation
              </>
            )}
          </Button>
          
          {results && (
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                {results.summary.passed} Passed
              </span>
              <span className="flex items-center gap-1 text-red-600">
                <XCircle className="h-4 w-4" />
                {results.summary.failed} Failed
              </span>
              <span className="font-medium">
                Success Rate: {results.summary.successRate.toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        {results && (
          <div className="space-y-2">
            <h3 className="font-medium">Validation Results:</h3>
            <div className="space-y-2">
              {results.results.tests.map((test: any, index: number) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {test.passed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-medium">{test.name}</span>
                  </div>
                  {test.details && (
                    <span className="text-sm text-muted-foreground">
                      {test.details}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {results?.error && (
          <div className="p-3 border border-red-200 rounded-lg bg-red-50">
            <p className="text-red-800 font-medium">Validation Error:</p>
            <p className="text-red-600 text-sm">{results.error}</p>
          </div>
        )}

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Phase 1 Deliverables Checklist:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>✅ src/services/api/base.ts - Core HTTP client</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>✅ src/services/api/types.ts - API type definitions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>✅ src/services/api/errors.ts - Error handling</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>✅ src/services/api/integrations.ts - Integration API</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>✅ src/services/api/organizations.ts - Tenant API</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>✅ src/services/api/analytics.ts - Analytics API</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>✅ src/services/api/agents.ts - Agent management</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>✅ src/services/api/index.ts - Unified API export</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Phase1ValidationComponent;