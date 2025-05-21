
import React, { useState } from 'react';
import { File, Check, Move, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DocumentType, CategoryType } from '@/types/document';
import TagManager from '@/components/rag/TagManager';

interface DocumentsGridProps {
  documents: DocumentType[];
  selectedDocuments: DocumentType[];
  onSelectDocuments: (documents: DocumentType[]) => void;
  categories: CategoryType[];
  onMoveDocuments: (categoryId: string) => void;
  onBulkTag: (tags: string[]) => void;
}

export const DocumentsGrid = ({
  documents,
  selectedDocuments,
  onSelectDocuments,
  categories,
  onMoveDocuments,
  onBulkTag
}: DocumentsGridProps) => {
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [bulkTags, setBulkTags] = useState<string[]>([]);
  
  const handleSelectDocument = (document: DocumentType) => {
    if (selectedDocuments.some(doc => doc.id === document.id)) {
      onSelectDocuments(selectedDocuments.filter(doc => doc.id !== document.id));
    } else {
      onSelectDocuments([...selectedDocuments, document]);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      onSelectDocuments([]);
    } else {
      onSelectDocuments([...documents]);
    }
  };
  
  const getFileIcon = (type: string) => {
    return <File size={16} />;
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getCategoryName = (categoryId: string) => {
    // Find category in flat structure
    let name = "Uncategorized";
    
    const findInCategories = (cats: CategoryType[]) => {
      for (const cat of cats) {
        if (cat.id === categoryId) {
          return cat.name;
        }
        if (cat.children.length > 0) {
          const childResult = findInCategories(cat.children);
          if (childResult) return childResult;
        }
      }
      return null;
    };
    
    const result = findInCategories(categories);
    if (result) name = result;
    
    return name;
  };
  
  const handleTagSave = (tags: string[]) => {
    onBulkTag(tags);
    setShowTagDialog(false);
    setBulkTags([]);
  };
  
  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No documents found in this category</p>
      </div>
    );
  }
  
  return (
    <div>
      {/* Bulk actions */}
      {documents.length > 0 && (
        <div className="flex items-center justify-between mb-4 bg-secondary/50 p-2 rounded-md">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={selectedDocuments.length === documents.length && documents.length > 0}
              onCheckedChange={handleSelectAll} 
              id="select-all"
            />
            <label 
              htmlFor="select-all" 
              className="text-sm cursor-pointer"
            >
              Select all ({documents.length})
            </label>
          </div>
          
          {selectedDocuments.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {selectedDocuments.length} selected
              </span>
              
              {/* Move action */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7">
                    <Move className="h-3.5 w-3.5 mr-1" />
                    Move
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <div className="max-h-[300px] overflow-y-auto">
                    {categories.map((category) => (
                      <React.Fragment key={category.id}>
                        <DropdownMenuItem onClick={() => onMoveDocuments(category.id)}>
                          {category.name}
                        </DropdownMenuItem>
                        
                        {category.children.map((subcategory) => (
                          <DropdownMenuItem 
                            key={subcategory.id}
                            onClick={() => onMoveDocuments(subcategory.id)}
                            className="pl-6"
                          >
                            {subcategory.name}
                          </DropdownMenuItem>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Tag action */}
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7"
                onClick={() => setShowTagDialog(true)}
              >
                <Tag className="h-3.5 w-3.5 mr-1" />
                Add Tags
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Documents grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {documents.map((doc) => (
          <div 
            key={doc.id} 
            className={`p-3 rounded-md border flex items-start cursor-pointer group
              ${selectedDocuments.some(d => d.id === doc.id) ? 'bg-secondary border-primary' : 'hover:bg-secondary/50'}`}
          >
            <Checkbox
              checked={selectedDocuments.some(d => d.id === doc.id)}
              onCheckedChange={() => handleSelectDocument(doc)}
              className="mr-3 mt-1"
            />
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-2">
                      {getFileIcon(doc.type)}
                    </span>
                    <h4 className="text-sm font-medium truncate">{doc.name}</h4>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>{doc.uploadDate}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(doc.status)}`}>
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                  
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(doc.priority || "medium")}`}>
                    {(doc.priority || "medium").charAt(0).toUpperCase() + (doc.priority || "medium").slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {doc.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="bg-secondary text-xs px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-2 text-xs">
                <span className="text-muted-foreground">Category: </span>
                <span>{getCategoryName(doc.category)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Bulk Tag Dialog */}
      <Dialog open={showTagDialog} onOpenChange={setShowTagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tags to {selectedDocuments.length} Documents</DialogTitle>
            <DialogDescription>
              These tags will be added to all selected documents
            </DialogDescription>
          </DialogHeader>
          <TagManager 
            tags={bulkTags}
            onSave={handleTagSave}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
