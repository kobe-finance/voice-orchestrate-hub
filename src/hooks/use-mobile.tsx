
import { useState, useEffect } from "react";

export function useIsMobile() {
  // Add safety check for React context
  const [isMobile, setIsMobile] = useState(() => {
    // Safe initial check that won't break SSR
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    function checkIfMobile() {
      setIsMobile(window.innerWidth < 768);
    }

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  return isMobile;
}
