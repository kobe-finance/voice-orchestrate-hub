
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeApp } from './utils/appInitialization'

// Ensure React is available globally and properly initialized
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Clear any existing React context issues and cached modules
if (typeof window !== 'undefined') {
  // Clear any theme-related localStorage to prevent conflicts
  try {
    localStorage.removeItem('theme');
    localStorage.removeItem('next-themes-theme');
    localStorage.removeItem('vite:deps-cache');
  } catch (e) {
    console.log('Unable to clear storage:', e);
  }
  
  // Clear any hash fragments
  if (window.location.hash) {
    window.location.hash = '';
  }
  
  // Force a browser cache clear for the session
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('vite') || name.includes('next-themes')) {
          caches.delete(name);
        }
      });
    });
  }
}

console.log('Main.tsx - React version:', React.version);
console.log('Main.tsx - React hooks available:', {
  useContext: typeof React.useContext,
  useState: typeof React.useState,
  useEffect: typeof React.useEffect
});

console.log('Main.tsx - Initializing without any theme dependencies');
console.log('Main.tsx - Window object check:', typeof window);

// Initialize app performance monitoring and service worker
initializeApp().then(() => {
  console.log('Performance monitoring and service worker initialized');
}).catch(error => {
  console.error('App initialization error:', error);
});

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element not found');
}

// Ensure container is properly cleaned before mounting
container.innerHTML = '';

console.log('Main.tsx - About to create root and render App');

const root = createRoot(container);
root.render(<App />);

console.log('Main.tsx - App rendered successfully');
