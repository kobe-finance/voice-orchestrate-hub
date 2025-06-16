import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TenantProvider } from "@/contexts/TenantContext"
import { WebSocketProvider } from "@/contexts/WebSocketContext"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar"
import { AuthProvider } from "@/hooks/useAuth";
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
      <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <AppSidebar />
        <main className="flex-1 min-w-0 overflow-x-hidden">
          <div className="h-full w-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

function App() {
  console.log('App: Rendering application');

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/onboarding" element={
                <AuthProvider>
                  <TenantProvider>
                    <Onboarding />
                  </TenantProvider>
                </AuthProvider>
              } />
              
              {/* Protected routes with full provider hierarchy */}
              <Route path="/dashboard" element={
                <AuthProvider>
                  <TenantProvider>
                    <WebSocketProvider>
                      <AppLayout><Dashboard /></AppLayout>
                    </WebSocketProvider>
                  </TenantProvider>
                </AuthProvider>
              } />
              
              <Route path="/voice-agents" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><VoiceAgents /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/voice-agents/edit/:id" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><EditVoiceAgent /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/create-voice-agent" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><CreateVoiceAgent /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/call-management" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><CallManagement /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/conversation-explorer" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><ConversationExplorer /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/knowledge-base" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><KnowledgeBase /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/document-management" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><KnowledgeBase /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/rag-configuration" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><KnowledgeBase /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/knowledge-organization" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><KnowledgeBase /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/analytics" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><Analytics /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/user-management" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><UserManagement /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/billing-subscription" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><BillingSubscription /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/integration-marketplace" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><IntegrationMarketplace /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/conversation-flow" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><ConversationFlowBuilder /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/business-hours" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><BusinessHours /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/financial-invoicing" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><FinancialInvoicing /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/marketing-automation" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><MarketingAutomation /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/workflow-automation" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><WorkflowAutomation /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/quality-assurance" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><QualityAssurance /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/agent-template-gallery" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><AgentTemplateGallery /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/tools-plugins" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><ToolsPlugins /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/report-builder" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><ReportBuilder /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/field-service-integration" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><FieldServiceIntegration /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/api-key-management" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><APIKeyManagement /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/voice-provider-management" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><VoiceProviderManagement /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/voice-selection" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><VoiceSelection /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/crm-integration" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><CRMIntegration /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/appointments" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><AppointmentScheduling /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
              <Route path="/customers" element={<AuthProvider><TenantProvider><WebSocketProvider><AppLayout><CustomerDatabase /></AppLayout></WebSocketProvider></TenantProvider></AuthProvider>} />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
