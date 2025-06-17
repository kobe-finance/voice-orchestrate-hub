import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import ReportTemplateGallery from "@/components/reports/ReportTemplateGallery";
import ReportDesigner from "@/components/reports/ReportDesigner";
import ReportPreview from "@/components/reports/ReportPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button-modern";
import { Download, Mail, Save, FileText, Edit, Eye } from "lucide-react";
import { toast } from "sonner";
import { Report, ReportTemplate, Visualization } from "@/types/report";
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';

const ReportBuilder = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setActiveTab("design");
    // In a real app, we would fetch the template data from the backend
    const templateData = MOCK_TEMPLATES.find(t => t.id === templateId);
    if (templateData) {
      const newReport: Report = {
        id: crypto.randomUUID(),
        name: `Copy of ${templateData.name}`,
        description: templateData.description,
        dataSources: [],
        visualizations: templateData.previewVisualizations || [],
        schedules: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isTemplate: false,
      };
      setReport(newReport);
    }
  };

  const handleSaveReport = () => {
    // In a real app, this would save to the backend
    toast.success("Report saved successfully!");
  };

  const handleExportReport = (format: "pdf" | "excel" | "csv") => {
    // In a real app, this would trigger an export process
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };

  const handleEmailReport = () => {
    // In a real app, this would open an email configuration modal
    toast.success("Email delivery configured!");
  };

  const handleUpdateReport = (updatedReport: Report) => {
    setReport(updatedReport);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-4 md:p-6 space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Report Builder</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary-600 to-accent-orange bg-clip-text text-transparent">
          Report Builder
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Create and schedule custom reports</p>

        <div className="flex gap-2">
          {report && activeTab === "preview" && (
            <>
              <Button 
                variant="outline" 
                onClick={() => handleExportReport("pdf")}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Export PDF
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExportReport("excel")}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Export Excel
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExportReport("csv")}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Export CSV
              </Button>
              <Button 
                variant="outline" 
                onClick={handleEmailReport}
                leftIcon={<Mail className="h-4 w-4" />}
              >
                Schedule Email
              </Button>
            </>
          )}
          {report && (
            <Button variant="gradient" onClick={handleSaveReport} leftIcon={<Save className="h-4 w-4" />}>
              Save Report
            </Button>
          )}
        </div>

        <Tabs 
          defaultValue="templates" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger 
              value="design" 
              disabled={!selectedTemplate}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Design
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              disabled={!report?.visualizations?.length}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="templates" className="mt-0">
            <ReportTemplateGallery 
              onSelectTemplate={handleTemplateSelect}
              templates={MOCK_TEMPLATES}
            />
          </TabsContent>
          <TabsContent value="design" className="mt-0">
            {report && (
              <ReportDesigner 
                report={report} 
                onUpdateReport={handleUpdateReport}
                onPreview={() => setActiveTab("preview")}
              />
            )}
          </TabsContent>
          <TabsContent value="preview" className="mt-0">
            {report && <ReportPreview report={report} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Mock data for templates
const MOCK_TEMPLATES: ReportTemplate[] = [
  {
    id: "call-performance",
    name: "Call Performance Report",
    description: "Analyze call center performance metrics over time",
    thumbnail: "📊",
    previewVisualizations: [
      {
        id: "vis-1",
        type: "line",
        title: "Call Volume Over Time",
        dataSource: "call_metrics",
        config: {
          x: "date",
          y: "callCount",
          groupBy: "agent"
        }
      },
      {
        id: "vis-2",
        type: "bar",
        title: "Average Call Duration by Agent",
        dataSource: "call_metrics",
        config: {
          x: "agent",
          y: "avgDuration"
        }
      }
    ]
  },
  {
    id: "customer-satisfaction",
    name: "Customer Satisfaction Report",
    description: "Track customer satisfaction scores and feedback",
    thumbnail: "😊",
    previewVisualizations: [
      {
        id: "vis-3",
        type: "pie",
        title: "Satisfaction Distribution",
        dataSource: "satisfaction_survey",
        config: {
          value: "count",
          category: "rating"
        }
      }
    ]
  },
  {
    id: "agent-performance",
    name: "Agent Performance Report",
    description: "Monitor agent performance and customer feedback",
    thumbnail: "👩‍💼",
    previewVisualizations: []
  },
  {
    id: "call-outcomes",
    name: "Call Outcomes Analysis",
    description: "Analyze call results and conversion rates",
    thumbnail: "🎯",
    previewVisualizations: []
  },
  {
    id: "intent-analysis",
    name: "Customer Intent Analysis",
    description: "Track top intents and conversation flows",
    thumbnail: "🧠",
    previewVisualizations: []
  },
  {
    id: "blank",
    name: "Blank Report",
    description: "Start from scratch with a blank report",
    thumbnail: "➕",
    previewVisualizations: []
  }
];

export default ReportBuilder;
