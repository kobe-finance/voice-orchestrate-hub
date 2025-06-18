
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mic, ArrowRight, CheckCircle, Sparkles, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button-modern";
import { Card } from "@/components/ui/card-modern";
import { VoiceModal } from "@/components/voice/VoiceModal";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Index = () => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const handleOpenVoiceModal = () => {
    setIsVoiceModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header Navigation */}
      <header className="w-full border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-bold text-xl tracking-tight">
              VoiceOrchestrate<span className="text-gradient-accent">™</span>
            </Link>
            
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">Features</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[500px] gap-3 p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <ListItem href="/voice-agents" title="Voice Agents" icon={<Mic className="h-4 w-4" />}>
                          Create and manage AI agents with natural voices
                        </ListItem>
                        <ListItem href="/conversation-flow" title="Flow Builder" icon={<Sparkles className="h-4 w-4" />}>
                          Design complex conversation flows visually
                        </ListItem>
                        <ListItem href="/knowledge-base" title="Knowledge Base" icon={<Shield className="h-4 w-4" />}>
                          Manage knowledge base for your AI agents
                        </ListItem>
                        <ListItem href="/analytics" title="Analytics" icon={<Zap className="h-4 w-4" />}>
                          Track and measure conversation metrics
                        </ListItem>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">Solutions</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[500px] gap-3 p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <ListItem title="Customer Support">
                          Voice AI for 24/7 customer service
                        </ListItem>
                        <ListItem title="Sales & Marketing">
                          Engage customers with intelligent conversations
                        </ListItem>
                        <ListItem title="Healthcare">
                          Patient intake and follow-up automation
                        </ListItem>
                        <ListItem title="Education">
                          Interactive learning assistants
                        </ListItem>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/pricing" className={navigationMenuTriggerStyle()}>
                    Pricing
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/onboarding">
              <Button variant="gradient" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>Now with advanced voice AI</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1] bg-gradient-to-r from-primary via-primary-600 to-accent-orange bg-clip-text text-transparent">
            Talk to Your AI Assistant{" "}
            <span className="text-gradient bg-gradient-to-r from-primary via-primary-600 to-accent-orange bg-clip-text text-transparent">
              Naturally
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience the future of voice AI with natural, fluid conversations that understand context and deliver results instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              variant="gradient"
              size="lg" 
              onClick={handleOpenVoiceModal}
              disabled={isVoiceModalOpen}
              leftIcon={<Mic className="h-5 w-5" />}
              className="min-w-[200px]"
            >
              {isVoiceModalOpen ? "Listening..." : "Try Voice AI"}
            </Button>
            
            <Link to="/onboarding">
              <Button 
                variant="outline" 
                size="lg"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="min-w-[200px]"
              >
                Create Account
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No credit card required • Start talking in seconds
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto max-w-6xl space-y-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-600 to-accent-orange bg-clip-text text-transparent">How It Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started with AI conversations in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Mic className="h-8 w-8" />,
                title: "Click & Speak",
                description: "Simply click the \"Try Voice AI\" button and start speaking naturally to our intelligent assistant."
              },
              {
                icon: <Sparkles className="h-8 w-8" />,
                title: "AI Responds",
                description: "Our advanced AI understands context and responds intelligently to your queries in real-time."
              },
              {
                icon: <CheckCircle className="h-8 w-8" />,
                title: "Get Results",
                description: "Receive instant answers, accomplish tasks, or have natural conversations without typing a word."
              }
            ].map((step, index) => (
              <Card key={index} variant="interactive" className="text-center group">
                <div className="p-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto text-primary group-hover:bg-primary/20 transition-colors">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl space-y-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-600 to-accent-orange bg-clip-text text-transparent">Why Choose VoiceOrchestrate</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Built for the future of human-AI interaction
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Natural Conversations",
                description: "Our voice AI understands context, remembers previous interactions, and responds in a human-like manner.",
                icon: <Sparkles className="h-6 w-6" />
              },
              {
                title: "No App Required",
                description: "Works directly in your browser - no downloads, installations, or account creation required to start talking.",
                icon: <Zap className="h-6 w-6" />
              },
              {
                title: "Enterprise Security",
                description: "Bank-level encryption and privacy controls ensure your conversations remain secure and confidential.",
                icon: <Shield className="h-6 w-6" />
              },
              {
                title: "Customizable",
                description: "Create custom voice agents tailored to your specific business needs and use cases.",
                icon: <CheckCircle className="h-6 w-6" />
              }
            ].map((benefit, index) => (
              <Card key={index} variant="elevated" className="group hover:border-primary/30">
                <div className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary/5 via-primary/10 to-accent-orange/5">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-600 to-accent-orange bg-clip-text text-transparent">Ready to Experience the Future?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Start talking with our AI assistant today or sign up for a full-featured account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="gradient"
              size="xl" 
              onClick={handleOpenVoiceModal}
              disabled={isVoiceModalOpen}
              leftIcon={<Mic className="h-5 w-5" />}
            >
              {isVoiceModalOpen ? "Listening..." : "Try Voice AI"}
            </Button>
            <Link to="/onboarding">
              <Button 
                variant="outline" 
                size="xl"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
        <div className="container mx-auto py-12 px-4 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                title: "Product",
                links: [
                  { name: "Features", href: "/features" },
                  { name: "Pricing", href: "/pricing" },
                  { name: "Integrations", href: "/integrations" },
                  { name: "Case Studies", href: "/customers" }
                ]
              },
              {
                title: "Resources",
                links: [
                  { name: "Documentation", href: "/docs" },
                  { name: "Guides", href: "/guides" },
                  { name: "API Reference", href: "/api" },
                  { name: "Blog", href: "/blog" }
                ]
              },
              {
                title: "Company",
                links: [
                  { name: "About Us", href: "/about" },
                  { name: "Careers", href: "/careers" },
                  { name: "Contact", href: "/contact" },
                  { name: "Partners", href: "/partners" }
                ]
              },
              {
                title: "Legal",
                links: [
                  { name: "Privacy Policy", href: "/privacy" },
                  { name: "Terms of Service", href: "/terms" },
                  { name: "Security", href: "/security" },
                  { name: "Compliance", href: "/compliance" }
                ]
              }
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4 text-foreground">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        to={link.href} 
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} VoiceOrchestrate™. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Voice Modal */}
      <VoiceModal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)} />
    </div>
  );
};

// Navigation Menu Styles
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { 
    title: string
    icon?: React.ReactNode
  }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <Link
        to={props.href || "#"}
        className={cn(
          "block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2 text-sm font-medium leading-none mb-1">
          {icon && <span className="text-primary">{icon}</span>}
          {title}
        </div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground group-hover:text-accent-foreground/80">
          {children}
        </p>
      </Link>
    </li>
  );
});
ListItem.displayName = "ListItem";

const navigationMenuTriggerStyle = () => {
  return "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50";
};

export default Index;
