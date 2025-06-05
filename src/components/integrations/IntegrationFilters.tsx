
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Phone, 
  MessageSquare, 
  CreditCard, 
  Mail, 
  Calendar,
  Brain,
  Bot,
  Mic,
  Database,
  Settings
} from "lucide-react";

interface IntegrationFiltersProps {
  onCategoryChange: (category: string | null) => void;
}

const categories = [
  { id: "all", name: "All Integrations", icon: Settings, count: 45 },
  { id: "crm", name: "CRM Systems", icon: Building2, count: 8 },
  { id: "telephony", name: "Telephony & Voice", icon: Phone, count: 12 },
  { id: "llms", name: "AI & LLMs", icon: Brain, count: 15 },
  { id: "messaging", name: "Messaging", icon: MessageSquare, count: 6 },
  { id: "payments", name: "Payments", icon: CreditCard, count: 4 },
  { id: "scheduling", name: "Scheduling", icon: Calendar, count: 5 },
  { id: "marketing", name: "Marketing", icon: Mail, count: 8 },
  { id: "automation", name: "Automation", icon: Bot, count: 7 },
  { id: "voice-providers", name: "Voice Providers", icon: Mic, count: 10 },
  { id: "databases", name: "Databases", icon: Database, count: 6 }
];

export function IntegrationFilters({ onCategoryChange }: IntegrationFiltersProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>("all");

  const handleCategorySelect = (categoryId: string) => {
    const category = categoryId === "all" ? null : categoryId;
    setSelectedCategory(categoryId);
    onCategoryChange(category);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              className="w-full justify-start h-auto p-3"
              onClick={() => handleCategorySelect(category.id)}
            >
              <Icon className="mr-3 h-4 w-4" />
              <div className="flex-1 text-left">
                <div className="font-medium">{category.name}</div>
              </div>
              <Badge variant="secondary" className="ml-2">
                {category.count}
              </Badge>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
