
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
import { 
  Home, 
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
  LucideIcon
} from "lucide-react";

interface NavigationItem {
  title: string;
  path: string;
  icon: LucideIcon;
}

const navigationItems: NavigationItem[] = [
  { title: "Home", path: "/", icon: Home },
  { title: "Onboarding", path: "/onboarding", icon: Laptop },
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "Voice Agents", path: "/voice-agents", icon: Mic },
  { title: "Flow Builder", path: "/conversation-flow", icon: Share2 },
  { title: "Documents", path: "/document-management", icon: FileText },
  { title: "Analytics", path: "/analytics", icon: BarChart3 },
  { title: "Conversations", path: "/conversation-explorer", icon: MessagesSquare },
  { title: "Knowledge Base", path: "/knowledge-organization", icon: Database },
  { title: "API Keys", path: "/api-keys", icon: KeyRound },
  { title: "Voice Providers", path: "/voice-providers", icon: Settings },
  { title: "Voice Selection", path: "/voice-selection", icon: Headphones },
  { title: "Users & Roles", path: "/user-management", icon: Users },
  { title: "Billing", path: "/billing-subscription", icon: CreditCard },
];

export function AppSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-2">
          <Link to="/" className="flex items-center gap-2 px-2">
            <div className="text-2xl font-bold">VoiceOrchestrate™</div>
          </Link>
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
