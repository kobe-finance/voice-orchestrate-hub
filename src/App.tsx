
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
import CallManagement from "./pages/CallManagement";
import BusinessHours from "./pages/BusinessHours";
import CustomerDatabase from "./pages/CustomerDatabase";
import AppointmentScheduling from "./pages/AppointmentScheduling";
import CRMIntegration from "./pages/CRMIntegration";
import FinancialInvoicing from "./pages/FinancialInvoicing";
import WorkflowAutomation from "./pages/WorkflowAutomation";
import FieldServiceIntegration from "./pages/FieldServiceIntegration";
import MarketingAutomation from "./pages/MarketingAutomation";
import QualityAssurance from "./pages/QualityAssurance";

import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/Sidebar";
import { SidebarInset } from "./components/ui/sidebar";
import { AuthProvider } from "./hooks/useAuth";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { TenantProvider } from "./contexts/TenantContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

function App() {
  return (
    <ThemeProvider 
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Router>
        <AuthProvider>
          <TenantProvider>
            <WebSocketProvider>
              <div className="min-h-screen flex w-full">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/mfa-verification" element={<MFAVerification />} />
                  
                  {/* Protected routes with sidebar */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <Dashboard />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/onboarding" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <Onboarding />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/voice-agents" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <VoiceAgents />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/create-voice-agent" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <CreateVoiceAgent />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/edit-voice-agent/:id" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <EditVoiceAgent />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/voice-selection" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <VoiceSelection />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/voice-providers" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <VoiceProviderManagement />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/conversation-flow" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <ConversationFlowBuilder />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/document-management" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <DocumentManagement />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/knowledge-organization" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <KnowledgeBaseOrganization />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/rag-configuration" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <RAGConfiguration />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/integration-marketplace" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <IntegrationMarketplace />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/api-keys" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <APIKeyManagement />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/analytics" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <Analytics />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/custom-actions" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <CustomActionBuilder />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/conversation-explorer" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <ConversationExplorer />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/report-builder" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <ReportBuilder />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/call-management" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <CallManagement />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/business-hours" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <BusinessHours />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/customers" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <CustomerDatabase />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/appointments" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <AppointmentScheduling />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/user-management" element={
                    <ProtectedRoute requiredRole="admin">
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <UserManagement />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/billing-subscription" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <BillingSubscription />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/crm-integration" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <CRMIntegration />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/financial-invoicing" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <FinancialInvoicing />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/workflow-automation" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <WorkflowAutomation />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/field-service" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <FieldServiceIntegration />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/marketing-automation" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <MarketingAutomation />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/quality-assurance" element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <QualityAssurance />
                        </SidebarInset>
                      </SidebarProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </div>
            </WebSocketProvider>
          </TenantProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
