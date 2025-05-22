
import React, { ReactNode } from "react";
import { ModeToggle } from "@/components/theme/ModeToggle";

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const Layout = ({ 
  children,
  showHeader = false, 
  showFooter = false 
}: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && (
        <header className="border-b">
          <div className="container flex h-16 items-center justify-end px-4 mx-auto max-w-7xl">
            <ModeToggle />
          </div>
        </header>
      )}

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {showFooter && (
        <footer className="border-t py-6">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} VoiceOrchestrate™. All rights reserved.
              </p>
              <div className="flex gap-4 mt-4 sm:mt-0">
                <a href="#" className="text-sm text-muted-foreground hover:underline">
                  Terms
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:underline">
                  Privacy
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:underline">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
