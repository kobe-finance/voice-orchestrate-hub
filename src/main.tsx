
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Main.tsx - Starting application');

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element not found');
}

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
