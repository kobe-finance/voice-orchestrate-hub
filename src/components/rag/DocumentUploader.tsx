
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface DocumentUploaderProps {
  onUpload: (files: FileList) => void;
}

const DocumentUploader = ({ onUpload }: DocumentUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const dataTransfer = new DataTransfer();
      acceptedFiles.forEach(file => {
        dataTransfer.items.add(file);
      });
      onUpload(dataTransfer.files);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/html': ['.html', '.htm'],
      'application/json': ['.json'],
      'text/csv': ['.csv']
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted hover:border-muted-foreground/50'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center py-4">
        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-sm font-medium">
          {isDragActive ? 'Drop files here' : 'Drag & drop files or click to browse'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Supported formats: PDF, DOCX, TXT, HTML, CSV, JSON
        </p>
      </div>
    </div>
  );
};

export default DocumentUploader;
