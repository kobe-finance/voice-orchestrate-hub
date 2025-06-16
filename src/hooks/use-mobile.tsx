
import { useState, useEffect } from "react";

export function useIsMobile() {
  // Use a more defensive approach - check if React hooks are available
  const [isMobile, setIsMobile] = useState(() => {
    // Multiple layers of defensive checks
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        return false;
      }
      
      // Check if window properties are accessible
      if (!window.innerWidth) {
        return false;
      }
      
      return window.innerWidth < 768;
    } catch (error) {
      // Fallback for any initialization errors
      console.warn('useIsMobile: Initialization error, defaulting to false:', error);
      return false;
    }
  });

  useEffect(() => {
    // Enhanced safety checks for effect
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

      // Initial check
      checkIfMobile();

      // Add event listener
      window.addEventListener("resize", checkIfMobile);

      // Cleanup
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

// Export a safe version that can handle React not being ready
export function useSafeMobile() {
  try {
    return useIsMobile();
  } catch (error) {
    console.warn('useSafeMobile: Hook call failed, returning false:', error);
    return false;
  }
}
