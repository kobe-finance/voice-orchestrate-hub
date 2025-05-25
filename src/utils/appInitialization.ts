
import { registerServiceWorker, requestNotificationPermission } from './serviceWorker';
import { performanceMonitor, trackResourceLoading } from './performanceMonitoring';

export const initializeApp = async () => {
  console.log('Initializing app...');

  // Register service worker
  await registerServiceWorker();

  // Request notification permission
  await requestNotificationPermission();

  // Start performance monitoring
  trackResourceLoading();

  // Send performance metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.sendMetrics();
    }, 1000);
  });

  // Send metrics before page unload
  window.addEventListener('beforeunload', () => {
    performanceMonitor.sendMetrics();
  });

  // Monitor memory usage in development
  if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
      const memoryUsage = performanceMonitor.getMemoryUsage();
      if (memoryUsage) {
        console.log('Memory usage:', {
          used: `${(memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
          total: `${(memoryUsage.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
          limit: `${(memoryUsage.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
        });
      }
    }, 30000); // Every 30 seconds
  }

  console.log('App initialization complete');
};

// Bundle analyzer helper for development
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle analysis:', {
      scripts: document.querySelectorAll('script[src]').length,
      stylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
      images: document.querySelectorAll('img').length,
    });
  }
};
