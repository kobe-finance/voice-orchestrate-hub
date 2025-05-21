
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/ModeToggle";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 mx-auto max-w-7xl">
          <Link to="/dashboard" className="flex items-center font-semibold">
            VoiceOrchestrate™
          </Link>
          <nav className="ml-auto flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link to="/voice-agents">
              <Button variant="ghost">Voice Agents</Button>
            </Link>
            <Link to="/conversation-flow">
              <Button variant="ghost">Flow Builder</Button>
            </Link>
            <Link to="/document-management">
              <Button variant="ghost">Documents</Button>
            </Link>
            <Link to="/integration-marketplace">
              <Button variant="ghost">Integrations</Button>
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
