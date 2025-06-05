import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink, Download, CheckCircle, Clock } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  price: "Free" | "Paid" | "Freemium";
  status: "installed" | "available" | "coming-soon";
  featured: boolean;
  logo: string;
  tags: string[];
}

const integrations: Integration[] = [
  // LLM Providers
  {
    id: "openai",
    name: "OpenAI",
    description: "Advanced AI models including GPT-4 for natural language processing and conversation generation.",
    category: "llms",
    rating: 4.9,
    reviews: 2847,
    price: "Paid",
    status: "available",
    featured: true,
    logo: "🤖",
    tags: ["AI", "NLP", "Conversations"]
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    description: "Constitutional AI for safe, helpful, and honest conversations with advanced reasoning capabilities.",
    category: "llms",
    rating: 4.8,
    reviews: 1234,
    price: "Paid",
    status: "available",
    featured: true,
    logo: "🧠",
    tags: ["AI", "Safety", "Reasoning"]
  },
  {
    id: "google-gemini",
    name: "Google Gemini",
    description: "Google's most capable AI model with multimodal understanding and generation.",
    category: "llms",
    rating: 4.7,
    reviews: 892,
    price: "Freemium",
    status: "available",
    featured: false,
    logo: "✨",
    tags: ["AI", "Multimodal", "Google"]
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    description: "High-performance AI models optimized for reasoning and code generation tasks.",
    category: "llms",
    rating: 4.6,
    reviews: 567,
    price: "Paid",
    status: "available",
    featured: false,
    logo: "🔍",
    tags: ["AI", "Code", "Reasoning"]
  },
  {
    id: "grok",
    name: "Grok (xAI)",
    description: "Real-time AI with access to current information and witty conversational abilities.",
    category: "llms",
    rating: 4.5,
    reviews: 423,
    price: "Paid",
    status: "available",
    featured: false,
    logo: "🚀",
    tags: ["AI", "Real-time", "Current"]
  },
  {
    id: "llama",
    name: "Meta Llama",
    description: "Open-source large language models for research and commercial applications.",
    category: "llms",
    rating: 4.4,
    reviews: 789,
    price: "Free",
    status: "available",
    featured: false,
    logo: "🦙",
    tags: ["AI", "Open-source", "Meta"]
  },
  // CRM Systems
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Connect your voice agents with Salesforce CRM for seamless customer data management.",
    category: "crm",
    rating: 4.5,
    reviews: 1283,
    price: "Paid",
    status: "installed",
    featured: true,
    logo: "☁️",
    tags: ["CRM", "Sales", "Enterprise"]
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Integrate with HubSpot CRM to sync contacts, deals, and conversation logs automatically.",
    category: "crm",
    rating: 4.6,
    reviews: 892,
    price: "Freemium",
    status: "available",
    featured: true,
    logo: "🧡",
    tags: ["CRM", "Marketing", "Inbound"]
  },
  // Telephony
  {
    id: "twilio",
    name: "Twilio",
    description: "Cloud communications platform for voice, messaging, and video capabilities.",
    category: "telephony",
    rating: 4.7,
    reviews: 2134,
    price: "Paid",
    status: "available",
    featured: true,
    logo: "📞",
    tags: ["Voice", "SMS", "API"]
  },
  {
    id: "vonage",
    name: "Vonage",
    description: "Global communications APIs for voice, video, and messaging applications.",
    category: "telephony",
    rating: 4.4,
    reviews: 567,
    price: "Paid",
    status: "available",
    featured: false,
    logo: "📱",
    tags: ["Voice", "Global", "API"]
  },
  // Voice Providers
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    description: "Ultra-realistic AI voice generation with emotional nuance and multiple languages.",
    category: "voice-providers",
    rating: 4.8,
    reviews: 1456,
    price: "Freemium",
    status: "available",
    featured: true,
    logo: "🎤",
    tags: ["Voice", "AI", "TTS"]
  },
];

interface IntegrationDirectoryProps {
  searchQuery: string;
  selectedCategory: string | null;
  viewType: "grid" | "list";
}

export function IntegrationDirectory({ searchQuery, selectedCategory, viewType }: IntegrationDirectoryProps) {
  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || integration.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "installed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "coming-soon":
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "installed":
        return "Installed";
      case "coming-soon":
        return "Coming Soon";
      default:
        return "Install";
    }
  };

  if (viewType === "list") {
    return (
      <div className="space-y-4">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="text-2xl">{integration.logo}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{integration.name}</h3>
                      {integration.featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                      <Badge variant="outline">{integration.price}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{integration.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        {integration.rating} ({integration.reviews} reviews)
                      </div>
                      <div className="flex space-x-1">
                        {integration.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(integration.status)}
                  <Button
                    variant={integration.status === "installed" ? "outline" : "default"}
                    size="sm"
                    disabled={integration.status === "coming-soon"}
                  >
                    {integration.status === "installed" && <CheckCircle className="mr-2 h-4 w-4" />}
                    {getStatusText(integration.status)}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredIntegrations.map((integration) => (
        <Card key={integration.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{integration.logo}</div>
                <div>
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    {integration.featured && (
                      <Badge variant="secondary" className="text-xs">Featured</Badge>
                    )}
                    <Badge variant="outline" className="text-xs">{integration.price}</Badge>
                  </div>
                </div>
              </div>
              {getStatusIcon(integration.status)}
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              {integration.description}
            </CardDescription>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                {integration.rating} ({integration.reviews})
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {integration.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <Button 
              className="w-full" 
              variant={integration.status === "installed" ? "outline" : "default"}
              disabled={integration.status === "coming-soon"}
            >
              {integration.status === "installed" && <CheckCircle className="mr-2 h-4 w-4" />}
              {getStatusText(integration.status)}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
