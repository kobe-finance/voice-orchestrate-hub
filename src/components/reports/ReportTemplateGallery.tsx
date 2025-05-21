
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportTemplate } from "@/types/report";

interface ReportTemplateGalleryProps {
  templates: ReportTemplate[];
  onSelectTemplate: (templateId: string) => void;
}

const ReportTemplateGallery: React.FC<ReportTemplateGalleryProps> = ({ 
  templates, 
  onSelectTemplate 
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Report Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="text-4xl mb-4 flex justify-center">{template.thumbnail}</div>
              <CardTitle>{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{template.description}</p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => onSelectTemplate(template.id)} 
                className="w-full"
              >
                Use Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportTemplateGallery;
