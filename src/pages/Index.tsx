import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VoiceModal } from '@/components/voice/VoiceModal';
import { useAuth } from '@/hooks/useAuth';
import { UserMenu } from '@/components/auth/UserMenu';
import { 
  Mic, 
  Bot, 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  Clock, 
  Globe,
  CheckCircle,
  ArrowRight,
  Play,
  Star
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  console.log('Index component rendering');
  console.log('Index component state:', { isVoiceModalOpen });

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const features = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: "AI-Powered Voice Agents",
      description: "Create sophisticated voice agents that understand context and provide natural conversations."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Advanced Analytics",
      description: "Track performance, analyze conversations, and optimize your voice agents with detailed insights."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Multi-Tenant Support",
      description: "Manage multiple clients and teams with our robust multi-tenant architecture."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-Time Processing",
      description: "Lightning-fast voice processing with minimal latency for seamless user experiences."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Bank-level security with encryption, compliance, and data protection built-in."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Scale",
      description: "Deploy voice agents worldwide with our distributed infrastructure and CDN."
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small businesses getting started",
      features: [
        "Up to 3 voice agents",
        "1,000 minutes/month",
        "Basic analytics",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Up to 10 voice agents",
        "5,000 minutes/month",
        "Advanced analytics",
        "Priority support",
        "Custom integrations"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with custom needs",
      features: [
        "Unlimited voice agents",
        "Unlimited minutes",
        "White-label solution",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="rounded-lg bg-primary p-2">
                <Mic className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">VoiceOrchestrate™</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
                About
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Button onClick={() => navigate('/dashboard')} variant="outline">
                    Dashboard
                  </Button>
                  <UserMenu />
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button onClick={() => navigate('/auth')} variant="outline">
                    Sign In
                  </Button>
                  <Button onClick={handleGetStarted}>
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Revolutionize Your Business with AI Voice Agents
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Create intelligent, automated voice experiences that engage your customers and streamline your operations.
          </p>
          <Button size="lg" onClick={handleGetStarted}>
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="secondary" className="ml-4" onClick={() => setIsVoiceModalOpen(true)}>
            Watch Demo <Play className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {feature.icon}
                    <span>{feature.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`shadow-md hover:shadow-lg transition-shadow duration-300 ${plan.popular ? 'border-2 border-primary' : ''}`}>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul>
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-2 py-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleGetStarted}>
                    {plan.popular ? 'Get Started' : 'Choose Plan'}
                  </Button>
                </CardFooter>
                {plan.popular && (
                  <Badge className="absolute top-4 right-4" variant="secondary">
                    Popular <Star className="ml-1 h-4 w-4" />
                  </Badge>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">About VoiceOrchestrate™</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg text-muted-foreground mb-4">
                VoiceOrchestrate™ is a cutting-edge platform that enables businesses to create and deploy AI-powered voice agents. Our mission is to revolutionize customer engagement and streamline business operations through the power of voice.
              </p>
              <p className="text-lg text-muted-foreground">
                With VoiceOrchestrate™, you can build sophisticated voice agents that understand context, provide natural conversations, and integrate seamlessly with your existing systems.
              </p>
            </div>
            <div>
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To be the leading provider of AI voice solutions, empowering businesses to create exceptional voice experiences that drive growth and customer satisfaction.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} VoiceOrchestrate™. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a> | <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          </p>
        </div>
      </footer>

      <VoiceModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setIsVoiceModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
