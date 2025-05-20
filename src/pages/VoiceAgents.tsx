import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/ui/search-input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Copy, Trash, Edit, Filter } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// Sample data - in a real app, this would come from an API
const SAMPLE_AGENTS = [
  { 
    id: "1", 
    name: "Customer Service Agent", 
    description: "Handles general customer inquiries and support requests",
    voiceType: "female_professional", 
    status: "active", 
    lastModified: "2025-05-19T15:30:00Z",
    calls: 245
  },
  { 
    id: "2", 
    name: "Appointment Scheduler", 
    description: "Specializes in booking and managing appointments",
    voiceType: "male_friendly", 
    status: "active", 
    lastModified: "2025-05-17T10:15:00Z",
    calls: 187
  },
  { 
    id: "3", 
    name: "Lead Qualification Bot", 
    description: "Qualifies leads before transferring to sales team",
    voiceType: "female_friendly", 
    status: "inactive", 
    lastModified: "2025-05-12T09:45:00Z",
    calls: 63
  },
  { 
    id: "4", 
    name: "Technical Support Specialist", 
    description: "Handles technical troubleshooting and support",
    voiceType: "neutral", 
    status: "draft", 
    lastModified: "2025-05-20T08:30:00Z",
    calls: 0
  },
];

const VoiceAgents = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState(SAMPLE_AGENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
  // Filter agents based on search query and selected filter
  const filteredAgents = agents
    .filter(agent => agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                     agent.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(agent => selectedFilter === "all" || agent.status === selectedFilter);

  const handleStatusToggle = (agentId: string) => {
    setAgents(agents.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: agent.status === "active" ? "inactive" : "active" } 
        : agent
    ));
  };
  
  const handleDuplicateAgent = (agentId: string) => {
    const agentToDuplicate = agents.find(agent => agent.id === agentId);
    if (agentToDuplicate) {
      const newAgent = {
        ...agentToDuplicate,
        id: Date.now().toString(),
        name: `${agentToDuplicate.name} (Copy)`,
        status: "draft",
        lastModified: new Date().toISOString(),
        calls: 0
      };
      setAgents([...agents, newAgent]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Voice Agent Configuration</h1>
          <p className="text-muted-foreground">Create and manage your AI voice agents</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => navigate("/voice-agents/create")}
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Agent
        </Button>
      </div>

      <Tabs defaultValue="all-agents" className="w-full">
        <TabsList>
          <TabsTrigger value="all-agents">All Agents</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="all-agents" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-96">
              <SearchInput 
                placeholder="Search agents..."
                icon={<Search className="h-4 w-4" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsFilterSheetOpen(true)}
            >
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Voice Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Calls</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No agents found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAgents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{agent.description}</TableCell>
                      <TableCell>
                        {agent.voiceType === "female_professional" && "Female Professional"}
                        {agent.voiceType === "male_professional" && "Male Professional"}
                        {agent.voiceType === "female_friendly" && "Female Friendly"}
                        {agent.voiceType === "male_friendly" && "Male Friendly"}
                        {agent.voiceType === "neutral" && "Gender Neutral"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className={`mr-2 h-2 w-2 rounded-full ${
                            agent.status === "active" ? "bg-success-green" : 
                            agent.status === "draft" ? "bg-warning-yellow" : 
                            "bg-muted-foreground"
                          }`} />
                          <span className="capitalize">{agent.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(agent.lastModified)}</TableCell>
                      <TableCell>{agent.calls}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {agent.status !== "draft" && (
                            <Switch 
                              checked={agent.status === "active"}
                              onCheckedChange={() => handleStatusToggle(agent.id)}
                            />
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => navigate(`/voice-agents/edit/${agent.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDuplicateAgent(agent.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Other tab contents would follow the same pattern */}
        <TabsContent value="active">
          {/* Similar content, filtered for active agents */}
        </TabsContent>
        <TabsContent value="drafts">
          {/* Similar content, filtered for draft agents */}
        </TabsContent>
        <TabsContent value="archived">
          {/* Similar content, filtered for archived agents */}
        </TabsContent>
      </Tabs>

      {/* Filter Sheet */}
      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Agents</SheetTitle>
            <SheetDescription>
              Apply filters to narrow down your agent list
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-6">
            {/* Filter options would go here */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Status</h3>
              <div className="space-y-1">
                {["all", "active", "inactive", "draft"].map((status) => (
                  <div key={status} className="flex items-center">
                    <input
                      type="radio"
                      id={`status-${status}`}
                      name="status"
                      checked={selectedFilter === status}
                      onChange={() => setSelectedFilter(status)}
                      className="mr-2"
                    />
                    <label htmlFor={`status-${status}`} className="text-sm capitalize">
                      {status === "all" ? "All Statuses" : status}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button 
                variant="outline"
                onClick={() => {
                  setSelectedFilter("all");
                  setIsFilterSheetOpen(false);
                }}
              >
                Reset
              </Button>
              <Button 
                onClick={() => setIsFilterSheetOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default VoiceAgents;
