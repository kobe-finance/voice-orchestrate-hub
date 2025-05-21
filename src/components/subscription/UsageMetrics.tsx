
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UsageMetric } from '@/types/subscription';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface UsageMetricsProps {
  metrics: UsageMetric[];
}

export function UsageMetrics({ metrics }: UsageMetricsProps) {
  // Filter metrics that are near their limit (> 80%)
  const nearLimitMetrics = metrics.filter(metric => 
    (metric.currentUsage / metric.limit) > 0.8 && (metric.currentUsage / metric.limit) < 1
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage & Limits</CardTitle>
        <CardDescription>Monitor your current resource usage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {nearLimitMetrics.length > 0 && (
          <Alert variant="destructive" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You're approaching your usage limits on {nearLimitMetrics.length} resource{nearLimitMetrics.length > 1 ? 's' : ''}. Consider upgrading your plan.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          {metrics.map((metric) => {
            const usagePercent = (metric.currentUsage / metric.limit) * 100;
            let progressColor = "bg-primary";
            
            if (usagePercent > 90) {
              progressColor = "bg-red-500";
            } else if (usagePercent > 75) {
              progressColor = "bg-amber-500";
            }
            
            return (
              <div key={metric.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{metric.name}</span>
                  <span className="text-muted-foreground">
                    {metric.currentUsage} / {metric.limit} {metric.unit}
                  </span>
                </div>
                <Progress 
                  value={usagePercent} 
                  className="h-2"
                  indicatorClassName={progressColor}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
