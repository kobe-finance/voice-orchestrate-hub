
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  ListTree, 
  ArrowDown, 
  ArrowUp, 
  Trash2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchInput } from '@/components/ui/search-input';
import { DocumentType } from '@/types/document';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface RelatedDocumentsProps {
  documents: DocumentType[];
}

interface RelationItem {
  id: string;
  sourceId: string;
  targetId: string;
  strength: number; // 1-10
  manual: boolean;
}

export const RelatedDocuments = ({ documents }: RelatedDocumentsProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  
  // Mock relations data
  const [relations, setRelations] = useState<RelationItem[]>([
    {
      id: 'rel1',
      sourceId: '1', // Product Manual
      targetId: '3', // Technical Specification
      strength: 8,
      manual: true
    },
    {
      id: 'rel2',
      sourceId: '2', // Customer FAQ
      targetId: '1', // Product Manual
      strength: 6,
      manual: false
    },
    {
      id: 'rel3',
      sourceId: '3', // Technical Specification
      targetId: '4', // Terms of Service
      strength: 4,
      manual: false
    }
  ]);
  
  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getRelatedDocuments = (docId: string) => {
    return relations
      .filter(rel => rel.sourceId === docId || rel.targetId === docId)
      .map(rel => {
        const otherDocId = rel.sourceId === docId ? rel.targetId : rel.sourceId;
        const otherDoc = documents.find(d => d.id === otherDocId);
        const direction = rel.sourceId === docId ? 'outgoing' : 'incoming';
        
        return {
          relation: rel,
          document: otherDoc,
          direction
        };
      });
  };
  
  const handleDeleteRelation = (relationId: string) => {
    setRelations(relations.filter(rel => rel.id !== relationId));
  };
  
  const handleCreateRelation = (targetId: string) => {
    if (!selectedDocument) return;
    
    // Check if relation already exists
    const exists = relations.some(
      rel => 
        (rel.sourceId === selectedDocument.id && rel.targetId === targetId) || 
        (rel.sourceId === targetId && rel.targetId === selectedDocument.id)
    );
    
    if (!exists) {
      const newRelation: RelationItem = {
        id: `rel${Date.now()}`,
        sourceId: selectedDocument.id,
        targetId,
        strength: 5,
        manual: true
      };
      
      setRelations([...relations, newRelation]);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Document selector */}
        <div className="space-y-4">
          <div className="font-medium">Select Document</div>
          <SearchInput 
            placeholder="Search documents..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
            icon={<Search size={16} />}
          />
          
          <div className="border rounded-md overflow-hidden max-h-[400px] overflow-y-auto">
            <Table>
              <TableBody>
                {filteredDocuments.map(doc => (
                  <TableRow 
                    key={doc.id} 
                    className={`cursor-pointer ${selectedDocument?.id === doc.id ? 'bg-secondary' : ''}`}
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <TableCell className="py-2">
                      <div className="font-medium text-sm">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">{doc.type} • {doc.size}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Relationship display */}
        <div className="md:col-span-2">
          {selectedDocument ? (
            <div className="space-y-4">
              <div className="font-medium">
                Related Documents for "{selectedDocument.name}"
              </div>
              
              <div className="bg-secondary/50 p-4 rounded-md">
                <div className="flex items-center gap-2">
                  <ListTree size={16} />
                  <span className="text-sm">Currently showing relationships for this document</span>
                </div>
              </div>
              
              {getRelatedDocuments(selectedDocument.id).length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Document</TableHead>
                        <TableHead className="w-[20%]">Relationship</TableHead>
                        <TableHead className="w-[20%]">Strength</TableHead>
                        <TableHead className="w-[20%]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getRelatedDocuments(selectedDocument.id).map(({ relation, document, direction }) => (
                        <TableRow key={relation.id}>
                          <TableCell className="py-2">
                            <div className="font-medium text-sm">{document?.name}</div>
                            <div className="text-xs text-muted-foreground">{document?.type} • {document?.size}</div>
                          </TableCell>
                          <TableCell>
                            {direction === 'outgoing' ? (
                              <div className="flex items-center text-xs">
                                <ArrowDown className="h-3 w-3 mr-1 rotate-[135deg]" />
                                References
                              </div>
                            ) : (
                              <div className="flex items-center text-xs">
                                <ArrowUp className="h-3 w-3 mr-1 rotate-[135deg]" />
                                Referenced by
                              </div>
                            )}
                            {relation.manual && (
                              <span className="text-xs text-muted-foreground">(Manual)</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-full bg-secondary rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${relation.strength * 10}%` }}
                                ></div>
                              </div>
                              <span className="text-xs ml-2">{relation.strength}/10</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-7 px-2 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteRelation(relation.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="border rounded-md p-8 text-center text-muted-foreground">
                  <p>No related documents found for this document</p>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <div className="font-medium text-sm mb-2">Add new relationship</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {documents
                    .filter(doc => 
                      doc.id !== selectedDocument.id && 
                      !getRelatedDocuments(selectedDocument.id).some(rel => rel.document?.id === doc.id)
                    )
                    .slice(0, 3)
                    .map(doc => (
                      <Button 
                        key={doc.id} 
                        variant="outline" 
                        className="justify-start font-normal text-sm h-auto py-2"
                        onClick={() => handleCreateRelation(doc.id)}
                      >
                        <Plus className="h-3.5 w-3.5 mr-2" />
                        <div className="truncate">
                          {doc.name}
                        </div>
                      </Button>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="border rounded-md p-8 text-center text-muted-foreground">
              <p>Select a document to view and manage relationships</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
