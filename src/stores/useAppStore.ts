
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Pure UI state only
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  activeModal: string | null;
  selectedItems: string[];
  
  // UI Actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setActiveModal: (modal: string | null) => void;
  setSelectedItems: (items: string[]) => void;
  clearSelectedItems: () => void;
}

export const useAppStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial UI state
      sidebarCollapsed: false,
      theme: 'system',
      activeModal: null,
      selectedItems: [],
      
      // Pure UI actions
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setTheme: (theme) => set({ theme }),
      setActiveModal: (activeModal) => set({ activeModal }),
      setSelectedItems: (selectedItems) => set({ selectedItems }),
      clearSelectedItems: () => set({ selectedItems: [] }),
    }),
    {
      name: 'voiceorchestrate-ui-store',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);
