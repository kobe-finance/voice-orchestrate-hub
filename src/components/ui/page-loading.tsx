
import React from 'react';
import { Loading, Skeleton } from './loading';
import { Card, CardContent, CardHeader } from './card';
import { cn } from '@/lib/utils';

interface PageLoadingProps {
  type?: 'full' | 'content' | 'skeleton';
  text?: string;
  className?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  type = 'content',
  text = 'Loading...',
  className
}) => {
  if (type === 'full') {
    return (
      <div className={cn("flex items-center justify-center min-h-[400px]", className)}>
        <Loading size="lg" text={text} />
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        {/* Content skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <Loading text={text} />
    </div>
  );
};
