import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { ThemeProvider } from "@/components/theme-provider"
import { Dashboard } from './pages/Dashboard';
import { VoiceAgents } from './pages/VoiceAgents';
import { CreateVoiceAgent } from './pages/CreateVoiceAgent';
import { EditVoiceAgent } from './pages/EditVoiceAgent';
import { CallManagement } from './pages/CallManagement';
import { ConversationExplorer } from './pages/ConversationExplorer';
import { DocumentManagement } from './pages/DocumentManagement';
import { KnowledgeOrganization } from './pages/KnowledgeOrganization';
import { Analytics } from './pages/Analytics';
import { UserManagement } from './pages/UserManagement';
import { BillingSubscription } from './pages/BillingSubscription';
import { IntegrationMarketplace } from './pages/IntegrationMarketplace';
import { ConversationFlowBuilder } from './pages/ConversationFlowBuilder';
import { BusinessHours } from './pages/BusinessHours';
import { FinancialInvoicing } from './pages/FinancialInvoicing';
import { MarketingAutomation } from './pages/MarketingAutomation';
import { WorkflowAutomation } from './pages/WorkflowAutomation';
import { QualityAssurance } from './pages/QualityAssurance';
import { Customers } from './pages/Customers';
import { Appointments } from './pages/Appointments';
import { Onboarding } from './pages/Onboarding';
import AgentTemplateGallery from "@/pages/AgentTemplateGallery";

function App() {
  return (
    <QueryClient>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Onboarding />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/voice-agents" element={<VoiceAgents />} />
              <Route path="/voice-agents/edit/:id" element={<EditVoiceAgent />} />
              <Route path="/create-voice-agent" element={<CreateVoiceAgent />} />
              <Route path="/call-management" element={<CallManagement />} />
              <Route path="/conversation-explorer" element={<ConversationExplorer />} />
              <Route path="/document-management" element={<DocumentManagement />} />
              <Route path="/knowledge-organization" element={<KnowledgeOrganization />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/billing-subscription" element={<BillingSubscription />} />
              <Route path="/integration-marketplace" element={<IntegrationMarketplace />} />
              <Route path="/conversation-flow" element={<ConversationFlowBuilder />} />
              <Route path="/business-hours" element={<BusinessHours />} />
              <Route path="/financial-invoicing" element={<FinancialInvoicing />} />
              <Route path="/marketing-automation" element={<MarketingAutomation />} />
              <Route path="/workflow-automation" element={<WorkflowAutomation />} />
              <Route path="/quality-assurance" element={<QualityAssurance />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/agent-template-gallery" element={<AgentTemplateGallery />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </QueryClient>
  );
}

export default App;
