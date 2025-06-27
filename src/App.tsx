import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TenantProvider } from "@/contexts/TenantContext"
import { WebSocketProvider } from "@/contexts/WebSocketContext"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar"
import { StandardHeader } from "@/components/common/StandardHeader"
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
import AgentTemplateGallery from "@/pages/AgentTemplateGallery";
import ToolsPlugins from './pages/ToolsPlugins';
import RAGConfiguration from './pages/RAGConfiguration';
import KnowledgeBaseOrganization from './pages/KnowledgeBaseOrganization';
import Index from './pages/Index';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import APIKeyManagement from './pages/APIKeyManagement';
import VoiceProviderManagement from './pages/VoiceProviderManagement';
import VoiceSelection from './pages/VoiceSelection';
import AppointmentScheduling from './pages/AppointmentScheduling';
import CustomerDatabase from './pages/CustomerDatabase';
import { ErrorBoundary } from "@/components/ErrorBoundary";
import KnowledgeBase from './pages/KnowledgeBase';
import EmailConfirmation from './pages/EmailConfirmation';
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import UserDebugPage from './pages/UserDebug';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// App layout component for pages that need sidebar + header
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <AppSidebar />
        <main className="flex-1 min-w-0 overflow-x-hidden">
          <StandardHeader />
          <div className="h-full w-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

// Protected wrapper for authenticated routes
const ProtectedWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute>
    <HybridAuthProvider>
      <TenantProvider>
        <WebSocketProvider>
          {children}
        </WebSocketProvider>
      </TenantProvider>
    </HybridAuthProvider>
  </ProtectedRoute>
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
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/email-confirmation" element={<EmailConfirmation />} />
              
              {/* Debug route */}
              <Route path="/user-debug" element={
                <ProtectedWrapper>
                  <AppLayout><UserDebugPage /></AppLayout>
                </ProtectedWrapper>
              } />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedWrapper>
                  <AppLayout><Dashboard /></AppLayout>
                </ProtectedWrapper>
              } />
              
              <Route path="/voice-agents" element={
                <ProtectedWrapper><AppLayout><VoiceAgents /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/voice-agents/edit/:id" element={
                <ProtectedWrapper><AppLayout><EditVoiceAgent /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/create-voice-agent" element={
                <ProtectedWrapper><AppLayout><CreateVoiceAgent /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/call-management" element={
                <ProtectedWrapper><AppLayout><CallManagement /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/conversation-explorer" element={
                <ProtectedWrapper><AppLayout><ConversationExplorer /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/knowledge-base" element={
                <ProtectedWrapper><AppLayout><KnowledgeBase /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/document-management" element={
                <ProtectedWrapper><AppLayout><KnowledgeBase /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/rag-configuration" element={
                <ProtectedWrapper><AppLayout><KnowledgeBase /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/knowledge-organization" element={
                <ProtectedWrapper><AppLayout><KnowledgeBase /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/analytics" element={
                <ProtectedWrapper><AppLayout><Analytics /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/user-management" element={
                <ProtectedWrapper><AppLayout><UserManagement /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/billing-subscription" element={
                <ProtectedWrapper><AppLayout><BillingSubscription /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/integration-marketplace" element={
                <ProtectedWrapper><AppLayout><IntegrationMarketplace /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/conversation-flow" element={
                <ProtectedWrapper><AppLayout><ConversationFlowBuilder /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/business-hours" element={
                <ProtectedWrapper><AppLayout><BusinessHours /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/agent-template-gallery" element={
                <ProtectedWrapper><AppLayout><AgentTemplateGallery /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/tools-plugins" element={
                <ProtectedWrapper><AppLayout><ToolsPlugins /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/api-key-management" element={
                <ProtectedWrapper><AppLayout><APIKeyManagement /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/voice-provider-management" element={
                <ProtectedWrapper><AppLayout><VoiceProviderManagement /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/voice-selection" element={
                <ProtectedWrapper><AppLayout><VoiceSelection /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/appointments" element={
                <ProtectedWrapper><AppLayout><AppointmentScheduling /></AppLayout></ProtectedWrapper>
              } />
              
              <Route path="/customers" element={
                <ProtectedWrapper><AppLayout><CustomerDatabase /></AppLayout></ProtectedWrapper>
              } />
            </Routes>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
