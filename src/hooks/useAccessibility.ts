
import { useEffect, useCallback, useState } from 'react';
import { useLiveAnnouncements, useSkipLinks } from './useKeyboardNavigation';

interface AccessibilityOptions {
  announcePageChanges?: boolean;
  enableSkipLinks?: boolean;
  reduceMotion?: boolean;
  highContrast?: boolean;
  focusManagement?: boolean;
}

export const useAccessibility = ({
  announcePageChanges = true,
  enableSkipLinks = true,
  reduceMotion = false,
  highContrast = false,
  focusManagement = true
}: AccessibilityOptions = {}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);
  const { announce } = useLiveAnnouncements();

  // Enable skip links if requested
  if (enableSkipLinks) {
    useSkipLinks();
  }

  // Detect user preferences
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');

    setPrefersReducedMotion(motionQuery.matches);
    setPrefersHighContrast(contrastQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };

    motionQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;

    if (reduceMotion || prefersReducedMotion) {
      root.style.setProperty('--motion-duration', '0.01ms');
      root.classList.add('reduce-motion');
    } else {
      root.style.removeProperty('--motion-duration');
      root.classList.remove('reduce-motion');
    }

    if (highContrast || prefersHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [reduceMotion, prefersReducedMotion, highContrast, prefersHighContrast]);

  // Focus management
  const manageFocus = useCallback((element: HTMLElement | string) => {
    if (!focusManagement) return;

    let targetElement: HTMLElement | null = null;

    if (typeof element === 'string') {
      targetElement = document.querySelector(element);
    } else {
      targetElement = element;
    }

    if (targetElement) {
      targetElement.focus();
      targetElement.scrollIntoView({ 
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'nearest' 
      });
    }
  }, [focusManagement, prefersReducedMotion]);

  // Announce page changes
  const announcePageChange = useCallback((title: string) => {
    if (announcePageChanges) {
      setTimeout(() => {
        announce(`Navigated to ${title}`);
      }, 100);
    }
  }, [announce, announcePageChanges]);

  // ARIA helpers
  const generateId = useCallback((prefix: string = 'a11y') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const createAriaDescribedBy = useCallback((ids: string[]) => {
    return ids.filter(Boolean).join(' ') || undefined;
  }, []);

  return {
    announce,
    manageFocus,
    announcePageChange,
    generateId,
    createAriaDescribedBy,
    prefersReducedMotion: reduceMotion || prefersReducedMotion,
    prefersHighContrast: highContrast || prefersHighContrast,
  };
};

// Focus trap utility
export const useFocusTrap = (isActive: boolean) => {
  useEffect(() => {
    if (!isActive) return;

    const focusableElements = Array.from(
      document.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
      )
    ) as HTMLElement[];

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);
};
