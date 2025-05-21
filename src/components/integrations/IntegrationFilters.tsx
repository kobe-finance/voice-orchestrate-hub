
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Database, Plug, Webhook, Calendar, PhoneForwarded, FolderOpen, BarChart } from "lucide-react";

interface IntegrationFiltersProps {
  onCategoryChange: (category: string | null) => void;
}

export const IntegrationFilters: React.FC<IntegrationFiltersProps> = ({ onCategoryChange }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [popularOpen, setPopularOpen] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  const categories = [
    { id: "telephony", name: "Telephony", count: 12, icon: <PhoneForwarded className="h-4 w-4" /> },
    { id: "crm", name: "CRM Platforms", count: 8, icon: <Database className="h-4 w-4" /> },
    { id: "scheduling", name: "Scheduling", count: 6, icon: <Calendar className="h-4 w-4" /> },
    { id: "email", name: "Email Marketing", count: 9, icon: <FolderOpen className="h-4 w-4" /> },
    { id: "accounting", name: "Accounting", count: 5, icon: <BarChart className="h-4 w-4" /> },
    { id: "webhook", name: "Custom Webhooks", count: 3, icon: <Webhook className="h-4 w-4" /> },
  ];

  const popularIntegrations = [
    { id: "salesforce", name: "Salesforce", category: "crm" },
    { id: "zoom", name: "Zoom", category: "telephony" },
    { id: "slack", name: "Slack", category: "communication" },
    { id: "google_calendar", name: "Google Calendar", category: "scheduling" },
    { id: "zapier", name: "Zapier", category: "webhook" },
  ];

  const handleCategorySelect = (categoryId: string | null) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
      onCategoryChange(null);
    } else {
      setActiveCategory(categoryId);
      onCategoryChange(categoryId);
    }
  };

  return (
    <div className="bg-background border rounded-lg p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Filters</h3>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => handleCategorySelect(null)}
        >
          <Plug className="mr-2 h-4 w-4" /> All Integrations
        </Button>
      </div>
      
      <Collapsible open={popularOpen} onOpenChange={setPopularOpen}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Popular</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
              {popularOpen ? "-" : "+"}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="mt-2 space-y-1">
            {popularIntegrations.map((integration) => (
              <Button
                key={integration.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleCategorySelect(integration.category)}
              >
                {integration.name}
              </Button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={categoriesOpen} onOpenChange={setCategoriesOpen}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Categories</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
              {categoriesOpen ? "-" : "+"}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="mt-2 space-y-1">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleCategorySelect(category.id)}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
                <Badge className="ml-auto" variant="outline">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
