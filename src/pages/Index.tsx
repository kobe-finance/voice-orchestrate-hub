import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VoiceModal } from "@/components/voice/VoiceModal";
import { ModeToggle } from "@/components/theme/ModeToggle";
import { DatabaseDebug } from "@/components/ui/database-debug";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Users, BarChart3, Zap, ArrowRight, CheckCircle } from "lucide-react";

const Index = () => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  console.log('Index component rendering');
  console.log('Index component state:', {
    isVoiceModalOpen
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold">
              VoiceOrchestrate<span className="text-accent-orange">™</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDebug(!showDebug)}
              size="sm"
            >
              {showDebug ? 'Hide' : 'Show'} Debug
            </Button>
            <Button asChild>
              <a href="/auth">Get Started</a>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>

      {showDebug && (
        <div className="container py-8">
          <DatabaseDebug />
        </div>
      )}

      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8 max-w-4xl mx-auto"
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Build Intelligent 
              <span className="text-accent-orange"> Voice Agents</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Create conversational AI that understands context, responds naturally, and delivers exceptional user experiences.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
              asChild
            >
              <a href="/auth">
                Start Building <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setIsVoiceModalOpen(true)}
              className="px-8 py-3 text-lg"
            >
              <Mic className="mr-2 h-5 w-5" />
              Try Demo
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <Card className="border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Natural Conversations</CardTitle>
              <CardDescription>
                Build voice agents that understand context and respond like humans
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Get deep insights into conversation patterns and user behavior
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Seamless Integration</CardTitle>
              <CardDescription>
                Connect with your existing tools and workflows effortlessly
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24 max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-8">Why Choose VoiceOrchestrate?</h2>
          <div className="space-y-4 text-left">
            {[
              "Deploy voice agents in minutes, not months",
              "Scale from prototype to production seamlessly",
              "Enterprise-grade security and compliance",
              "24/7 monitoring and support"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-24 text-center bg-card/30 rounded-lg p-12 border border-border/50"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Customer Experience?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of companies building the future of voice AI
          </p>
          <Button 
            size="lg" 
            className="bg-accent-orange hover:bg-accent-orange/90 text-white px-8 py-3 text-lg"
            asChild
          >
            <a href="/auth">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </motion.div>
      </main>

      <VoiceModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setIsVoiceModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
