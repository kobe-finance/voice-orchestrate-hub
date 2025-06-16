
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Validate React is properly loaded
if (!React || typeof React.useState !== 'function') {
  console.error('CRITICAL: React is not properly loaded!');
  throw new Error('React is not properly loaded - hooks not available');
}

// Ensure React is available globally for development
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

console.log('Main.tsx - React validation passed:', {
  React: !!React,
  version: React.version,
  hooks: {
    useEffect: typeof React.useEffect,
    useState: typeof React.useState,
  }
});

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element not found');
}

// Clear any existing content
container.innerHTML = '';

console.log('Main.tsx - Creating root and rendering App');

try {
  const root = createRoot(container);
  root.render(<App />);
  console.log('Main.tsx - App rendered successfully');
} catch (error) {
  console.error('Failed to render App:', error);
  // Fallback error display
  container.innerHTML = `
    <div style="padding: 20px; font-family: system-ui;">
      <h1>Application Error</h1>
      <p>Failed to initialize the application. Please refresh the page.</p>
      <button onclick="window.location.reload()">Refresh</button>
    </div>
  `;
}
