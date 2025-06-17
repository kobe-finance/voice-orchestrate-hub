
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mic, Users, Calendar, Wrench, Zap, Heart, Bot } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentConfigForm } from "@/components/templates/AgentConfigForm";
import { toast } from "sonner";

// Template data structure
interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'persona' | 'vertical' | 'industry';
  icon: React.ComponentType<{ className?: string }>;
  persona: string;
  greeting: string;
  primaryPurpose: string;
  voiceType: string;
  tags: string[];
  features: string[];
  useCases: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
}

const personaTemplates: AgentTemplate[] = [
  {
    id: "warm-friendly",
    name: "Warm & Friendly Assistant",
    description: "Creates a welcoming atmosphere with empathetic, personal service",
    category: 'persona',
    icon: Heart,
    persona: "You are a warm, friendly, and empathetic assistant who makes every caller feel valued and heard. You speak with genuine care and always maintain a positive, helpful attitude.",
    greeting: "Hello! Thank you for calling. I'm so glad you reached out today. How may I help make your day better?",
    primaryPurpose: "customer_service",
    voiceType: "female_friendly",
    tags: ["Empathetic", "Personal", "Caring"],
    features: ["Warm tone", "Active listening", "Personal touch"],
    useCases: ["Customer support", "Reception", "Patient care"],
    complexity: "beginner"
  },
  {
    id: "professional-concise",
    name: "Professional & Efficient",
    description: "Direct communication focused on quick problem resolution",
    category: 'persona',
    icon: Users,
    persona: "You are a professional, efficient assistant who values the caller's time. You communicate clearly and directly while maintaining politeness and getting to solutions quickly.",
    greeting: "Good day, this is professional support. I'm here to help you resolve any issues quickly and efficiently. What can I assist you with?",
    primaryPurpose: "customer_service",
    voiceType: "male_professional",
    tags: ["Efficient", "Direct", "Solution-focused"],
    features: ["Quick resolution", "Clear communication", "Time-conscious"],
    useCases: ["Technical support", "Business services", "Consultations"],
    complexity: "intermediate"
  },
  {
    id: "sales-expert",
    name: "Sales Expert",
    description: "Persuasive and knowledgeable sales professional",
    category: 'persona',
    icon: Bot,
    persona: "You are an experienced sales professional who understands customer needs and can effectively communicate value propositions while building trust and rapport.",
    greeting: "Hi there! Thanks for your interest in our services. I'm here to help you find the perfect solution for your needs. What brings you to us today?",
    primaryPurpose: "sales",
    voiceType: "male_confident",
    tags: ["Persuasive", "Knowledgeable", "Results-driven"],
    features: ["Lead qualification", "Objection handling", "Closing techniques"],
    useCases: ["Sales calls", "Lead generation", "Product demos"],
    complexity: "advanced"
  }
];

const verticalTemplates: AgentTemplate[] = [
  {
    id: "healthcare-scheduler",
    name: "Healthcare Appointment Scheduler",
    description: "Specialized in medical appointment booking and patient care",
    category: 'vertical',
    icon: Heart,
    persona: "You are a caring healthcare coordinator who understands medical scheduling needs, patient privacy, and can handle sensitive health-related inquiries with empathy and professionalism.",
    greeting: "Hello, you've reached [Practice Name] scheduling. I'm here to help you with appointments and answer any questions about our services. How can I assist you today?",
    primaryPurpose: "appointment_booking",
    voiceType: "female_professional",
    tags: ["Medical knowledge", "HIPAA compliant", "Empathetic"],
    features: ["Medical terminology", "Insurance verification", "Emergency protocols"],
    useCases: ["Doctor appointments", "Medical consultations", "Patient intake"],
    complexity: "advanced"
  },
  {
    id: "real-estate-agent",
    name: "Real Estate Assistant",
    description: "Property inquiries, showings, and market information",
    category: 'vertical',
    icon: Users,
    persona: "You are a knowledgeable real estate assistant who can provide property information, schedule showings, and answer questions about the local market with expertise and enthusiasm.",
    greeting: "Hi! Thanks for calling about our properties. I'm excited to help you find your perfect home or investment. What type of property are you looking for?",
    primaryPurpose: "lead_qualification",
    voiceType: "female_enthusiastic",
    tags: ["Property knowledge", "Market savvy", "Customer-focused"],
    features: ["Property database", "Market insights", "Showing coordination"],
    useCases: ["Property inquiries", "Market research", "Buyer qualification"],
    complexity: "intermediate"
  },
  {
    id: "automotive-service",
    name: "Auto Service Coordinator",
    description: "Vehicle service scheduling and maintenance reminders",
    category: 'vertical',
    icon: Wrench,
    persona: "You are an automotive service coordinator who understands vehicle maintenance, can diagnose basic issues, and helps customers schedule appropriate service appointments.",
    greeting: "Hello! You've reached [Service Center] scheduling. Whether it's routine maintenance or something's not running right, I'm here to help get your vehicle back on the road. What's going on?",
    primaryPurpose: "appointment_booking",
    voiceType: "male_professional",
    tags: ["Automotive expertise", "Diagnostic help", "Service scheduling"],
    features: ["Vehicle diagnostics", "Service estimates", "Parts availability"],
    useCases: ["Service appointments", "Maintenance reminders", "Repair estimates"],
    complexity: "advanced"
  }
];

const industryTemplates: AgentTemplate[] = [
  {
    id: "restaurant-reservations",
    name: "Restaurant Host",
    description: "Table reservations and dining inquiries",
    category: 'industry',
    icon: Calendar,
    persona: "You are a friendly restaurant host who can handle reservations, answer menu questions, and provide information about special events and dining options.",
    greeting: "Good [time of day]! Thank you for calling [Restaurant Name]. I'd be happy to help you with reservations or answer any questions about our menu and dining experience.",
    primaryPurpose: "appointment_booking",
    voiceType: "female_friendly",
    tags: ["Hospitality", "Menu knowledge", "Event coordination"],
    features: ["Table management", "Menu expertise", "Special accommodations"],
    useCases: ["Dinner reservations", "Private events", "Menu inquiries"],
    complexity: "beginner"
  },
  {
    id: "fitness-membership",
    name: "Fitness Center Assistant",
    description: "Membership inquiries and class scheduling",
    category: 'industry',
    icon: Zap,
    persona: "You are an energetic fitness center assistant who can help with membership questions, class schedules, and provide motivation for fitness goals.",
    greeting: "Hey there! Thanks for calling [Gym Name]. I'm excited to help you on your fitness journey. Are you interested in membership, classes, or have questions about our facilities?",
    primaryPurpose: "lead_qualification",
    voiceType: "female_energetic",
    tags: ["Fitness knowledge", "Motivational", "Schedule coordination"],
    features: ["Class scheduling", "Membership options", "Fitness guidance"],
    useCases: ["Membership sales", "Class bookings", "Facility tours"],
    complexity: "intermediate"
  }
];

const AgentTemplateGallery = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleTemplateSelect = (template: AgentTemplate) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      setShowConfigForm(true);
    }
  };

  const handleSaveAgent = async (config: any) => {
    setIsCreating(true);
    try {
      // Simulate agent creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Agent "${config.name}" created successfully!`);
      navigate("/voice-agents");
    } catch (error) {
      toast.error("Failed to create agent");
    } finally {
      setIsCreating(false);
    }
  };

  const TemplateCard = ({ template }: { template: AgentTemplate }) => {
    const Icon = template.icon;
    const isSelected = selectedTemplate?.id === template.id;

    const getComplexityColor = (complexity: string) => {
      switch (complexity) {
        case 'beginner': return 'bg-green-100 text-green-800';
        case 'intermediate': return 'bg-yellow-100 text-yellow-800';
        case 'advanced': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

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
            <Badge variant="outline" className={getComplexityColor(template.complexity)}>
              {template.complexity}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Use Cases:</p>
              <ul className="text-xs text-muted-foreground">
                {template.useCases.slice(0, 2).map((useCase, index) => (
                  <li key={index}>• {useCase}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (showConfigForm && selectedTemplate) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => setShowConfigForm(false)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Configure Agent: {selectedTemplate.name}</h1>
            <p className="text-muted-foreground">Customize the template to match your needs</p>
          </div>
        </div>

        <AgentConfigForm
          initialConfig={{
            name: selectedTemplate.name,
            description: selectedTemplate.description,
            persona: selectedTemplate.persona,
            greeting: selectedTemplate.greeting,
            primaryPurpose: selectedTemplate.primaryPurpose
          }}
          onSave={handleSaveAgent}
          onCancel={() => setShowConfigForm(false)}
          isLoading={isCreating}
        />
      </div>
    );
  }

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
          <Tabs defaultValue="industry" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="industry">Industry Specific</TabsTrigger>
              <TabsTrigger value="vertical">Business Verticals</TabsTrigger>
              <TabsTrigger value="persona">Personality Types</TabsTrigger>
            </TabsList>
            
            <TabsContent value="industry" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Industry-Specific Templates</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ready-to-use agents for specific industries and business types
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {industryTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="vertical" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Business Vertical Templates</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Specialized agents with deep domain knowledge and workflows
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
                  Different communication styles and approaches for various interactions
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
                      <p className="text-sm text-muted-foreground capitalize">
                        {selectedTemplate.category} • {selectedTemplate.complexity}
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
                      <p className="text-sm font-medium mb-1">Primary Function:</p>
                      <Badge variant="outline">
                        {selectedTemplate.primaryPurpose.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Key Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedTemplate.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Best For:</p>
                      <ul className="text-xs text-muted-foreground">
                        {selectedTemplate.useCases.map((useCase, index) => (
                          <li key={index}>• {useCase}</li>
                        ))}
                      </ul>
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
