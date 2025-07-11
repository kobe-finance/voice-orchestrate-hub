import React, { ReactNode } from "react";
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
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar";
import { TenantInfo } from "@/components/tenant/TenantInfo";
import { 
  Mic, 
  LucideIcon,
  ChevronRight
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface NavigationItem {
  title: string;
  path: string;
  icon: LucideIcon;
  submenu?: NavigationItem[];
}

interface NavigationLayoutProps {
  navigationItems: NavigationItem[];
  children: ReactNode;
}

export function NavigationLayout({ navigationItems, children }: NavigationLayoutProps) {
  const location = useLocation();
  
  const renderMenuItem = (item: NavigationItem) => {
    if (item.submenu && item.submenu.length > 0) {
      return (
        <Collapsible key={item.title}>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={item.title}>
                <item.icon />
                <span>{item.title}</span>
                <ChevronRight className="ml-auto h-4 w-4" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={location.pathname === item.path}>
                    <Link to={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                {item.submenu.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild isActive={location.pathname === subItem.path}>
                      <Link to={subItem.path}>
                        <subItem.icon />
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    return (
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
    );
  };
  
  return (
    <div className="flex min-h-screen">
      <Sidebar className="border-r border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
        <SidebarHeader className="border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="p-4 space-y-4">
            <Link to="/dashboard" className="flex items-center gap-3 px-2">
              <div className="rounded-lg bg-gradient-to-r from-primary to-primary-600 p-2 shadow-glow">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center">
                <span className="text-xl font-bold tracking-tight">VoiceOrchestrate</span>
                <span className="text-gradient-accent text-lg">™</span>
              </div>
            </Link>
            <TenantInfo />
          </div>
        </SidebarHeader>
        <SidebarContent className="p-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navigationItems.map(renderMenuItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="text-xs text-muted-foreground text-center">
            VoiceOrchestrate™ v1.0.0
          </div>
        </SidebarFooter>
      </Sidebar>
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}