
// Performance monitoring and Core Web Vitals tracking
export interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
}

export interface PerformanceReport {
  metrics: PerformanceMetrics;
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType?: string;
}

// Core Web Vitals observer
class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.metrics.lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.fid = entry.processingStart - entry.startTime;
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Cumulative Layout Shift (CLS)
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }

    // Navigation Timing API for FCP and TTFB
    if ('performance' in window && 'getEntriesByType' in performance) {
      this.measureNavigationTiming();
    }
  }

  private measureNavigationTiming() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      // Time to First Byte
      this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
    }

    // First Contentful Paint
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      this.metrics.fcp = fcpEntry.startTime;
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  generateReport(): PerformanceReport {
    const connection = (navigator as any).connection;
    
    return {
      metrics: this.getMetrics(),
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: connection?.effectiveType || 'unknown'
    };
  }

  // Send metrics to analytics service
  async sendMetrics(endpoint?: string) {
    const report = this.generateReport();
    
    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(report),
        });
      } catch (error) {
        console.error('Failed to send performance metrics:', error);
      }
    } else {
      // Log to console for development
      console.log('Performance Report:', report);
    }
  }

  // Measure custom metrics
  markStart(name: string) {
    performance.mark(`${name}-start`);
  }

  markEnd(name: string) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measures = performance.getEntriesByName(name, 'measure');
    if (measures.length > 0) {
      const duration = measures[measures.length - 1].duration;
      console.log(`${name}: ${duration.toFixed(2)}ms`);
      return duration;
    }
    return 0;
  }

  // Memory usage monitoring
  getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  }

  dispose() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Hook for React components to use performance monitoring
export const usePerformanceMonitor = () => {
  return {
    markStart: performanceMonitor.markStart.bind(performanceMonitor),
    markEnd: performanceMonitor.markEnd.bind(performanceMonitor),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    getMemoryUsage: performanceMonitor.getMemoryUsage.bind(performanceMonitor),
  };
};

// Resource loading performance
export const trackResourceLoading = () => {
  if ('PerformanceObserver' in window) {
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.duration > 1000) { // Log slow resources (>1s)
          console.warn(`Slow resource: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
        }
      });
    });
    
    resourceObserver.observe({ entryTypes: ['resource'] });
  }
};
