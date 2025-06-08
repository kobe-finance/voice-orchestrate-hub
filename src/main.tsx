
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeApp } from './utils/appInitialization'

// Ensure React is available globally and properly initialized
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Clear any existing React context issues
if (typeof window !== 'undefined' && window.location.hash) {
  window.location.hash = '';
}

console.log('Main.tsx - React version:', React.version);
console.log('Main.tsx - React hooks available:', {
  useContext: typeof React.useContext,
  useState: typeof React.useState,
  useEffect: typeof React.useEffect
});

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
