/**
 * Performance Monitoring Hook
 * Real-time performance tracking and optimization suggestions
 */

import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  memoryUsage: number;
  bundleSize: number;
  apiResponseTime: number;
  componentRenderCount: number;
}

interface PerformanceThresholds {
  loadTime: number; // ms
  memoryUsage: number; // MB
  bundleSize: number; // KB
  apiResponseTime: number; // ms
}

export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    memoryUsage: 0,
    bundleSize: 0,
    apiResponseTime: 0,
    componentRenderCount: 0
  });

  const [thresholds] = useState<PerformanceThresholds>({
    loadTime: 2000, // 2 seconds
    memoryUsage: 100, // 100 MB
    bundleSize: 1000, // 1 MB
    apiResponseTime: 200 // 200ms
  });

  const measurePageLoad = useCallback(() => {
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navigationEntries.length > 0) {
      const entry = navigationEntries[0];
      const loadTime = entry.loadEventEnd - entry.fetchStart;
      
      setMetrics(prev => ({
        ...prev,
        loadTime
      }));
    }
  }, []);

  const measureMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      const memoryUsage = memoryInfo.usedJSHeapSize / (1024 * 1024); // Convert to MB
      
      setMetrics(prev => ({
        ...prev,
        memoryUsage
      }));
    }
  }, []);

  const measureAPIResponseTime = useCallback(() => {
    // Track API response times through performance observer
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const apiCalls = entries.filter(entry => 
        entry.name.includes('/api/') || 
        entry.name.includes('supabase.co')
      );
      
      if (apiCalls.length > 0) {
        const avgResponseTime = apiCalls.reduce((sum, entry) => sum + entry.duration, 0) / apiCalls.length;
        
        setMetrics(prev => ({
          ...prev,
          apiResponseTime: avgResponseTime
        }));
      }
    });

    observer.observe({ entryTypes: ['resource'] });
    
    return () => observer.disconnect();
  }, []);

  const trackComponentRenders = useCallback(() => {
    // Simple render counter
    setMetrics(prev => ({
      ...prev,
      componentRenderCount: prev.componentRenderCount + 1
    }));
  }, []);

  const getBundleSize = useCallback(async () => {
    try {
      // Estimate bundle size from loaded resources
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsResources = resources.filter(resource => 
        resource.name.endsWith('.js') || resource.name.endsWith('.jsx')
      );
      
      const totalSize = jsResources.reduce((sum, resource) => {
        return sum + (resource.transferSize || 0);
      }, 0);
      
      setMetrics(prev => ({
        ...prev,
        bundleSize: totalSize / 1024 // Convert to KB
      }));
    } catch (error) {
      console.warn('Could not measure bundle size:', error);
    }
  }, []);

  const getPerformanceScore = useCallback(() => {
    const scores = {
      loadTime: metrics.loadTime <= thresholds.loadTime ? 100 : Math.max(0, 100 - ((metrics.loadTime - thresholds.loadTime) / thresholds.loadTime) * 100),
      memoryUsage: metrics.memoryUsage <= thresholds.memoryUsage ? 100 : Math.max(0, 100 - ((metrics.memoryUsage - thresholds.memoryUsage) / thresholds.memoryUsage) * 100),
      bundleSize: metrics.bundleSize <= thresholds.bundleSize ? 100 : Math.max(0, 100 - ((metrics.bundleSize - thresholds.bundleSize) / thresholds.bundleSize) * 100),
      apiResponseTime: metrics.apiResponseTime <= thresholds.apiResponseTime ? 100 : Math.max(0, 100 - ((metrics.apiResponseTime - thresholds.apiResponseTime) / thresholds.apiResponseTime) * 100)
    };

    const overallScore = (scores.loadTime + scores.memoryUsage + scores.bundleSize + scores.apiResponseTime) / 4;
    
    return {
      overall: Math.round(overallScore),
      individual: scores
    };
  }, [metrics, thresholds]);

  const getOptimizationSuggestions = useCallback(() => {
    const suggestions = [];

    if (metrics.loadTime > thresholds.loadTime) {
      suggestions.push({
        type: 'loadTime',
        message: 'Consider implementing code splitting and lazy loading to reduce initial bundle size',
        priority: 'high'
      });
    }

    if (metrics.memoryUsage > thresholds.memoryUsage) {
      suggestions.push({
        type: 'memory',
        message: 'High memory usage detected. Check for memory leaks and optimize component renders',
        priority: 'high'
      });
    }

    if (metrics.bundleSize > thresholds.bundleSize) {
      suggestions.push({
        type: 'bundleSize',
        message: 'Bundle size is large. Consider removing unused dependencies and implementing tree shaking',
        priority: 'medium'
      });
    }

    if (metrics.apiResponseTime > thresholds.apiResponseTime) {
      suggestions.push({
        type: 'api',
        message: 'API response times are slow. Consider implementing caching and optimizing backend queries',
        priority: 'medium'
      });
    }

    if (metrics.componentRenderCount > 100) {
      suggestions.push({
        type: 'renders',
        message: 'High number of component renders detected. Consider using React.memo and useMemo for optimization',
        priority: 'low'
      });
    }

    return suggestions;
  }, [metrics, thresholds]);

  useEffect(() => {
    measurePageLoad();
    measureMemoryUsage();
    getBundleSize();
    
    const cleanup = measureAPIResponseTime();
    
    // Set up periodic monitoring
    const interval = setInterval(() => {
      measureMemoryUsage();
    }, 5000);

    return () => {
      clearInterval(interval);
      if (cleanup) cleanup();
    };
  }, [measurePageLoad, measureMemoryUsage, getBundleSize, measureAPIResponseTime]);

  // Track renders in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      trackComponentRenders();
    }
  });

  return {
    metrics,
    thresholds,
    performanceScore: getPerformanceScore(),
    optimizationSuggestions: getOptimizationSuggestions(),
    trackRender: trackComponentRenders
  };
};