
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeApp } from './utils/appInitialization'

// Ensure React is available globally
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Initialize app performance monitoring and service worker
initializeApp().then(() => {
  console.log('Performance monitoring and service worker initialized');
});

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element not found');
}

createRoot(container).render(<App />);
