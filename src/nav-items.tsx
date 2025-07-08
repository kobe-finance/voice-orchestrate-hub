
import { HomeIcon, Settings, BarChart3, Users, Building2, Zap } from "lucide-react";

export const navItems = [
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
    page: <div>Dashboard</div>,
  },
  {
    title: "Integrations", 
    to: "/integrations",
    icon: <Zap className="h-4 w-4" />,
    page: <div>Integrations</div>,
  },
];
