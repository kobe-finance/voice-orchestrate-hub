
import { useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

// Page imports
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import ForgotPassword from "@/pages/ForgotPassword";
import MFAVerification from "@/pages/MFAVerification";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import Onboarding from "@/pages/Onboarding";
import VoiceAgents from "@/pages/VoiceAgents";
import CreateVoiceAgent from "@/pages/CreateVoiceAgent";
import EditVoiceAgent from "@/pages/EditVoiceAgent";
import { ThemeProvider } from "@/components/theme-provider"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

const queryClient = new QueryClient()

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  window.addEventListener('online', () => {
    setIsOnline(true);
  });

  window.addEventListener('offline', () => {
    setIsOnline(false);
  });

  return (
    <BrowserRouter>
      <ThemeProvider
        defaultTheme="system"
        storageKey="vite-react-theme"
      >
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/mfa-verification" element={<MFAVerification />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/settings" element={<h1>Settings Page</h1>} />
            <Route path="/voice-agents" element={<VoiceAgents />} />
            <Route path="/voice-agents/create" element={<CreateVoiceAgent />} />
            <Route path="/voice-agents/edit/:id" element={<EditVoiceAgent />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
