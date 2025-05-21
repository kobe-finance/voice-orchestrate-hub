
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
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Router>
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
          <Route path="/conversation-flow" element={<ConversationFlowBuilder />} />
          <Route path="/document-management" element={<DocumentManagement />} />
          <Route path="/knowledge-organization" element={<KnowledgeBaseOrganization />} />
          <Route path="/rag-configuration" element={<RAGConfiguration />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
