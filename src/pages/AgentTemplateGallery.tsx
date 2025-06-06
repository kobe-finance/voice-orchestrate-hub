
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mic, Users, Calendar, DollarSign, Wrench, Zap, Heart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Template data structure
interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'persona' | 'vertical';
  icon: React.ComponentType<{ className?: string }>;
  persona: string;
  greeting: string;
  primaryPurpose: string;
  voiceType: string;
  tags: string[];
  features: string[];
}

const personaTemplates: AgentTemplate[] = [
  {
    id: "warm-friendly",
    name: "Warm & Friendly Receptionist",
    description: "Creates a welcoming first impression with empathetic, personal service",
    category: 'persona',
    icon: Heart,
    persona: "You are a warm, friendly, and empathetic receptionist who makes every caller feel valued and heard. You speak with genuine care and always maintain a positive, helpful attitude.",
    greeting: "Hello! Thank you for calling. I'm so glad you reached out today. How may I help make your day better?",
    primaryPurpose: "customer_service",
    voiceType: "female_friendly",
    tags: ["Empathetic", "Personal", "Caring"],
    features: ["Warm tone", "Active listening", "Personal touch"]
  },
  {
    id: "professional-concise",
    name: "Concise & Professional Support",
    description: "Efficient, direct communication focused on quick problem resolution",
    category: 'persona',
    icon: Users,
    persona: "You are a professional, efficient support agent who values the caller's time. You communicate clearly and directly while maintaining politeness and getting to solutions quickly.",
    greeting: "Good day, this is professional support. I'm here to help you resolve any issues quickly and efficiently. What can I assist you with?",
    primaryPurpose: "customer_service",
    voiceType: "male_professional",
    tags: ["Efficient", "Direct", "Solution-focused"],
    features: ["Quick resolution", "Clear communication", "Time-conscious"]
  },
  {
    id: "empathetic-care",
    name: "Empathetic Customer Care",
    description: "Specializes in handling sensitive issues with understanding and patience",
    category: 'persona',
    icon: Heart,
    persona: "You are an empathetic customer care specialist who excels at handling difficult situations with patience, understanding, and emotional intelligence. You listen carefully and respond with genuine concern.",
    greeting: "Hello, I'm here to listen and help you through whatever you're experiencing today. Please take your time and tell me how I can support you.",
    primaryPurpose: "customer_service",
    voiceType: "female_professional",
    tags: ["Patient", "Understanding", "Supportive"],
    features: ["Emotional intelligence", "Conflict resolution", "Patient approach"]
  }
];

const verticalTemplates: AgentTemplate[] = [
  {
    id: "plumbing-service",
    name: "Plumbing Service Scheduler",
    description: "Specialized in plumbing emergencies, diagnostics, and service booking",
    category: 'vertical',
    icon: Wrench,
    persona: "You are a knowledgeable plumbing service coordinator who understands plumbing emergencies and can quickly assess situations, provide basic troubleshooting, and schedule appropriate service calls.",
    greeting: "Hello, you've reached the plumbing service line. Whether it's an emergency or routine maintenance, I'm here to help. What plumbing issue can I assist you with today?",
    primaryPurpose: "appointment_booking",
    voiceType: "male_professional",
    tags: ["Emergency-ready", "Technical knowledge", "Service scheduling"],
    features: ["Emergency triage", "Basic diagnostics", "Scheduling integration"]
  },
  {
    id: "electrical-support",
    name: "Electrical Service Assistant",
    description: "Handles electrical service calls, safety assessments, and technician dispatch",
    category: 'vertical',
    icon: Zap,
    persona: "You are an electrical service assistant with knowledge of electrical systems and safety protocols. You can assess electrical issues, provide safety guidance, and coordinate emergency or routine service calls.",
    greeting: "Hi, this is electrical service support. For your safety, please let me know about any electrical issues you're experiencing so I can help determine the right level of service needed.",
    primaryPurpose: "appointment_booking",
    voiceType: "female_professional",
    tags: ["Safety-focused", "Emergency protocols", "Technical assessment"],
    features: ["Safety assessment", "Emergency dispatch", "Technical guidance"]
  },
  {
    id: "hvac-scheduler",
    name: "HVAC Maintenance Scheduler",
    description: "Manages heating, cooling service calls and preventive maintenance scheduling",
    category: 'vertical',
    icon: Users,
    persona: "You are an HVAC service coordinator who understands heating and cooling systems. You can troubleshoot basic issues, schedule maintenance, and help prioritize urgent vs. routine service needs.",
    greeting: "Hello! You've reached HVAC service scheduling. Whether your system isn't working properly or you need routine maintenance, I'm here to get you comfortable again. What's going on with your heating or cooling?",
    primaryPurpose: "appointment_booking",
    voiceType: "male_friendly",
    tags: ["Seasonal expertise", "Maintenance scheduling", "Comfort-focused"],
    features: ["System diagnostics", "Seasonal planning", "Maintenance reminders"]
  },
  {
    id: "auto-service",
    name: "Auto Service Coordinator",
    description: "Handles automotive service scheduling and basic diagnostics",
    category: 'vertical',
    icon: Wrench,
    persona: "You are an automotive service coordinator who understands vehicle issues and can help diagnose problems, schedule service appointments, and provide estimates for common repairs.",
    greeting: "Hi there! You've reached auto service scheduling. Whether it's routine maintenance or something's not running right, I'm here to help get your vehicle back on the road. What's bringing you in?",
    primaryPurpose: "appointment_booking",
    voiceType: "male_professional",
    tags: ["Automotive knowledge", "Diagnostic help", "Service scheduling"],
    features: ["Vehicle diagnostics", "Service estimates", "Parts availability"]
  }
];

const AgentTemplateGallery = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);

  const handleTemplateSelect = (template: AgentTemplate) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      // Navigate to create agent with template data
      navigate("/create-voice-agent", { 
        state: { 
          template: selectedTemplate 
        }
      });
    }
  };

  const TemplateCard = ({ template }: { template: AgentTemplate }) => {
    const Icon = template.icon;
    const isSelected = selectedTemplate?.id === template.id;

    return (
      <Card 
        className={`cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'ring-2 ring-primary border-primary' : ''
        }`}
        onClick={() => handleTemplateSelect(template)}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1">
              {template.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Key Features:</p>
              <ul className="text-xs text-muted-foreground">
                {template.features.slice(0, 3).map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate("/voice-agents")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Agent Template Gallery</h1>
          <p className="text-muted-foreground">Choose a template to get started quickly</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="vertical" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="vertical">Business Verticals</TabsTrigger>
              <TabsTrigger value="persona">Personality Types</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vertical" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Industry-Specific Templates</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Pre-configured agents with industry knowledge and specialized workflows
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {verticalTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="persona" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Personality-Based Templates</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Different communication styles and approaches for various customer interactions
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personaTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Template Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Template Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTemplate ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <selectedTemplate.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{selectedTemplate.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedTemplate.category === 'vertical' ? 'Business Vertical' : 'Personality Type'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Sample Greeting:</p>
                      <p className="text-sm bg-muted p-3 rounded-md italic">
                        "{selectedTemplate.greeting}"
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Agent Persona:</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedTemplate.persona}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Voice Type:</p>
                      <Badge variant="outline">
                        {selectedTemplate.voiceType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Primary Function:</p>
                      <Badge variant="outline">
                        {selectedTemplate.primaryPurpose.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                  </div>

                  <Button 
                    onClick={handleUseTemplate}
                    className="w-full mt-4"
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Use This Template
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Mic className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Select a template to see the preview and configuration details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button 
          variant="outline" 
          onClick={() => navigate("/create-voice-agent")}
        >
          Start from Scratch Instead
        </Button>
      </div>
    </div>
  );
};

export default AgentTemplateGallery;
