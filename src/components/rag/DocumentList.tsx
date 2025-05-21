import React from 'react';
import { File, Trash2, Archive, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentType } from '@/types/document';

interface DocumentListProps {
  documents: DocumentType[];
  selectedId: string | undefined;
  onSelect: (document: DocumentType) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onApprove: (id: string) => void;
}

const DocumentList = ({ 
  documents, 
  selectedId, 
  onSelect, 
  onDelete, 
  onArchive, 
  onApprove 
}: DocumentListProps) => {
  
  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No documents found</p>
      </div>
    );
  }
  
  const getFileIcon = (type: string) => {
    return <File size={16} />;
  };
  
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      approved: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      archived: "bg-gray-100 text-gray-800",
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
      {documents.map((doc) => (
        <div 
          key={doc.id} 
          className={`p-3 rounded-md border flex items-start justify-between cursor-pointer group
            ${selectedId === doc.id ? 'bg-secondary border-primary' : 'hover:bg-secondary/50'}`}
          onClick={() => onSelect(doc)}
        >
          <div className="flex items-center gap-3">
            <div className="text-muted-foreground">
              {getFileIcon(doc.type)}
            </div>
            <div>
              <p className="text-sm font-medium truncate max-w-[180px]">{doc.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{doc.size}</span>
                <span>•</span>
                <span>{doc.uploadDate}</span>
              </div>
              <div className="mt-1">
                {getStatusBadge(doc.status)}
              </div>
            </div>
          </div>
          
          <div className="hidden group-hover:flex items-center gap-1">
            {doc.status === 'pending' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove(doc.id);
                }}
                title="Approve"
              >
                <Check size={14} />
              </Button>
            )}
            
            {doc.status !== 'archived' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(doc.id);
                }}
                title="Archive"
              >
                <Archive size={14} />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(doc.id);
              }}
              title="Delete"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
