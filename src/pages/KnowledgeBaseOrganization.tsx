
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  FolderTree, 
  Tag, 
  Filter,
  Save,
  CircleCheck,
  MoveVertical,
  ListTree,
  CircleDot
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryTree } from "@/components/rag/CategoryTree";
import { DocumentsGrid } from "@/components/rag/DocumentsGrid";
import { DocumentFilters } from "@/components/rag/DocumentFilters"; 
import { RelatedDocuments } from "@/components/rag/RelatedDocuments";
import { SearchInput } from "@/components/ui/search-input";
import { DocumentType, CategoryType } from "@/types/document";

const KnowledgeBaseOrganization = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentType[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [filter, setFilter] = useState({
    status: "all",
    priority: "all"
  });

  // Initial data load
  useEffect(() => {
    // Simulated data fetching
    const mockCategories: CategoryType[] = [
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
    ];

    // Mock documents
    const mockDocuments: DocumentType[] = [
      {
        id: "1",
        name: "Product Manual.pdf",
        type: "pdf",
        size: "2.4 MB",
        uploadedBy: "John Doe",
        uploadDate: "2023-06-15",
        tags: ["manual", "product"],
        status: "approved",
        category: "cat1-2", // Technical Specifications
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
        category: "cat3-1", // Troubleshooting
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
        category: "cat1-2", // Technical Specifications
        priority: "high",
        expirationDate: "2024-12-31",
        versions: [
          { id: "v1", date: "2023-07-10", notes: "Initial upload" },
        ],
        content: "Technical specifications for product XYZ...",
      },
      {
        id: "4",
        name: "Terms of Service.pdf",
        type: "pdf",
        size: "0.8 MB",
        uploadedBy: "Legal Team",
        uploadDate: "2023-04-05",
        tags: ["legal", "terms"],
        status: "approved",
        category: "cat2", // Legal Documents
        priority: "medium",
        expirationDate: "2024-04-05",
        versions: [
          { id: "v1", date: "2023-04-05", notes: "Initial upload" },
        ],
        content: "Terms of service agreement for our platform...",
      },
    ];

    setCategories(mockCategories);
    setDocuments(mockDocuments);
  }, []);

  const handleCreateCategory = (parentId: string | null) => {
    const newCategory: CategoryType = {
      id: `cat-${Date.now()}`,
      name: "New Category",
      parentId,
      priority: "medium",
      children: []
    };

    if (parentId === null) {
      // Add to root
      setCategories([...categories, newCategory]);
    } else {
      // Add as child to existing category
      const updatedCategories = categories.map(category => {
        if (category.id === parentId) {
          return {
            ...category,
            children: [...category.children, newCategory]
          };
        } else if (category.children.some(child => child.id === parentId)) {
          return {
            ...category,
            children: category.children.map(child => 
              child.id === parentId 
                ? { ...child, children: [...child.children, newCategory] }
                : child
            )
          };
        }
        return category;
      });
      setCategories(updatedCategories);
    }
    
    toast.success("Category created successfully");
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Check if category has documents
    const hasDocuments = documents.some(doc => doc.category === categoryId);
    
    if (hasDocuments) {
      toast.error("Cannot delete category with documents");
      return;
    }
    
    const updatedCategories = categories
      .filter(category => category.id !== categoryId)
      .map(category => ({
        ...category,
        children: category.children.filter(child => child.id !== categoryId)
      }));
    
    setCategories(updatedCategories);
    toast.success("Category deleted successfully");
    
    if (selectedCategory?.id === categoryId) {
      setSelectedCategory(null);
    }
  };

  const handleUpdateCategory = (categoryId: string, data: Partial<CategoryType>) => {
    const updatedCategories = categories.map(category => {
      if (category.id === categoryId) {
        return { ...category, ...data };
      } else if (category.children.some(child => child.id === categoryId)) {
        return {
          ...category,
          children: category.children.map(child => 
            child.id === categoryId 
              ? { ...child, ...data }
              : child
          )
        };
      }
      return category;
    });
    
    setCategories(updatedCategories);
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

  const handlePriorityChange = (categoryId: string, priority: string) => {
    handleUpdateCategory(categoryId, { priority: priority as "high" | "medium" | "low" });
  };

  // Filter documents based on search query, selected category, and filters
  const filteredDocuments = documents.filter(doc => {
    // Filter by search
    if (searchQuery && 
        !doc.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !doc.tags.join(" ").toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory && doc.category !== selectedCategory.id) {
      return false;
    }
    
    // Filter by status
    if (filter.status !== "all" && doc.status !== filter.status) {
      return false;
    }
    
    // Filter by priority
    if (filter.priority !== "all" && doc.priority !== filter.priority) {
      return false;
    }
    
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
              onClick={() => navigate("/document-management")}
            >
              <ArrowLeft size={16} />
              <span className="ml-2">Back to Knowledge Base</span>
            </Button>
            <h1 className="text-xl font-semibold">Knowledge Base Organization</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
            <Button size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <Tabs 
          defaultValue="categories" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="categories">
              <ListTree className="h-4 w-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="tags">
              <Tag className="h-4 w-4 mr-2" />
              Tags
            </TabsTrigger>
            <TabsTrigger value="related">
              <CircleDot className="h-4 w-4 mr-2" />
              Related Content
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Tree */}
              <div className="md:col-span-1">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Categories</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleCreateCategory(null)}
                      >
                        Add Category
                      </Button>
                    </div>
                    <CategoryTree 
                      categories={categories}
                      selectedCategory={selectedCategory}
                      onSelectCategory={setSelectedCategory}
                      onCreateCategory={handleCreateCategory}
                      onDeleteCategory={handleDeleteCategory}
                      onUpdateCategory={handleUpdateCategory}
                      onPriorityChange={handlePriorityChange}
                    />
                  </CardContent>
                </Card>
              </div>
              
              {/* Documents Grid */}
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
          
          <TabsContent value="tags" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Tag Management</h3>
                <p className="text-muted-foreground mb-4">
                  Organize your knowledge base with tags for better retrieval.
                </p>
                
                {/* Tag Management UI will be implemented here */}
                <div className="text-center py-8 text-muted-foreground">
                  <p>Tag management features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="related" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Related Content</h3>
                <p className="text-muted-foreground mb-4">
                  Manage related content links between documents in your knowledge base.
                </p>
                
                <RelatedDocuments 
                  documents={documents}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KnowledgeBaseOrganization;
