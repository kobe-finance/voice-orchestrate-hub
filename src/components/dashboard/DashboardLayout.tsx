
import React from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button-modern";
import { Bell, Search, Home, BarChart3, Settings, Users, FileText, Mic, Plus } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card-modern";
import { StandardHeader } from "@/components/common/StandardHeader";

const sidebarItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Voice Agents",
    url: "/voice-agents",
    icon: Mic,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Users",
    url: "/user-management",
    icon: Users,
  },
  {
    title: "Reports",
    url: "/report-builder",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "/billing-subscription",
    icon: Settings,
  },
];

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  console.log('DashboardLayout rendering with modern design system');

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Sidebar className="border-r border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
          <SidebarHeader className="flex items-center justify-between px-4 py-4 border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="flex items-center space-x-2">
              <div className="rounded-lg bg-gradient-to-r from-primary to-primary-600 p-2 shadow-glow">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight">VoiceOrchestrate</span>
                <span className="text-gradient-accent text-sm">™</span>
              </div>
            </div>
            <SidebarTrigger />
          </SidebarHeader>

          <SidebarContent className="px-4 py-4">
            <div className="mb-4">
              <SearchInput 
                placeholder="Search..." 
                icon={<Search className="h-4 w-4" />}
                className="w-full"
              />
            </div>

            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <a 
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <div className="mt-6">
              <Card variant="gradient" padding="sm">
                <div className="text-center">
                  <h4 className="font-semibold text-sm mb-2">Upgrade to Pro</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Get unlimited voice agents and advanced analytics
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Upgrade Now
                  </Button>
                </div>
              </Card>
            </div>
          </SidebarContent>
          
          <SidebarFooter className="p-4 border-t border-gray-200/50 dark:border-gray-800/50">
            <Button 
              variant="gradient" 
              className="w-full justify-start"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              New Voice Agent
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="flex-1">
          <StandardHeader
            leftContent={<SidebarTrigger />}
            showUserMenu={true}
          />
          <main className="flex-1">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
