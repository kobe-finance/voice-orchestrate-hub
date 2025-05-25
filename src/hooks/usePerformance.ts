
import { useEffect, useRef } from 'react';
import { usePerformanceMonitor } from '@/utils/performanceMonitoring';

export const usePerformance = (componentName: string) => {
  const { markStart, markEnd } = usePerformanceMonitor();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    // Mark component mount start
    markStart(`${componentName}-mount`);
    startTimeRef.current = performance.now();

    return () => {
      // Mark component unmount
      if (startTimeRef.current) {
        const mountDuration = performance.now() - startTimeRef.current;
        console.log(`${componentName} total render time: ${mountDuration.toFixed(2)}ms`);
      }
      markEnd(`${componentName}-mount`);
    };
  }, [componentName, markStart, markEnd]);

  const measureRender = (operationName: string) => {
    return {
      start: () => markStart(`${componentName}-${operationName}`),
      end: () => markEnd(`${componentName}-${operationName}`),
    };
  };

  return { measureRender };
};
