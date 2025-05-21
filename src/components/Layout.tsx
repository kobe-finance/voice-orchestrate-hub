
import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/ModeToggle";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 mx-auto max-w-7xl">
          <Link to="/dashboard" className="flex items-center font-semibold">
            VoiceOrchestrate™
          </Link>
          <nav className="ml-auto flex items-center gap-4 overflow-x-auto">
            <Link to="/dashboard">
              <Button variant={isActive("/dashboard") ? "default" : "ghost"}>Dashboard</Button>
            </Link>
            <Link to="/voice-agents">
              <Button variant={isActive("/voice-agents") ? "default" : "ghost"}>Voice Agents</Button>
            </Link>
            <Link to="/conversation-flow">
              <Button variant={isActive("/conversation-flow") ? "default" : "ghost"}>Flow Builder</Button>
            </Link>
            <Link to="/custom-actions">
              <Button variant={isActive("/custom-actions") ? "default" : "ghost"}>Custom Actions</Button>
            </Link>
            <Link to="/document-management">
              <Button variant={isActive("/document-management") ? "default" : "ghost"}>Documents</Button>
            </Link>
            <Link to="/analytics">
              <Button variant={isActive("/analytics") ? "default" : "ghost"}>Analytics</Button>
            </Link>
            <Link to="/conversation-explorer">
              <Button variant={isActive("/conversation-explorer") ? "default" : "ghost"}>Conversations</Button>
            </Link>
            <Link to="/report-builder">
              <Button variant={isActive("/report-builder") ? "default" : "ghost"}>Reports</Button>
            </Link>
            <Link to="/integration-marketplace">
              <Button variant={isActive("/integration-marketplace") ? "default" : "ghost"}>Integrations</Button>
            </Link>
            <Link to="/api-keys">
              <Button variant={isActive("/api-keys") ? "default" : "ghost"}>API Keys</Button>
            </Link>
            <Link to="/knowledge-organization">
              <Button variant={isActive("/knowledge-organization") ? "default" : "ghost"}>Knowledge Base</Button>
            </Link>
            <Link to="/user-management">
              <Button variant={isActive("/user-management") ? "default" : "ghost"}>Users & Roles</Button>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t py-6">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} VoiceOrchestrate™. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <Link to="#" className="text-sm text-muted-foreground hover:underline">
                Terms
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:underline">
                Privacy
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
