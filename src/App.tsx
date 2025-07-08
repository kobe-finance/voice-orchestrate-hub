
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { navItems } from "./nav-items";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import IntegrationsPage from "./pages/IntegrationsPage";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  console.log("App: Rendering application");
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/integrations" element={
                <ProtectedRoute>
                  <IntegrationsPage />
                </ProtectedRoute>
              } />
              {navItems.map(({ to, page }) => (
                <Route key={to} path={to} element={
                  <ProtectedRoute>
                    {page}
                  </ProtectedRoute>
                } />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
