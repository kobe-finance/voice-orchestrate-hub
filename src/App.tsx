
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/theme-provider"
import { TenantProvider } from "@/contexts/TenantContext"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar"
import Dashboard from './pages/Dashboard';
import VoiceAgents from './pages/VoiceAgents';
import CreateVoiceAgent from './pages/CreateVoiceAgent';
import EditVoiceAgent from './pages/EditVoiceAgent';
import CallManagement from './pages/CallManagement';
import ConversationExplorer from './pages/ConversationExplorer';
import DocumentManagement from './pages/DocumentManagement';
import Analytics from './pages/Analytics';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
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

const queryClient = new QueryClient();

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TenantProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Onboarding />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
                <Route path="/voice-agents" element={<AppLayout><VoiceAgents /></AppLayout>} />
                <Route path="/voice-agents/edit/:id" element={<AppLayout><EditVoiceAgent /></AppLayout>} />
                <Route path="/create-voice-agent" element={<AppLayout><CreateVoiceAgent /></AppLayout>} />
                <Route path="/call-management" element={<AppLayout><CallManagement /></AppLayout>} />
                <Route path="/conversation-explorer" element={<AppLayout><ConversationExplorer /></AppLayout>} />
                <Route path="/document-management" element={<AppLayout><DocumentManagement /></AppLayout>} />
                <Route path="/analytics" element={<AppLayout><Analytics /></AppLayout>} />
                <Route path="/advanced-analytics" element={<AppLayout><AdvancedAnalytics /></AppLayout>} />
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
                <Route path="/rag-configuration" element={<AppLayout><RAGConfiguration /></AppLayout>} />
                <Route path="/knowledge-organization" element={<AppLayout><KnowledgeBaseOrganization /></AppLayout>} />
              </Routes>
            </div>
          </Router>
        </TenantProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
