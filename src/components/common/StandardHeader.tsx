
import React from 'react';
import { UserMenu } from '@/components/auth/UserMenu';
import { ModeToggle } from '@/components/theme/ModeToggle';
import { useAuth } from '@/hooks/useAuth';

interface StandardHeaderProps {
  leftContent?: React.ReactNode;
  centerContent?: React.ReactNode;
  showUserMenu?: boolean;
}

export const StandardHeader: React.FC<StandardHeaderProps> = ({
  leftContent,
  centerContent,
  showUserMenu = true
}) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md px-4 md:px-6">
      <div className="flex items-center flex-1">
        {leftContent}
      </div>
      
      <div className="flex items-center justify-center flex-1">
        {centerContent}
      </div>
      
      <div className="flex items-center space-x-4 flex-1 justify-end">
        <ModeToggle />
        {showUserMenu && user && <UserMenu />}
      </div>
    </header>
  );
};
