
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TenantProvider } from "@/contexts/TenantContext"
import { WebSocketProvider } from "@/contexts/WebSocketContext"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar"
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import Dashboard from './pages/Dashboard';
import VoiceAgents from './pages/VoiceAgents';
import CreateVoiceAgent from './pages/CreateVoiceAgent';
import EditVoiceAgent from './pages/EditVoiceAgent';
import CallManagement from './pages/CallManagement';
import ConversationExplorer from './pages/ConversationExplorer';
import DocumentManagement from './pages/DocumentManagement';
import Analytics from './pages/Analytics';
import UserManagement from './pages/UserManagement';
import BillingSubscription from './pages/BillingSubscription';
import IntegrationMarketplace from './pages/IntegrationMarketplace';
import ConversationFlowBuilder from './pages/ConversationFlowBuilder';
import BusinessHours from './pages/BusinessHours';
import FinancialInvoicing from './pages/FinancialInvoicing';
import MarketingAutomation from './pages/MarketingAutomation';
import WorkflowAutomation from './pages/WorkflowAutomation';
import QualityAssurance from './pages/QualityAssurance';
import Onboarding from './pages/Onboarding';
import AgentTemplateGallery from "@/pages/AgentTemplateGallery";
import ToolsPlugins from './pages/ToolsPlugins';
import RAGConfiguration from './pages/RAGConfiguration';
import KnowledgeBaseOrganization from './pages/KnowledgeBaseOrganization';
import ReportBuilder from './pages/ReportBuilder';
import Index from './pages/Index';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import FieldServiceIntegration from './pages/FieldServiceIntegration';
import APIKeyManagement from './pages/APIKeyManagement';
import VoiceProviderManagement from './pages/VoiceProviderManagement';
import VoiceSelection from './pages/VoiceSelection';
import CRMIntegration from './pages/CRMIntegration';
import AppointmentScheduling from './pages/AppointmentScheduling';
import CustomerDatabase from './pages/CustomerDatabase';
import { ErrorBoundary } from "@/components/ErrorBoundary";
import KnowledgeBase from './pages/KnowledgeBase';
import { ModernToaster } from "@/components/ui/toast-modern";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// App layout component for pages that need sidebar
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

// Conditional Toaster component that only renders when React is ready
const ConditionalToaster: React.FC = () => {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // Ensure React hooks are available before rendering the toaster
    if (React && typeof React.useState === 'function') {
      setIsReady(true);
    }
  }, []);

  if (!isReady || !React || typeof React.useState !== 'function') {
    return null;
  }

  return <ModernToaster />;
};

function App() {
  // Ensure React is properly loaded before rendering the app
  if (!React || typeof React.useState !== 'function') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p>Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <TenantProvider>
              <WebSocketProvider>
                <div className="min-h-screen bg-background">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/login" element={<Auth />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
                    <Route path="/voice-agents" element={<AppLayout><VoiceAgents /></AppLayout>} />
                    <Route path="/voice-agents/edit/:id" element={<AppLayout><EditVoiceAgent /></AppLayout>} />
                    <Route path="/create-voice-agent" element={<AppLayout><CreateVoiceAgent /></AppLayout>} />
                    <Route path="/call-management" element={<AppLayout><CallManagement /></AppLayout>} />
                    <Route path="/conversation-explorer" element={<AppLayout><ConversationExplorer /></AppLayout>} />
                    <Route path="/knowledge-base" element={<AppLayout><KnowledgeBase /></AppLayout>} />
                    {/* Redirect old routes to new unified Knowledge Base */}
                    <Route path="/document-management" element={<AppLayout><KnowledgeBase /></AppLayout>} />
                    <Route path="/rag-configuration" element={<AppLayout><KnowledgeBase /></AppLayout>} />
                    <Route path="/knowledge-organization" element={<AppLayout><KnowledgeBase /></AppLayout>} />
                    <Route path="/analytics" element={<AppLayout><Analytics /></AppLayout>} />
                    <Route path="/user-management" element={<AppLayout><UserManagement /></AppLayout>} />
                    <Route path="/billing-subscription" element={<AppLayout><BillingSubscription /></AppLayout>} />
                    <Route path="/integration-marketplace" element={<AppLayout><IntegrationMarketplace /></AppLayout>} />
                    <Route path="/conversation-flow" element={<AppLayout><ConversationFlowBuilder /></AppLayout>} />
                    <Route path="/business-hours" element={<AppLayout><BusinessHours /></AppLayout>} />
                    <Route path="/financial-invoicing" element={<AppLayout><FinancialInvoicing /></AppLayout>} />
                    <Route path="/marketing-automation" element={<AppLayout><MarketingAutomation /></AppLayout>} />
                    <Route path="/workflow-automation" element={<AppLayout><WorkflowAutomation /></AppLayout>} />
                    <Route path="/quality-assurance" element={<AppLayout><QualityAssurance /></AppLayout>} />
                    <Route path="/agent-template-gallery" element={<AppLayout><AgentTemplateGallery /></AppLayout>} />
                    <Route path="/tools-plugins" element={<AppLayout><ToolsPlugins /></AppLayout>} />
                    <Route path="/report-builder" element={<AppLayout><ReportBuilder /></AppLayout>} />
                    <Route path="/field-service-integration" element={<AppLayout><FieldServiceIntegration /></AppLayout>} />
                    <Route path="/api-key-management" element={<AppLayout><APIKeyManagement /></AppLayout>} />
                    <Route path="/voice-provider-management" element={<AppLayout><VoiceProviderManagement /></AppLayout>} />
                    <Route path="/voice-selection" element={<AppLayout><VoiceSelection /></AppLayout>} />
                    <Route path="/crm-integration" element={<AppLayout><CRMIntegration /></AppLayout>} />
                    <Route path="/appointments" element={<AppLayout><AppointmentScheduling /></AppLayout>} />
                    <Route path="/customers" element={<AppLayout><CustomerDatabase /></AppLayout>} />
                  </Routes>
                  <ConditionalToaster />
                </div>
              </WebSocketProvider>
            </TenantProvider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
