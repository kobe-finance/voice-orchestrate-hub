
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TenantProvider } from "@/contexts/TenantContext"
import { WebSocketProvider } from "@/contexts/WebSocketContext"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar"
import { AuthProvider } from "@/hooks/useAuth";
import { HybridAuthProvider } from "@/contexts/HybridAuthContext";
import { Layout } from "@/components/Layout";
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
import Onboarding from './pages/Onboarding';
import AgentTemplateGallery from "@/pages/AgentTemplateGallery";
import ToolsPlugins from './pages/ToolsPlugins';
import RAGConfiguration from './pages/RAGConfiguration';
import KnowledgeBaseOrganization from './pages/KnowledgeBaseOrganization';
import Index from './pages/Index';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import APIKeyManagement from './pages/APIKeyManagement';
import VoiceProviderManagement from './pages/VoiceProviderManagement';
import VoiceSelection from './pages/VoiceSelection';
import AppointmentScheduling from './pages/AppointmentScheduling';
import CustomerDatabase from './pages/CustomerDatabase';
import { ErrorBoundary } from "@/components/ErrorBoundary";
import KnowledgeBase from './pages/KnowledgeBase';
import EmailConfirmation from './pages/EmailConfirmation';

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

// Hybrid Auth Wrapper for protected routes
const HybridAuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <HybridAuthProvider>
    <TenantProvider>
      <WebSocketProvider>
        {children}
      </WebSocketProvider>
    </TenantProvider>
  </HybridAuthProvider>
);

function App() {
  console.log('App: Rendering application');

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Auth routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/email-confirmation" element={<EmailConfirmation />} />
              
              <Route path="/onboarding" element={
                <TenantProvider>
                  <Layout showHeader={true}>
                    <Onboarding />
                  </Layout>
                </TenantProvider>
              } />
              
              {/* Protected routes with hybrid auth */}
              <Route path="/dashboard" element={
                <HybridAuthWrapper>
                  <AppLayout><Dashboard /></AppLayout>
                </HybridAuthWrapper>
              } />
              
              <Route path="/voice-agents" element={<HybridAuthWrapper><AppLayout><VoiceAgents /></AppLayout></HybridAuthWrapper>} />
              <Route path="/voice-agents/edit/:id" element={<HybridAuthWrapper><AppLayout><EditVoiceAgent /></AppLayout></HybridAuthWrapper>} />
              <Route path="/create-voice-agent" element={<HybridAuthWrapper><AppLayout><CreateVoiceAgent /></AppLayout></HybridAuthWrapper>} />
              <Route path="/call-management" element={<HybridAuthWrapper><AppLayout><CallManagement /></AppLayout></HybridAuthWrapper>} />
              <Route path="/conversation-explorer" element={<HybridAuthWrapper><AppLayout><ConversationExplorer /></AppLayout></HybridAuthWrapper>} />
              <Route path="/knowledge-base" element={<HybridAuthWrapper><AppLayout><KnowledgeBase /></AppLayout></HybridAuthWrapper>} />
              <Route path="/document-management" element={<HybridAuthWrapper><AppLayout><KnowledgeBase /></AppLayout></HybridAuthWrapper>} />
              <Route path="/rag-configuration" element={<HybridAuthWrapper><AppLayout><KnowledgeBase /></AppLayout></HybridAuthWrapper>} />
              <Route path="/knowledge-organization" element={<HybridAuthWrapper><AppLayout><KnowledgeBase /></AppLayout></HybridAuthWrapper>} />
              <Route path="/analytics" element={<HybridAuthWrapper><AppLayout><Analytics /></AppLayout></HybridAuthWrapper>} />
              <Route path="/user-management" element={<HybridAuthWrapper><AppLayout><UserManagement /></AppLayout></HybridAuthWrapper>} />
              <Route path="/billing-subscription" element={<HybridAuthWrapper><AppLayout><BillingSubscription /></AppLayout></HybridAuthWrapper>} />
              <Route path="/integration-marketplace" element={<HybridAuthWrapper><AppLayout><IntegrationMarketplace /></AppLayout></HybridAuthWrapper>} />
              <Route path="/conversation-flow" element={<HybridAuthWrapper><AppLayout><ConversationFlowBuilder /></AppLayout></HybridAuthWrapper>} />
              <Route path="/business-hours" element={<HybridAuthWrapper><AppLayout><BusinessHours /></AppLayout></HybridAuthWrapper>} />
              <Route path="/agent-template-gallery" element={<HybridAuthWrapper><AppLayout><AgentTemplateGallery /></AppLayout></HybridAuthWrapper>} />
              <Route path="/tools-plugins" element={<HybridAuthWrapper><AppLayout><ToolsPlugins /></AppLayout></HybridAuthWrapper>} />
              <Route path="/api-key-management" element={<HybridAuthWrapper><AppLayout><APIKeyManagement /></AppLayout></HybridAuthWrapper>} />
              <Route path="/voice-provider-management" element={<HybridAuthWrapper><AppLayout><VoiceProviderManagement /></AppLayout></HybridAuthWrapper>} />
              <Route path="/voice-selection" element={<HybridAuthWrapper><AppLayout><VoiceSelection /></AppLayout></HybridAuthWrapper>} />
              <Route path="/appointments" element={<HybridAuthWrapper><AppLayout><AppointmentScheduling /></AppLayout></HybridAuthWrapper>} />
              <Route path="/customers" element={<HybridAuthWrapper><AppLayout><CustomerDatabase /></AppLayout></HybridAuthWrapper>} />
            </Routes>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
