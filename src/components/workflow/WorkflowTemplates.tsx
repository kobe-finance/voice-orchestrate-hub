
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const WorkflowTemplates = () => {
  const templates = [
    { name: 'Lead Nurturing', description: 'Automated lead follow-up sequence', category: 'Sales' },
    { name: 'Customer Onboarding', description: 'Welcome new customers', category: 'Support' },
    { name: 'Appointment Booking', description: 'Schedule and confirm appointments', category: 'Scheduling' },
    { name: 'Invoice Processing', description: 'Automate invoice generation', category: 'Finance' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Badge variant="secondary">{template.category}</Badge>
              <Button size="sm">Use Template</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
