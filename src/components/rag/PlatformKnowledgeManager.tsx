
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Database, 
  Plus, 
  Search, 
  Filter,
  Hammer,
  Zap,
  Wrench,
  Car,
  Heart,
  GraduationCap,
  Building,
  Settings,
  Trash2,
  Edit3,
  Users,
  FileText,
  BarChart3
} from 'lucide-react';

interface KnowledgeBase {
  id: string;
  name: string;
  industry: string;
  description: string;
  documentCount: number;
  lastUpdated: string;
  status: 'active' | 'inactive' | 'pending';
  icon: React.ElementType;
}

const PlatformKnowledgeManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const mockKnowledgeBases: KnowledgeBase[] = [
    {
      id: "kb-001",
      name: "Plumbing Services",
      industry: "plumbing",
      description: "Comprehensive plumbing knowledge base with procedures, codes, and troubleshooting guides",
      documentCount: 245,
      lastUpdated: "2024-01-15",
      status: "active",
      icon: Wrench
    },
    {
      id: "kb-002", 
      name: "Electrical Services",
      industry: "electrical",
      description: "Electrical installation, maintenance, and safety protocols",
      documentCount: 189,
      lastUpdated: "2024-01-12",
      status: "active",
      icon: Zap
    },
    {
      id: "kb-003",
      name: "Construction & Building",
      industry: "construction",
      description: "Building codes, construction methods, and project management guides",
      documentCount: 312,
      lastUpdated: "2024-01-10",
      status: "active",
      icon: Hammer
    },
    {
      id: "kb-004",
      name: "Automotive Services",
      industry: "automotive",
      description: "Vehicle maintenance, repair procedures, and diagnostic guides",
      documentCount: 156,
      lastUpdated: "2024-01-08",
      status: "pending",
      icon: Car
    },
    {
      id: "kb-005",
      name: "Healthcare Services",
      industry: "healthcare",
      description: "Medical procedures, patient care protocols, and compliance guidelines",
      documentCount: 423,
      lastUpdated: "2024-01-14",
      status: "active",
      icon: Heart
    }
  ];

  const industries = [
    { value: "all", label: "All Industries" },
    { value: "plumbing", label: "Plumbing" },
    { value: "electrical", label: "Electrical" },
    { value: "construction", label: "Construction" },
    { value: "automotive", label: "Automotive" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "finance", label: "Finance" }
  ];

  const filteredKnowledgeBases = mockKnowledgeBases.filter(kb => {
    const matchesSearch = kb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kb.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === "all" || kb.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'pending': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Platform Knowledge Bases</h2>
          <p className="text-muted-foreground">Manage industry-specific knowledge bases for AI agents</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Knowledge Base
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Knowledge Base</DialogTitle>
              <DialogDescription>
                Create a new industry-specific knowledge base for your platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Knowledge Base Name</label>
                <Input placeholder="e.g., HVAC Services" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Industry</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.slice(1).map((industry) => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Input placeholder="Brief description of the knowledge base" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="flex-1">Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search knowledge bases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Industries" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((industry) => (
              <SelectItem key={industry.value} value={industry.value}>
                {industry.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredKnowledgeBases.map((kb) => {
              const IconComponent = kb.icon;
              return (
                <Card key={kb.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{kb.name}</CardTitle>
                          <Badge variant={getStatusColor(kb.status)} className="text-xs">
                            {kb.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="mt-2">{kb.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Documents:</span>
                        <span className="font-medium">{kb.documentCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span className="font-medium">{kb.lastUpdated}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <FileText className="mr-1 h-3 w-3" />
                          Manage
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Users className="mr-1 h-3 w-3" />
                          Access
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base Analytics</CardTitle>
              <CardDescription>Usage statistics and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-sm text-muted-foreground">Active Knowledge Bases</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">1,325</div>
                  <div className="text-sm text-muted-foreground">Total Documents</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">12,450</div>
                  <div className="text-sm text-muted-foreground">Monthly Queries</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure global knowledge base settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Auto-sync knowledge bases</label>
                  <p className="text-sm text-muted-foreground">Automatically sync updates across all knowledge bases</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Enable cross-industry queries</label>
                  <p className="text-sm text-muted-foreground">Allow AI agents to query multiple knowledge bases</p>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlatformKnowledgeManager;
