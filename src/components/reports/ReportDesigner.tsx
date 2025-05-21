
import React, { useState } from "react";
import { Report, Visualization, DataSource } from "@/types/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, BarChart, LineChart, PieChart, Table, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface ReportDesignerProps {
  report: Report;
  onUpdateReport: (report: Report) => void;
  onPreview: () => void;
}

const MOCK_DATA_SOURCES: DataSource[] = [
  { id: "call_metrics", name: "Call Metrics", type: "database" },
  { id: "agent_performance", name: "Agent Performance", type: "database" },
  { id: "satisfaction_survey", name: "Satisfaction Survey", type: "database" },
  { id: "conversation_data", name: "Conversation Data", type: "database" }
];

const ReportDesigner: React.FC<ReportDesignerProps> = ({ 
  report, 
  onUpdateReport,
  onPreview
}) => {
  const [activeTab, setActiveTab] = useState("layout");
  const [selectedVisualization, setSelectedVisualization] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateReport({
      ...report,
      name: e.target.value
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateReport({
      ...report,
      description: e.target.value
    });
  };

  const addVisualization = (type: Visualization["type"]) => {
    const newVisualization: Visualization = {
      id: `vis-${Date.now()}`,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
      dataSource: MOCK_DATA_SOURCES[0].id,
      config: {}
    };
    
    onUpdateReport({
      ...report,
      visualizations: [...report.visualizations, newVisualization]
    });
    
    setSelectedVisualization(newVisualization.id);
    toast.success(`Added new ${type} visualization`);
  };

  const updateVisualization = (id: string, updates: Partial<Visualization>) => {
    onUpdateReport({
      ...report,
      visualizations: report.visualizations.map(vis => 
        vis.id === id ? { ...vis, ...updates } : vis
      )
    });
  };

  const removeVisualization = (id: string) => {
    onUpdateReport({
      ...report,
      visualizations: report.visualizations.filter(vis => vis.id !== id)
    });
    
    if (selectedVisualization === id) {
      setSelectedVisualization(null);
    }
    
    toast.success("Visualization removed");
  };

  const renderVisualizationProperties = () => {
    if (!selectedVisualization) return null;
    
    const visualization = report.visualizations.find(
      vis => vis.id === selectedVisualization
    );
    
    if (!visualization) return null;
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            value={visualization.title}
            onChange={(e) => updateVisualization(visualization.id, { title: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Data Source</label>
          <Select 
            value={visualization.dataSource}
            onValueChange={(value) => updateVisualization(visualization.id, { dataSource: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select data source" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_DATA_SOURCES.map(source => (
                <SelectItem key={source.id} value={source.id}>{source.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* This would be expanded with more configuration options based on visualization type */}
        
        <div className="pt-4">
          <Button
            variant="destructive"
            onClick={() => removeVisualization(visualization.id)}
          >
            Remove Visualization
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Report Name</label>
            <Input 
              value={report.name} 
              onChange={handleNameChange}
              placeholder="Enter report name" 
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={report.description || ""}
            onChange={handleDescriptionChange}
            placeholder="Enter report description"
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="data">Data Sources</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>
            
            <TabsContent value="layout" className="space-y-4">
              <div className="flex items-center space-x-4 mb-4 overflow-x-auto py-2">
                <Button variant="outline" onClick={() => addVisualization("bar")}>
                  <BarChart className="mr-2 h-4 w-4" />
                  Bar Chart
                </Button>
                <Button variant="outline" onClick={() => addVisualization("line")}>
                  <LineChart className="mr-2 h-4 w-4" />
                  Line Chart
                </Button>
                <Button variant="outline" onClick={() => addVisualization("pie")}>
                  <PieChart className="mr-2 h-4 w-4" />
                  Pie Chart
                </Button>
                <Button variant="outline" onClick={() => addVisualization("table")}>
                  <Table className="mr-2 h-4 w-4" />
                  Table
                </Button>
              </div>
              
              {report.visualizations.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-xl font-medium mb-2">No visualizations yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add charts and tables to build your report
                  </p>
                  <Button onClick={() => addVisualization("bar")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Visualization
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.visualizations.map(vis => (
                    <Card 
                      key={vis.id} 
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        selectedVisualization === vis.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedVisualization(vis.id)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{vis.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-32 bg-muted/50 rounded flex items-center justify-center">
                          {vis.type === "bar" && <BarChart className="h-10 w-10 text-muted-foreground" />}
                          {vis.type === "line" && <LineChart className="h-10 w-10 text-muted-foreground" />}
                          {vis.type === "pie" && <PieChart className="h-10 w-10 text-muted-foreground" />}
                          {vis.type === "table" && <Table className="h-10 w-10 text-muted-foreground" />}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Data source: {
                            MOCK_DATA_SOURCES.find(s => s.id === vis.dataSource)?.name || vis.dataSource
                          }
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="data">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Available Data Sources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_DATA_SOURCES.map(source => (
                    <Card key={source.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{source.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Type: {source.type}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Delivery Schedule</h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Frequency</label>
                        <Select defaultValue="weekly">
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Format</label>
                        <Select defaultValue="pdf">
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Email Recipients</label>
                        <Input placeholder="Enter email addresses separated by commas" />
                      </div>
                    </div>
                    
                    <Button className="mt-4">
                      Save Schedule
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Properties</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedVisualization ? (
                renderVisualizationProperties()
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Select a visualization to edit its properties
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <Button 
          onClick={onPreview}
          disabled={report.visualizations.length === 0}
        >
          Preview Report
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReportDesigner;
