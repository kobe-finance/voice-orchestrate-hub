
// Service Worker and Background Sync API type declarations
interface SyncManager {
  register(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}

interface ServiceWorkerRegistration {
  sync?: SyncManager;
}

interface WindowOrWorkerGlobalScope {
  ServiceWorkerRegistration: {
    prototype: ServiceWorkerRegistration;
  };
}

// Extend the global Window interface
declare global {
  interface Window {
    ServiceWorkerRegistration: {
      prototype: ServiceWorkerRegistration;
    };
  }
}

export {};
