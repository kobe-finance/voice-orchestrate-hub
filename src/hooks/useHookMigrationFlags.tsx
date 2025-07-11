/**
 * Hook Migration Feature Flag System
 * Allows gradual migration from old hooks to new API-based hooks
 */

import { createContext, useContext, useState, ReactNode } from 'react';

interface HookMigrationFlags {
  useNewIntegrationsAPI: boolean;
  useNewOrganizationsAPI: boolean;
  useNewAnalyticsAPI: boolean;
  useNewAgentsAPI: boolean;
  useNewAuthAPI: boolean;
}

interface HookMigrationContextType {
  flags: HookMigrationFlags;
  toggleFlag: (flag: keyof HookMigrationFlags) => void;
  enableAll: () => void;
  disableAll: () => void;
}

const HookMigrationContext = createContext<HookMigrationContextType | null>(null);

const defaultFlags: HookMigrationFlags = {
  useNewIntegrationsAPI: false,
  useNewOrganizationsAPI: false,
  useNewAnalyticsAPI: false,
  useNewAgentsAPI: false,
  useNewAuthAPI: false,
};

export const HookMigrationProvider = ({ children }: { children: ReactNode }) => {
  const [flags, setFlags] = useState<HookMigrationFlags>(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hook-migration-flags');
      if (saved) {
        try {
          return { ...defaultFlags, ...JSON.parse(saved) };
        } catch {
          // Fall back to defaults if parsing fails
        }
      }
    }
    return defaultFlags;
  });

  const toggleFlag = (flag: keyof HookMigrationFlags) => {
    setFlags(prev => {
      const newFlags = { ...prev, [flag]: !prev[flag] };
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('hook-migration-flags', JSON.stringify(newFlags));
      }
      return newFlags;
    });
  };

  const enableAll = () => {
    const allEnabled = Object.keys(defaultFlags).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as HookMigrationFlags
    );
    setFlags(allEnabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hook-migration-flags', JSON.stringify(allEnabled));
    }
  };

  const disableAll = () => {
    setFlags(defaultFlags);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hook-migration-flags', JSON.stringify(defaultFlags));
    }
  };

  return (
    <HookMigrationContext.Provider value={{ flags, toggleFlag, enableAll, disableAll }}>
      {children}
    </HookMigrationContext.Provider>
  );
};

export const useHookMigrationFlags = () => {
  const context = useContext(HookMigrationContext);
  if (!context) {
    throw new Error('useHookMigrationFlags must be used within HookMigrationProvider');
  }
  return context;
};

// Feature flag hook for integrations
export const useShouldUseNewIntegrationsAPI = () => {
  const { flags } = useHookMigrationFlags();
  return flags.useNewIntegrationsAPI;
};