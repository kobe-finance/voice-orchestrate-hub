import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mic, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoiceModal } from "@/components/voice/VoiceModal";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Index = () => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const handleOpenVoiceModal = () => {
    setIsVoiceModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Navigation */}
      <header className="w-full border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-bold text-2xl">
              VoiceOrchestrate<span className="text-accent-orange">™</span>
            </Link>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <ListItem href="/voice-agents" title="Voice Agents">
                        Create and manage AI agents with natural voices
                      </ListItem>
                      <ListItem href="/conversation-flow" title="Flow Builder">
                        Design complex conversation flows visually
                      </ListItem>
                      <ListItem href="/document-management" title="Document Management">
                        Manage knowledge base for your AI agents
                      </ListItem>
                      <ListItem href="/analytics" title="Analytics">
                        Track and measure conversation metrics
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
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
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/pricing" className={navigationMenuTriggerStyle()}>
                    Pricing
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/contact" className={navigationMenuTriggerStyle()}>
                    Contact
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/onboarding">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Talk to Your AI Assistant <span className="text-accent-orange">Now</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Experience the future of voice AI with natural, fluid conversations that understand context and deliver results.
          </p>
          <Button 
            size="lg" 
            onClick={handleOpenVoiceModal}
            className="h-16 px-8 text-lg font-medium rounded-full animate-pulse hover:animate-none transition-all hover:scale-105"
          >
            <Mic className="mr-2 h-5 w-5" /> Talk to Me
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Mic className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Click & Speak</h3>
              <p className="text-muted-foreground">
                Simply click the "Talk to Me" button and start speaking naturally to our AI assistant.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Responds</h3>
              <p className="text-muted-foreground">
                Our advanced AI understands context and responds intelligently to your queries in real-time.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Results</h3>
              <p className="text-muted-foreground">
                Receive instant answers, accomplish tasks, or have natural conversations without typing a word.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose VoiceOrchestrate</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-background rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Natural Conversations</h3>
              <p className="text-muted-foreground">
                Our voice AI understands context, remembers previous interactions, and responds in a human-like manner.
              </p>
            </div>
            <div className="bg-background rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">No App Required</h3>
              <p className="text-muted-foreground">
                Works directly in your browser - no downloads, installations, or account creation required to start talking.
              </p>
            </div>
            <div className="bg-background rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Enterprise Security</h3>
              <p className="text-muted-foreground">
                Bank-level encryption and privacy controls ensure your conversations remain secure and confidential.
              </p>
            </div>
            <div className="bg-background rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Customizable</h3>
              <p className="text-muted-foreground">
                Create custom voice agents tailored to your specific business needs and use cases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the Future?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start talking with our AI assistant today or sign up for a full-featured account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleOpenVoiceModal}
            >
              <Mic className="mr-2 h-5 w-5" /> Talk to Me
            </Button>
            <Link to="/onboarding">
              <Button 
                variant="outline" 
                size="lg"
              >
                Create Account <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link to="/integrations" className="text-muted-foreground hover:text-foreground">Integrations</Link></li>
                <li><Link to="/customers" className="text-muted-foreground hover:text-foreground">Case Studies</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/docs" className="text-muted-foreground hover:text-foreground">Documentation</Link></li>
                <li><Link to="/guides" className="text-muted-foreground hover:text-foreground">Guides</Link></li>
                <li><Link to="/api" className="text-muted-foreground hover:text-foreground">API Reference</Link></li>
                <li><Link to="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                <li><Link to="/careers" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                <li><Link to="/partners" className="text-muted-foreground hover:text-foreground">Partners</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                <li><Link to="/security" className="text-muted-foreground hover:text-foreground">Security</Link></li>
                <li><Link to="/compliance" className="text-muted-foreground hover:text-foreground">Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center">
            <p className="text-muted-foreground">
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
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <Link
        to={props.href || "#"}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </Link>
    </li>
  );
});
ListItem.displayName = "ListItem";

const navigationMenuTriggerStyle = () => {
  return "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50";
};

export default Index;
