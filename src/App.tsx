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
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Auth />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/mfa-verification" element={<MFAVerification />} />
                    
                    {/* Protected routes */}
                    <Route path="/" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <Index />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <Dashboard />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/onboarding" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <Onboarding />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/voice-agents" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <VoiceAgents />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/create-voice-agent" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <CreateVoiceAgent />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/edit-voice-agent/:id" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <EditVoiceAgent />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/voice-selection" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <VoiceSelection />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/voice-providers" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <VoiceProviderManagement />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/conversation-flow" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <ConversationFlowBuilder />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/document-management" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <DocumentManagement />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/knowledge-organization" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <KnowledgeBaseOrganization />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/rag-configuration" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <RAGConfiguration />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/integration-marketplace" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <IntegrationMarketplace />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/api-keys" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <APIKeyManagement />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/analytics" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <Analytics />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/custom-actions" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <CustomActionBuilder />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/conversation-explorer" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <ConversationExplorer />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/report-builder" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <ReportBuilder />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/call-management" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <CallManagement />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/business-hours" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <BusinessHours />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/customers" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <CustomerDatabase />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/appointments" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <AppointmentScheduling />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/user-management" element={
                      <ProtectedRoute requiredRole="admin">
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <UserManagement />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/billing-subscription" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <BillingSubscription />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/crm-integration" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <CRMIntegration />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/financial-invoicing" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <FinancialInvoicing />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="/workflow-automation" element={
                      <ProtectedRoute>
                        <>
                          <AppSidebar />
                          <SidebarInset>
                            <WorkflowAutomation />
                          </SidebarInset>
                        </>
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster />
                </div>
              </SidebarProvider>
            </WebSocketProvider>
          </TenantProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
