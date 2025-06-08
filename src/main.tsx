
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeApp } from './utils/appInitialization'

// Critical: Ensure React is available globally
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Enhanced cache clearing for persistent issues
if (typeof window !== 'undefined') {
  // Clear all theme and React-related localStorage
  try {
    const keysToRemove = ['theme', 'next-themes-theme', 'vite:deps-cache'];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear all keys that might contain cached React or component data
    Object.keys(localStorage).forEach(key => {
      if (key.includes('react') || key.includes('component') || key.includes('vite')) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {
    console.log('Unable to clear storage:', e);
  }
  
  // Clear hash fragments
  if (window.location.hash) {
    window.location.hash = '';
  }
  
  // Force clear all caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
}

// Validate React before proceeding
console.log('Main.tsx - React validation:', {
  React: !!React,
  version: React.version,
  hooks: {
    useEffect: typeof React.useEffect,
    useState: typeof React.useState,
    useContext: typeof React.useContext
  }
});

if (!React || !React.useEffect) {
  console.error('CRITICAL: React hooks are not available!');
  throw new Error('React is not properly loaded');
}

console.log('Main.tsx - Initializing app with validated React');

// Initialize app performance monitoring and service worker
initializeApp().then(() => {
  console.log('App initialization complete');
}).catch(error => {
  console.error('App initialization error:', error);
});

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element not found');
}

// Ensure container is clean
container.innerHTML = '';

console.log('Main.tsx - Creating root and rendering App');

const root = createRoot(container);
root.render(<App />);

console.log('Main.tsx - App rendered successfully');
