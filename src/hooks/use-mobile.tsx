
import { useState, useEffect } from "react";

export function useIsMobile() {
  // Always call useState, but with more defensive initialization
  const [isMobile, setIsMobile] = useState(() => {
    // More defensive check for browser environment
    try {
      if (typeof window === 'undefined' || !window.innerWidth) return false;
      return window.innerWidth < 768;
    } catch (error) {
      console.warn('useIsMobile: Error accessing window, defaulting to false', error);
      return false;
    }
  });

  useEffect(() => {
    // Only run on client side with additional safety checks
    if (typeof window === 'undefined' || !window.addEventListener) return;

    function checkIfMobile() {
      try {
        setIsMobile(window.innerWidth < 768);
      } catch (error) {
        console.warn('useIsMobile: Error in resize handler', error);
      }
    }

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => {
      try {
        window.removeEventListener("resize", checkIfMobile);
      } catch (error) {
        console.warn('useIsMobile: Error removing event listener', error);
      }
    };
  }, []);

  return isMobile;
}
