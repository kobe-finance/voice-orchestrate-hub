
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import MFAVerification from "./pages/MFAVerification";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import VoiceAgents from "./pages/VoiceAgents";
import CreateVoiceAgent from "./pages/CreateVoiceAgent";
import EditVoiceAgent from "./pages/EditVoiceAgent";
import VoiceSelection from "./pages/VoiceSelection";
import ConversationFlowBuilder from "./pages/ConversationFlowBuilder";
import DocumentManagement from "./pages/DocumentManagement";
import KnowledgeBaseOrganization from "./pages/KnowledgeBaseOrganization";
import RAGConfiguration from "./pages/RAGConfiguration";
import IntegrationMarketplace from "./pages/IntegrationMarketplace";
import APIKeyManagement from "./pages/APIKeyManagement";
import Analytics from "./pages/Analytics";
import CustomActionBuilder from "./pages/CustomActionBuilder"; 
import ConversationExplorer from "./pages/ConversationExplorer";
import ReportBuilder from "./pages/ReportBuilder"; 
import UserManagement from "./pages/UserManagement";
import BillingSubscription from "./pages/BillingSubscription";
import VoiceProviderManagement from "./pages/VoiceProviderManagement";

import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/Sidebar";
import { SidebarInset } from "./components/ui/sidebar";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Router>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <SidebarInset>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/mfa-verification" element={<MFAVerification />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/voice-agents" element={<VoiceAgents />} />
                <Route path="/create-voice-agent" element={<CreateVoiceAgent />} />
                <Route path="/edit-voice-agent/:id" element={<EditVoiceAgent />} />
                <Route path="/voice-selection" element={<VoiceSelection />} />
                <Route path="/voice-providers" element={<VoiceProviderManagement />} />
                <Route path="/conversation-flow" element={<ConversationFlowBuilder />} />
                <Route path="/document-management" element={<DocumentManagement />} />
                <Route path="/knowledge-organization" element={<KnowledgeBaseOrganization />} />
                <Route path="/rag-configuration" element={<RAGConfiguration />} />
                <Route path="/integration-marketplace" element={<IntegrationMarketplace />} />
                <Route path="/api-keys" element={<APIKeyManagement />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/custom-actions" element={<CustomActionBuilder />} />
                <Route path="/conversation-explorer" element={<ConversationExplorer />} />
                <Route path="/report-builder" element={<ReportBuilder />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/billing-subscription" element={<BillingSubscription />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </SidebarInset>
          </div>
        </SidebarProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
