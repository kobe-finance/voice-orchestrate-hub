import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  File,
  Folder,
  Search,
  Upload,
  Trash2,
  Archive,
  ListTree,
  Settings
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SearchInput } from "@/components/ui/search-input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import DocumentUploader from "@/components/rag/DocumentUploader";
import DocumentList from "@/components/rag/DocumentList";
import DocumentPreview from "@/components/rag/DocumentPreview";
import TagManager from "@/components/rag/TagManager";
import { DocumentFilters } from "@/components/rag/DocumentFilters";
import { DocumentType } from "@/types/document";

const DocumentManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [filter, setFilter] = useState({ status: 'all', priority: 'all' });

  // Mock document data
  const [documents, setDocuments] = useState<DocumentType[]>([
    {
      id: "1",
      name: "Product Manual.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadedBy: "John Doe",
      uploadDate: "2023-06-15",
      tags: ["manual", "product"],
      status: "approved",
      category: "product",
      expirationDate: "2025-06-15",
      versions: [
        { id: "v1", date: "2023-06-15", notes: "Initial upload" },
        { id: "v2", date: "2023-07-02", notes: "Updated pricing section" },
      ],
      content: "This is a sample product manual with instructions...",
    },
    {
      id: "2",
      name: "Customer FAQ.docx",
      type: "docx",
      size: "1.1 MB",
      uploadedBy: "Jane Smith",
      uploadDate: "2023-05-20",
      tags: ["faq", "customer-service"],
      status: "pending",
      category: "customer",
      expirationDate: "2024-05-20",
      versions: [
        { id: "v1", date: "2023-05-20", notes: "Initial upload" },
      ],
      content: "Frequently asked questions about our services...",
    },
    {
      id: "3",
      name: "Technical Specification.txt",
      type: "txt",
      size: "0.3 MB",
      uploadedBy: "Mike Johnson",
      uploadDate: "2023-07-10",
      tags: ["technical", "specs"],
      status: "approved",
      category: "technical",
      expirationDate: "2024-12-31",
      versions: [
        { id: "v1", date: "2023-07-10", notes: "Initial upload" },
      ],
      content: "Technical specifications for product XYZ...",
    },
  ]);

  const handleUpload = (files: FileList) => {
    // Process uploaded files
    Array.from(files).forEach(file => {
      const newDocument: DocumentType = {
        id: `${documents.length + 1}`,
        name: file.name,
        type: file.name.split('.').pop() || "",
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedBy: "Current User",
        uploadDate: new Date().toISOString().split('T')[0],
        tags: [],
        status: "pending",
        category: "uncategorized",
        expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        versions: [
          { id: `v1`, date: new Date().toISOString().split('T')[0], notes: "Initial upload" },
        ],
        content: "Processing content...",
      };
      
      setDocuments(prev => [...prev, newDocument]);
    });
    
    toast.success(`${files.length} document${files.length > 1 ? 's' : ''} uploaded successfully`);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast.success("Document deleted successfully");
    
    if (selectedDocument?.id === id) {
      setSelectedDocument(null);
    }
  };

  const handleArchiveDocument = (id: string) => {
    setDocuments(prev => 
      prev.map(doc => doc.id === id ? { ...doc, status: "archived" } : doc)
    );
    toast.success("Document archived successfully");
  };

  const handleApproveDocument = (id: string) => {
    setDocuments(prev => 
      prev.map(doc => doc.id === id ? { ...doc, status: "approved" } : doc)
    );
    toast.success("Document approved successfully");
  };

  const handleTagChange = (id: string, tags: string[]) => {
    setDocuments(prev => 
      prev.map(doc => doc.id === id ? { ...doc, tags } : doc)
    );
    setShowTagManager(false);
    toast.success("Tags updated successfully");
  };

  const handleCategoryChange = (id: string, category: string) => {
    setDocuments(prev => 
      prev.map(doc => doc.id === id ? { ...doc, category } : doc)
    );
    toast.success("Category updated successfully");
  };

  const filteredDocuments = documents.filter(doc => {
    // Filter by tab
    if (activeTab !== "all" && doc.status !== activeTab) return false;
    
    // Filter by search
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !doc.tags.join(" ").toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by status and priority filters
    if (filter.status !== 'all' && doc.status !== filter.status) return false;
    if (filter.priority !== 'all' && doc.priority !== filter.priority) return false;
    
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/conversation-flow")}
            >
              <ArrowLeft size={16} />
              <span className="ml-2">Back</span>
            </Button>
            <h1 className="text-xl font-semibold">Knowledge Base</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/rag-configuration")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configure RAG
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/knowledge-organization")}
            >
              <ListTree className="mr-2 h-4 w-4" />
              Organize
            </Button>
            <Button size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <SearchInput
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      icon={<Search size={16} />}
                      className="w-full"
                    />
                    <DocumentFilters filter={filter} onFilterChange={setFilter} />
                  </div>
                  
                  <Tabs 
                    defaultValue="all" 
                    value={activeTab} 
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="w-full grid grid-cols-4 h-9">
                      <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                      <TabsTrigger value="approved" className="text-xs">Approved</TabsTrigger>
                      <TabsTrigger value="pending" className="text-xs">Pending</TabsTrigger>
                      <TabsTrigger value="archived" className="text-xs">Archived</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <DocumentUploader onUpload={handleUpload} />
                  
                  <DocumentList 
                    documents={filteredDocuments}
                    onSelect={setSelectedDocument}
                    selectedId={selectedDocument?.id}
                    onDelete={handleDeleteDocument}
                    onArchive={handleArchiveDocument}
                    onApprove={handleApproveDocument}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            {selectedDocument ? (
              <DocumentPreview 
                document={selectedDocument} 
                onShowVersions={() => setShowVersionHistory(true)}
                onShowTags={() => setShowTagManager(true)}
                onCategoryChange={(category) => handleCategoryChange(selectedDocument.id, category)}
              />
            ) : (
              <div className="h-[600px] rounded-lg border-2 border-dashed border-muted flex flex-col items-center justify-center text-muted-foreground">
                <File size={48} className="mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">No document selected</h3>
                <p className="text-sm">Select a document from the list or upload a new one</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Version History Sheet */}
      {selectedDocument && (
        <Sheet open={showVersionHistory} onOpenChange={setShowVersionHistory}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Version History</SheetTitle>
              <SheetDescription>
                {selectedDocument.name} version history
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedDocument.versions.map((version) => (
                    <TableRow key={version.id}>
                      <TableCell className="font-medium">{version.id}</TableCell>
                      <TableCell>{version.date}</TableCell>
                      <TableCell>{version.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SheetContent>
        </Sheet>
      )}
      
      {/* Tag Manager Dialog */}
      {selectedDocument && (
        <Dialog open={showTagManager} onOpenChange={setShowTagManager}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Tags</DialogTitle>
              <DialogDescription>
                Add or remove tags for {selectedDocument.name}
              </DialogDescription>
            </DialogHeader>
            <TagManager 
              tags={selectedDocument.tags}
              onSave={(tags) => handleTagChange(selectedDocument.id, tags)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DocumentManagement;
