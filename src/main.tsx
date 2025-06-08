
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
  } catch (e) {
    console.log('Unable to clear theme storage:', e);
  }
  
  if (window.location.hash) {
    window.location.hash = '';
  }
}

console.log('Main.tsx - React version:', React.version);
console.log('Main.tsx - React hooks available:', {
  useContext: typeof React.useContext,
  useState: typeof React.useState,
  useEffect: typeof React.useEffect
});

console.log('Main.tsx - Initializing without theme dependencies');

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

const root = createRoot(container);
root.render(<App />);
