
import { useEffect, useRef, useCallback } from 'react';

interface KeyboardNavigationOptions {
  enabled?: boolean;
  loop?: boolean;
  orientation?: 'horizontal' | 'vertical' | 'both';
  onSelect?: (element: HTMLElement) => void;
  onEscape?: () => void;
  selector?: string;
}

export const useKeyboardNavigation = ({
  enabled = true,
  loop = true,
  orientation = 'vertical',
  onSelect,
  onEscape,
  selector = '[data-keyboard-nav]'
}: KeyboardNavigationOptions = {}) => {
  const containerRef = useRef<HTMLElement>(null);
  const currentIndexRef = useRef(-1);

  const getNavigableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const elements = Array.from(
      containerRef.current.querySelectorAll(selector)
    ) as HTMLElement[];
    
    return elements.filter(el => 
      !el.hasAttribute('disabled') && 
      !el.hasAttribute('aria-disabled') &&
      el.tabIndex !== -1 &&
      !el.hidden
    );
  }, [selector]);

  const focusElement = useCallback((index: number) => {
    const elements = getNavigableElements();
    if (elements.length === 0) return;

    let targetIndex = index;
    
    if (loop) {
      if (targetIndex < 0) targetIndex = elements.length - 1;
      if (targetIndex >= elements.length) targetIndex = 0;
    } else {
      targetIndex = Math.max(0, Math.min(targetIndex, elements.length - 1));
    }

    const element = elements[targetIndex];
    if (element) {
      element.focus();
      currentIndexRef.current = targetIndex;
      
      // Add visual focus indicator
      element.setAttribute('data-keyboard-focused', 'true');
      
      // Remove focus indicator from other elements
      elements.forEach((el, i) => {
        if (i !== targetIndex) {
          el.removeAttribute('data-keyboard-focused');
        }
      });
    }
  }, [getNavigableElements, loop]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const elements = getNavigableElements();
    if (elements.length === 0) return;

    const currentElement = document.activeElement as HTMLElement;
    const currentIndex = elements.indexOf(currentElement);
    
    if (currentIndex !== -1) {
      currentIndexRef.current = currentIndex;
    }

    let handled = false;

    switch (event.key) {
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          focusElement(currentIndexRef.current + 1);
          handled = true;
        }
        break;
        
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          focusElement(currentIndexRef.current - 1);
          handled = true;
        }
        break;
        
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          focusElement(currentIndexRef.current + 1);
          handled = true;
        }
        break;
        
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          focusElement(currentIndexRef.current - 1);
          handled = true;
        }
        break;
        
      case 'Home':
        event.preventDefault();
        focusElement(0);
        handled = true;
        break;
        
      case 'End':
        event.preventDefault();
        focusElement(elements.length - 1);
        handled = true;
        break;
        
      case 'Enter':
      case ' ':
        if (currentElement && onSelect) {
          event.preventDefault();
          onSelect(currentElement);
          handled = true;
        }
        break;
        
      case 'Escape':
        if (onEscape) {
          event.preventDefault();
          onEscape();
          handled = true;
        }
        break;
    }

    return handled;
  }, [enabled, getNavigableElements, focusElement, orientation, onSelect, onEscape]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    container.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);

  const focusFirst = useCallback(() => {
    focusElement(0);
  }, [focusElement]);

  const focusLast = useCallback(() => {
    const elements = getNavigableElements();
    focusElement(elements.length - 1);
  }, [focusElement, getNavigableElements]);

  const focusNext = useCallback(() => {
    focusElement(currentIndexRef.current + 1);
  }, [focusElement]);

  const focusPrevious = useCallback(() => {
    focusElement(currentIndexRef.current - 1);
  }, [focusElement]);

  return {
    containerRef,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    currentIndex: currentIndexRef.current
  };
};

// Skip links for accessibility
export const useSkipLinks = () => {
  useEffect(() => {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    return () => {
      if (skipLink.parentNode) {
        skipLink.parentNode.removeChild(skipLink);
      }
    };
  }, []);
};

// Live announcements for screen readers
export const useLiveAnnouncements = () => {
  const announceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
    announceRef.current = announcer;

    return () => {
      if (announcer.parentNode) {
        announcer.parentNode.removeChild(announcer);
      }
    };
  }, []);

  const announce = useCallback((message: string) => {
    if (announceRef.current) {
      announceRef.current.textContent = message;
    }
  }, []);

  return { announce };
};
