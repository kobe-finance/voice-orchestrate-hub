
import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  // Define feature cards with icons, descriptions, and links
  const features = [
    {
      title: "Voice Agents",
      description: "Create and manage conversational AI agents with custom voices",
      link: "/voice-agents",
      icon: "🎙️",
    },
    {
      title: "Flow Builder",
      description: "Design complex conversation flows with our visual editor",
      link: "/conversation-flow",
      icon: "🔄",
    },
    {
      title: "Custom Actions",
      description: "Build custom actions for your voice agents to perform",
      link: "/custom-actions",
      icon: "⚡",
    },
    {
      title: "Documents",
      description: "Manage your knowledge base documents and data sources",
      link: "/document-management",
      icon: "📄",
    },
    {
      title: "Analytics",
      description: "Track performance metrics and conversation insights",
      link: "/analytics",
      icon: "📊",
    },
    {
      title: "Integrations",
      description: "Connect your voice agents with third-party services",
      link: "/integration-marketplace",
      icon: "🔌",
    },
    {
      title: "API Keys",
      description: "Manage API credentials for secure access",
      link: "/api-keys",
      icon: "🔑",
    },
    {
      title: "Knowledge Base",
      description: "Organize and structure your agent's knowledge",
      link: "/knowledge-organization",
      icon: "🧠",
    },
  ];

  return (
    <Layout>
      <div className="container px-4 py-12 mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
            VoiceOrchestrate<span className="text-accent-orange">™</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-xl text-muted-foreground sm:text-2xl md:mt-5 md:max-w-3xl">
            Design, deploy, and manage intelligent voice agents for seamless customer interactions
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <Link to="/dashboard">
              <Button size="lg" className="px-8">
                Go to Dashboard
              </Button>
            </Link>
            <Link to="/onboarding">
              <Button size="lg" variant="outline" className="px-8">
                Start Onboarding
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          {features.map((feature) => (
            <Card key={feature.title} className="border border-border hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="text-3xl mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link to={feature.link} className="w-full">
                  <Button variant="secondary" className="w-full">
                    View {feature.title}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Getting Started Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold">Getting Started</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            New to VoiceOrchestrate? Follow our guided setup process to create your first voice agent in minutes.
          </p>
          <div className="mt-8">
            <Link to="/onboarding">
              <Button size="lg" className="px-8">
                Start Onboarding
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
