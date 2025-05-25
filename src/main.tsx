
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeApp } from './utils/appInitialization'

// Initialize app performance monitoring and service worker
initializeApp().then(() => {
  console.log('Performance monitoring and service worker initialized');
});

createRoot(document.getElementById("root")!).render(<App />);
