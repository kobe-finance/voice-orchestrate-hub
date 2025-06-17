
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface ProcessingJob {
  id: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  chunks: number;
  error?: string;
}

interface DocumentProcessorProps {
  jobs: ProcessingJob[];
  onRetry: (jobId: string) => void;
  onCancel: (jobId: string) => void;
}

export const DocumentProcessor: React.FC<DocumentProcessorProps> = ({
  jobs,
  onRetry,
  onCancel
}) => {
  const getStatusIcon = (status: ProcessingJob['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'processing':
        return <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: ProcessingJob['status']) => {
    const variants = {
      pending: 'secondary',
      processing: 'default',
      completed: 'default',
      failed: 'destructive'
    } as const;

    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Document Processing Queue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No documents in processing queue
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <h4 className="font-medium">{job.fileName}</h4>
                      <p className="text-sm text-gray-600">
                        {job.chunks > 0 ? `${job.chunks} chunks created` : 'Processing...'}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(job.status)}
                </div>

                {job.status === 'processing' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2" />
                  </div>
                )}

                {job.error && (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-sm text-red-700">{job.error}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  {job.status === 'failed' && (
                    <Button size="sm" variant="outline" onClick={() => onRetry(job.id)}>
                      Retry
                    </Button>
                  )}
                  {job.status === 'processing' && (
                    <Button size="sm" variant="outline" onClick={() => onCancel(job.id)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
