
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure React is available globally for development
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

console.log('Main.tsx - React validation:', {
  React: !!React,
  version: React.version,
  hooks: {
    useEffect: typeof React.useEffect,
    useState: typeof React.useState,
  }
});

// Validate React before proceeding
if (!React || !React.useState) {
  console.error('CRITICAL: React is not properly loaded!');
  throw new Error('React is not properly loaded');
}

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element not found');
}

// Clear any existing content
container.innerHTML = '';

console.log('Main.tsx - Creating root and rendering App');

const root = createRoot(container);
root.render(<App />);

console.log('Main.tsx - App rendered successfully');
