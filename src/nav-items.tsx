
import { HomeIcon, Settings, BarChart3, Users, Building2, Zap } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import IntegrationsPage from "./pages/IntegrationsPage";

export const navItems = [
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
    page: <Dashboard />,
  },
  {
    title: "Integrations", 
    to: "/integrations",
    icon: <Zap className="h-4 w-4" />,
    page: <IntegrationsPage />,
  },
];
