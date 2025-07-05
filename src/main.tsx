
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "sonner";

console.log("Main.tsx - Starting application");
console.log("React version:", React.version);

console.log("Main.tsx - Creating React root");
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

console.log("Main.tsx - Rendering App component");
root.render(
  <StrictMode>
    <App />
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        },
      }}
    />
  </StrictMode>
);

console.log("Main.tsx - App rendered successfully");
