
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
  Settings,
  Database,
  BarChart3,
  TestTube
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
import { CategoryTree } from "@/components/rag/CategoryTree";
import { DocumentsGrid } from "@/components/rag/DocumentsGrid";
import { RelatedDocuments } from "@/components/rag/RelatedDocuments";
import { DocumentType, CategoryType } from "@/types/document";

const KnowledgeBase: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("documents");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [filter, setFilter] = useState({ status: 'all', priority: 'all' });
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentType[]>([]);

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
      category: "cat1-2",
      priority: "high",
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
      category: "cat3-1",
      priority: "medium",
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
      category: "cat1-2",
      priority: "high",
      expirationDate: "2024-12-31",
      versions: [
        { id: "v1", date: "2023-07-10", notes: "Initial upload" },
      ],
      content: "Technical specifications for product XYZ...",
    },
  ]);

  // Mock categories data
  const [categories, setCategories] = useState<CategoryType[]>([
    {
      id: "cat1",
      name: "Product Documentation",
      parentId: null,
      priority: "high",
      children: [
        {
          id: "cat1-1",
          name: "User Guides",
          parentId: "cat1",
          priority: "medium",
          children: []
        },
        {
          id: "cat1-2",
          name: "Technical Specifications",
          parentId: "cat1",
          priority: "high",
          children: []
        }
      ]
    },
    {
      id: "cat2",
      name: "Legal Documents",
      parentId: null,
      priority: "medium",
      children: []
    },
    {
      id: "cat3",
      name: "Support Resources",
      parentId: null,
      priority: "low",
      children: [
        {
          id: "cat3-1",
          name: "Troubleshooting",
          parentId: "cat3",
          priority: "medium",
          children: []
        }
      ]
    }
  ]);

  const handleUpload = (files: FileList) => {
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
        priority: "medium",
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

  const handleMoveDocuments = (targetCategoryId: string) => {
    if (selectedDocuments.length === 0) {
      toast.error("No documents selected");
      return;
    }
    
    const updatedDocuments = documents.map(doc => 
      selectedDocuments.some(selectedDoc => selectedDoc.id === doc.id)
        ? { ...doc, category: targetCategoryId }
        : doc
    );
    
    setDocuments(updatedDocuments);
    setSelectedDocuments([]);
    
    toast.success(`${selectedDocuments.length} document(s) moved successfully`);
  };

  const handleBulkTag = (tags: string[]) => {
    if (selectedDocuments.length === 0) {
      toast.error("No documents selected");
      return;
    }
    
    const updatedDocuments = documents.map(doc => 
      selectedDocuments.some(selectedDoc => selectedDoc.id === doc.id)
        ? { ...doc, tags: [...new Set([...doc.tags, ...tags])] }
        : doc
    );
    
    setDocuments(updatedDocuments);
    toast.success(`Tags added to ${selectedDocuments.length} document(s)`);
  };

  const filteredDocuments = documents.filter(doc => {
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !doc.tags.join(" ").toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filter.status !== 'all' && doc.status !== filter.status) return false;
    if (filter.priority !== 'all' && doc.priority !== filter.priority) return false;
    
    return true;
  });

  const handleBackNavigation = () => {
    try {
      navigate("/dashboard");
    } catch (error) {
      console.error("Navigation error:", error);
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackNavigation}
            >
              <ArrowLeft size={16} />
              <span className="ml-2">Back</span>
            </Button>
            <h1 className="text-xl font-semibold">Knowledge Base</h1>
          </div>
          <div className="flex gap-2">
            <Button size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <File size={16} />
              Documents
            </TabsTrigger>
            <TabsTrigger value="organization" className="flex items-center gap-2">
              <ListTree size={16} />
              Organization
            </TabsTrigger>
            <TabsTrigger value="configuration" className="flex items-center gap-2">
              <Settings size={16} />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-2">
              <TestTube size={16} />
              Testing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents">
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
          </TabsContent>

          <TabsContent value="organization">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Categories</h3>
                      <Button variant="outline" size="sm">
                        Add Category
                      </Button>
                    </div>
                    <CategoryTree 
                      categories={categories}
                      selectedCategory={selectedCategory}
                      onSelectCategory={setSelectedCategory}
                      onCreateCategory={() => {}}
                      onDeleteCategory={() => {}}
                      onUpdateCategory={() => {}}
                      onPriorityChange={() => {}}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <h3 className="text-lg font-medium">
                          {selectedCategory ? selectedCategory.name : 'All Documents'}
                        </h3>
                        {selectedCategory && (
                          <span className="text-sm text-muted-foreground">
                            {filteredDocuments.length} documents
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <DocumentFilters 
                          filter={filter}
                          onFilterChange={setFilter}
                        />
                        <SearchInput 
                          placeholder="Search documents..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          icon={<Search size={16} />}
                          className="w-60"
                        />
                      </div>
                    </div>
                    
                    <DocumentsGrid
                      documents={filteredDocuments}
                      selectedDocuments={selectedDocuments}
                      onSelectDocuments={setSelectedDocuments}
                      categories={categories}
                      onMoveDocuments={handleMoveDocuments}
                      onBulkTag={handleBulkTag}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="configuration">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">RAG Configuration</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded">
                        <h4 className="font-medium mb-2">Chunk Size</h4>
                        <p className="text-2xl font-bold">512</p>
                        <p className="text-sm text-muted-foreground">tokens</p>
                      </div>
                      <div className="p-4 border rounded">
                        <h4 className="font-medium mb-2">Overlap</h4>
                        <p className="text-2xl font-bold">20%</p>
                        <p className="text-sm text-muted-foreground">overlap ratio</p>
                      </div>
                    </div>
                    <div className="p-4 border rounded">
                      <h4 className="font-medium mb-2">Embedding Model</h4>
                      <p className="text-sm">text-embedding-ada-002</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 border rounded">
                      <h4 className="font-medium">Accuracy</h4>
                      <p className="text-2xl font-bold text-green-600">92%</p>
                    </div>
                    <div className="p-4 border rounded">
                      <h4 className="font-medium">Response Time</h4>
                      <p className="text-2xl font-bold text-blue-600">1.2s</p>
                    </div>
                    <div className="p-4 border rounded">
                      <h4 className="font-medium">Relevance Score</h4>
                      <p className="text-2xl font-bold text-purple-600">0.85</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="testing">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">RAG Testing Interface</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter your test query..." 
                      className="flex-1"
                    />
                    <Button>Test Query</Button>
                  </div>
                  <div className="border rounded-md p-4 min-h-[200px] bg-secondary/20">
                    <p className="text-sm text-muted-foreground">
                      Test results will appear here...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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

export default KnowledgeBase;
