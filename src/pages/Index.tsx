import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, Zap, Shield, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { BackendConnectionTest } from "@/components/test/BackendConnectionTest";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="relative">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Transform Your Business with{" "}
              <span className="text-gradient-primary">Voice AI</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              VoiceOrchestrate™ empowers businesses to create intelligent voice agents 
              that handle customer interactions, schedule appointments, and drive growth 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary-600 text-white px-8 py-3">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg" className="px-8 py-3">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Backend Connection Test - Temporary */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Backend Integration Test</h2>
            <BackendConnectionTest />
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Powerful Features for Modern Businesses
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
                <div className="bg-primary/10 dark:bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Voice Agents</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Create intelligent voice agents that understand and respond naturally to customer inquiries.
                </p>
              </div>
              <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
                <div className="bg-accent-orange/10 dark:bg-accent-orange/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-accent-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Automation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Automate repetitive tasks and workflows to increase efficiency and reduce operational costs.
                </p>
              </div>
              <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
                <div className="bg-green-500/10 dark:bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Security</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Enterprise-grade security with encrypted data storage and secure API integrations.
                </p>
              </div>
              <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
                <div className="bg-blue-500/10 dark:bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Analytics</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Comprehensive analytics and reporting to track performance and optimize operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
