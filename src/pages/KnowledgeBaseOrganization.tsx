
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Folder, 
  FileText, 
  Tag, 
  Search, 
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  FolderOpen,
  ArrowLeft
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageLayout } from '@/components/layouts/PageLayout';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  color: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
  documentCount: number;
}

const KnowledgeBaseOrganization = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [categories] = useState<Category[]>([
    {
      id: '1',
      name: 'Product Documentation',
      description: 'User guides, manuals, and product specifications',
      documentCount: 15,
      color: 'blue'
    },
    {
      id: '2',
      name: 'Technical Support',
      description: 'Troubleshooting guides and FAQ documents',
      documentCount: 8,
      color: 'green'
    },
    {
      id: '3',
      name: 'API Documentation',
      description: 'REST API guides and integration documentation',
      documentCount: 12,
      color: 'purple'
    },
    {
      id: '4',
      name: 'Training Materials',
      description: 'Employee training and onboarding documents',
      documentCount: 6,
      color: 'orange'
    }
  ]);

  const [tags] = useState<Tag[]>([
    { id: '1', name: 'urgent', color: 'red', documentCount: 3 },
    { id: '2', name: 'customer-facing', color: 'blue', documentCount: 12 },
    { id: '3', name: 'internal', color: 'gray', documentCount: 8 },
    { id: '4', name: 'draft', color: 'yellow', documentCount: 5 },
    { id: '5', name: 'reviewed', color: 'green', documentCount: 18 },
    { id: '6', name: 'outdated', color: 'red', documentCount: 2 }
  ]);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Knowledge Base", href: "/knowledge-base" },
    { label: "Organization" }
  ];

  const actions = (
    <>
      <Button variant="outline" size="sm" onClick={() => navigate('/knowledge-base')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Knowledge Base
      </Button>
      <Button size="sm">
        <Plus className="mr-2 h-4 w-4" />
        Create Category
      </Button>
    </>
  );

  return (
    <PageLayout
      title="Knowledge Base Organization"
      description="Organize your documents with categories and tags"
      breadcrumbs={breadcrumbs}
      actions={actions}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories and tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Categories Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Folder className="h-5 w-5" />
                    Categories
                  </CardTitle>
                  <CardDescription>
                    Organize documents by topic or department
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-3 h-3 rounded-full bg-${category.color}-500`} />
                      <div className="flex-1">
                        <h4 className="font-medium">{category.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {category.documentCount} documents
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <FolderOpen className="mr-2 h-4 w-4" />
                          View Documents
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Category
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Category
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Tags
                  </CardTitle>
                  <CardDescription>
                    Label documents for easy filtering and search
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Badge variant="secondary" className={`bg-${tag.color}-100 text-${tag.color}-800`}>
                        {tag.name}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {tag.documentCount} documents
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          View Documents
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Tag
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Tag
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Summary</CardTitle>
            <CardDescription>
              Overview of your knowledge base organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {categories.length}
                </div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {tags.length}
                </div>
                <div className="text-sm text-muted-foreground">Tags</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {categories.reduce((sum, cat) => sum + cat.documentCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Documents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {Math.round(categories.reduce((sum, cat) => sum + cat.documentCount, 0) / categories.length)}
                </div>
                <div className="text-sm text-muted-foreground">Avg per Category</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default KnowledgeBaseOrganization;
