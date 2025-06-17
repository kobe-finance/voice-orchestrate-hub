
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {showHeader && (
        <header className="border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
          <div className="container flex h-16 items-center justify-end px-4 mx-auto max-w-7xl">
            <ModeToggle />
          </div>
        </header>
      )}

      <main className="flex-1 flex flex-col prevent-overflow">
        {children}
      </main>

      {showFooter && (
        <footer className="border-t border-gray-200/50 dark:border-gray-800/50 py-6 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
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
