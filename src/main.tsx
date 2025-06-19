
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Main.tsx - Starting application');
console.log('React version:', React.version);

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element not found');
}

try {
  console.log('Main.tsx - Creating React root');
  const root = createRoot(container);
  
  console.log('Main.tsx - Rendering App component');
  root.render(<App />);
  
  console.log('Main.tsx - App rendered successfully');
} catch (error) {
  console.error('Failed to render App:', error);
  // Fallback error display
  container.innerHTML = `
    <div style="padding: 20px; font-family: system-ui;">
      <h1>Application Error</h1>
      <p>Failed to initialize the application. Please refresh the page.</p>
      <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
      <button onclick="window.location.reload()">Refresh</button>
    </div>
  `;
}
