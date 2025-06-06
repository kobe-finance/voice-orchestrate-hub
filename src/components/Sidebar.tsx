
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from "@/components/ui/sidebar";
import { TenantSwitcher } from "@/components/tenant/TenantSwitcher";
import { 
  Mic, 
  Settings, 
  BarChart3, 
  FileText, 
  MessagesSquare,
  KeyRound,
  Database,
  Share2,
  CreditCard,
  Users,
  LayoutDashboard,
  Laptop,
  Headphones,
  Phone,
  Clock,
  UserCheck,
  Calendar,
  Building2,
  DollarSign,
  Zap,
  LucideIcon,
  Truck,
  Mail,
  Shield,
  Brain,
  Wrench
} from "lucide-react";

interface NavigationItem {
  title: string;
  path: string;
  icon: LucideIcon;
}

const navigationItems: NavigationItem[] = [
  { title: "Onboarding", path: "/onboarding", icon: Laptop },
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "Voice Agents", path: "/voice-agents", icon: Mic },
  { title: "Call Management", path: "/call-management", icon: Phone },
  { title: "Flow Builder", path: "/conversation-flow", icon: Share2 },
  { title: "Documents", path: "/document-management", icon: FileText },
  { title: "Analytics", path: "/analytics", icon: BarChart3 },
  { title: "Conversations", path: "/conversation-explorer", icon: MessagesSquare },
  { title: "Knowledge Base", path: "/knowledge-organization", icon: Database },
  { title: "Customers", path: "/customers", icon: UserCheck },
  { title: "Appointments", path: "/appointments", icon: Calendar },
  { title: "Business Hours", path: "/business-hours", icon: Clock },
  { title: "Financial & Invoicing", path: "/financial-invoicing", icon: DollarSign },
  { title: "Marketing Automation", path: "/marketing-automation", icon: Mail },
  { title: "Workflow Automation", path: "/workflow-automation", icon: Zap },
  { title: "Quality Assurance", path: "/quality-assurance", icon: Shield },
  { title: "Tools & Plugins", path: "/tools-plugins", icon: Wrench },
  { title: "API Integrations", path: "/integration-marketplace", icon: Brain },
  { title: "Users & Roles", path: "/user-management", icon: Users },
  { title: "Billing", path: "/billing-subscription", icon: CreditCard },
];

export function AppSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-2 space-y-4">
          <Link to="/dashboard" className="flex items-center gap-2 px-2">
            <div className="text-2xl font-bold">VoiceOrchestrate™</div>
          </Link>
          <TenantSwitcher />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">
          VoiceOrchestrate™ v1.0.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
