
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  Search, 
  Filter, 
  MoreVertical,
  Download,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageLayout } from '@/components/layouts/PageLayout';
import { useNavigate } from 'react-router-dom';

interface ProcessingJob {
  id: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  chunks: number;
  error?: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: string;
  chunks: number;
}

// Simple DocumentProcessor component since the import was failing
const DocumentProcessor: React.FC<{
  jobs: ProcessingJob[];
  onRetry: (jobId: string) => void;
  onCancel: (jobId: string) => void;
}> = ({ jobs, onRetry, onCancel }) => {
  const getStatusIcon = (status: ProcessingJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Queue</CardTitle>
        <CardDescription>Monitor document processing status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No processing jobs</p>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(job.status)}
                    <span className="font-medium">{job.fileName}</span>
                  </div>
                  <div className="flex space-x-2">
                    {job.status === 'failed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRetry(job.id)}
                      >
                        Retry
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCancel(job.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
                {job.status === 'processing' && (
                  <Progress value={job.progress} className="mb-2" />
                )}
                {job.error && (
                  <p className="text-sm text-red-500">{job.error}</p>
                )}
                <div className="text-sm text-muted-foreground">
                  Status: {job.status} • Chunks: {job.chunks}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const KnowledgeBase = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [processingJobs, setProcessingJobs] = useState<ProcessingJob[]>([
    {
      id: '1',
      fileName: 'product-documentation.pdf',
      status: 'processing',
      progress: 65,
      chunks: 12
    },
    {
      id: '2',
      fileName: 'user-manual.docx',
      status: 'completed',
      progress: 100,
      chunks: 8
    },
    {
      id: '3',
      fileName: 'troubleshooting-guide.pdf',
      status: 'failed',
      progress: 0,
      chunks: 0,
      error: 'Failed to extract text from PDF'
    }
  ]);

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Product Specs',
      type: 'PDF',
      size: '2.5 MB',
      uploadedAt: '2024-08-01',
      status: 'ready',
      chunks: 10
    },
    {
      id: '2',
      name: 'User Guide',
      type: 'DOCX',
      size: '1.8 MB',
      uploadedAt: '2024-08-05',
      status: 'ready',
      chunks: 5
    },
    {
      id: '3',
      name: 'API Documentation',
      type: 'PDF',
      size: '3.2 MB',
      uploadedAt: '2024-08-10',
      status: 'processing',
      chunks: 0
    },
  ]);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast.success(`${file.name} uploaded successfully`);
        }
      }, 200);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const searchMatch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = selectedCategory === 'all' || doc.type.toLowerCase() === selectedCategory;
    return searchMatch && categoryMatch;
  });

  const handleRetryJob = (jobId: string) => {
    setProcessingJobs(prev => 
      prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'pending' as const, progress: 0, error: undefined }
          : job
      )
    );
    
    // Simulate processing restart
    setTimeout(() => {
      setProcessingJobs(prev => 
        prev.map(job => 
          job.id === jobId 
            ? { ...job, status: 'processing' as const, progress: 10 }
            : job
        )
      );
    }, 1000);

    toast.success('Job restarted');
  };

  const handleCancelJob = (jobId: string) => {
    setProcessingJobs(prev => prev.filter(job => job.id !== jobId));
    toast.success('Job cancelled');
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Knowledge Base" }
  ];

  const actions = (
    <>
      <Button variant="outline" size="sm" onClick={() => navigate('/knowledge-base-organization')}>
        <Settings className="mr-2 h-4 w-4" />
        Organize
      </Button>
      <Button asChild size="sm">
        <label htmlFor="upload-file">
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
          <input
            type="file"
            id="upload-file"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </Button>
    </>
  );

  return (
    <PageLayout
      title="Knowledge Base"
      description="Manage documents and data for AI processing"
      breadcrumbs={breadcrumbs}
      actions={actions}
    >
      <div className="space-y-6">
        {isUploading && (
          <Card>
            <CardHeader>
              <CardTitle>Uploading Document</CardTitle>
              <CardDescription>Please wait while your document is being uploaded.</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={uploadProgress} />
              <p className="text-sm text-muted-foreground mt-2">{uploadProgress}%</p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="documents" className="space-y-4">
          <TabsList>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="processing">Processing Queue</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Input
                  type="search"
                  placeholder="Search documents..."
                  className="max-w-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-2">
                      <Filter className="mr-2 h-4 w-4" />
                      Category
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelectedCategory('all')}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory('pdf')}>
                      PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory('docx')}>
                      DOCX
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Document List</CardTitle>
                <CardDescription>Manage your uploaded documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {filteredDocuments.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <p className="text-sm text-gray-500">{doc.type} - {doc.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{doc.status}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            <DocumentProcessor 
              jobs={processingJobs}
              onRetry={handleRetryJob}
              onCancel={handleCancelJob}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default KnowledgeBase;
