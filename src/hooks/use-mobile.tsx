
import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    try {
      if (typeof window === 'undefined') {
        return false;
      }
      
      if (!window.innerWidth) {
        return false;
      }
      
      return window.innerWidth < 768;
    } catch (error) {
      console.warn('useIsMobile: Initialization error, defaulting to false:', error);
      return false;
    }
  });

  useEffect(() => {
    try {
      if (typeof window === 'undefined' || !window.addEventListener) {
        return;
      }

      const checkIfMobile = () => {
        try {
          setIsMobile(window.innerWidth < 768);
        } catch (error) {
          console.warn('useIsMobile: Error in resize handler:', error);
        }
      };

      checkIfMobile();
      window.addEventListener("resize", checkIfMobile);

      return () => {
        try {
          window.removeEventListener("resize", checkIfMobile);
        } catch (error) {
          console.warn('useIsMobile: Error removing event listener:', error);
        }
      };
    } catch (error) {
      console.warn('useIsMobile: Effect setup error:', error);
      return undefined;
    }
  }, []);

  return isMobile;
}

// Safe version that checks React availability before calling hooks
export function useSafeMobile() {
  // Check if React and useState are available before calling any hooks
  try {
    if (typeof useState === 'undefined' || useState === null) {
      console.warn('useSafeMobile: React hooks not available, returning false');
      return false;
    }
    return useIsMobile();
  } catch (error) {
    console.warn('useSafeMobile: Hook call failed, returning false:', error);
    return false;
  }
}
