import React, { useState } from 'react';
import { File, Clock, Tag, Calendar, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentType } from '@/types/document';

interface DocumentPreviewProps {
  document: DocumentType;
  onShowVersions: () => void;
  onShowTags: () => void;
  onCategoryChange: (category: string) => void;
}

const DocumentPreview = ({ document, onShowVersions, onShowTags, onCategoryChange }: DocumentPreviewProps) => {
  
  const [activeTab, setActiveTab] = useState('preview');
  
  const getFileIcon = () => {
    return <File size={40} />;
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="p-2 bg-secondary rounded-md">
          {getFileIcon()}
        </div>
        <div className="flex-1 space-y-1 overflow-hidden">
          <CardTitle className="text-xl truncate">{document.name}</CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{document.size}</span>
            <span>•</span>
            <span>Uploaded on {document.uploadDate}</span>
            <span>•</span>
            <span>{document.status.charAt(0).toUpperCase() + document.status.slice(1)}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          
          <div className="border-b px-6">
            <TabsList className="h-14 bg-transparent p-0 gap-6">
              <TabsTrigger 
                value="preview" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3"
              >
                Preview
              </TabsTrigger>
              <TabsTrigger 
                value="metadata" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3"
              >
                Metadata
              </TabsTrigger>
              <TabsTrigger 
                value="chunking" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3"
              >
                Chunking
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="preview" className="p-6 space-y-6">
            <div className="border rounded-md p-4 h-[500px] overflow-auto bg-white">
              <p>{document.content}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="metadata" className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              
              <div>
                <h3 className="text-sm font-medium mb-2">Basic Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-36 text-sm text-muted-foreground">File Name</div>
                    <div className="text-sm">{document.name}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-36 text-sm text-muted-foreground">File Size</div>
                    <div className="text-sm">{document.size}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-36 text-sm text-muted-foreground">Upload Date</div>
                    <div className="text-sm">{document.uploadDate}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-36 text-sm text-muted-foreground">Uploaded By</div>
                    <div className="text-sm">{document.uploadedBy}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-36 text-sm text-muted-foreground">Status</div>
                    <div className="text-sm capitalize">{document.status}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Classification</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-36 text-sm text-muted-foreground">Category</div>
                    <div className="flex-1">
                      <Select 
                        defaultValue={document.category} 
                        onValueChange={onCategoryChange}
                      >
                        <SelectTrigger className="h-8 w-full bg-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                          <SelectItem value="uncategorized">Uncategorized</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-36 text-sm text-muted-foreground">Tags</div>
                    <div className="flex-1 flex flex-wrap gap-1">
                      {document.tags.length > 0 ? (
                        document.tags.map((tag) => (
                          <span key={tag} className="bg-secondary text-xs px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No tags</span>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 ml-1" 
                        onClick={onShowTags}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-36 text-sm text-muted-foreground">Expiration Date</div>
                    <div className="text-sm">{document.expirationDate}</div>
                  </div>
                </div>
                
                <h3 className="text-sm font-medium mt-6 mb-2">Version Control</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onShowVersions} 
                  className="w-full flex items-center justify-center gap-2 mt-1"
                >
                  <Clock size={14} />
                  View Version History
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="chunking" className="p-6 space-y-6">
            
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Document Chunks</h3>
                <Select defaultValue="auto">
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue placeholder="Chunking Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="paragraph">Paragraph</SelectItem>
                    <SelectItem value="fixed">Fixed Size</SelectItem>
                    <SelectItem value="semantic">Semantic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3 border rounded-md p-3 bg-secondary/50">
                <div className="border border-primary rounded-md p-3 bg-white">
                  <div className="text-xs text-muted-foreground mb-1">Chunk #1</div>
                  <p className="text-sm">This is the first section of the document content...</p>
                </div>
                
                <div className="border rounded-md p-3 bg-white">
                  <div className="text-xs text-muted-foreground mb-1">Chunk #2</div>
                  <p className="text-sm">This is another section with different information...</p>
                </div>
                
                <div className="border rounded-md p-3 bg-white">
                  <div className="text-xs text-muted-foreground mb-1">Chunk #3</div>
                  <p className="text-sm">The final section with conclusion and other details...</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" className="mr-2">Reset Chunks</Button>
                <Button variant="default" size="sm">Save Chunks</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentPreview;
