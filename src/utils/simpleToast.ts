
// Simple toast system that doesn't depend on React hooks
let toastCount = 0;

interface ToastOptions {
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export const simpleToast = (message: string, options: ToastOptions = { type: 'info' }) => {
  const id = `toast-${++toastCount}`;
  const duration = options.duration || 4000;
  
  // Create toast element
  const toast = document.createElement('div');
  toast.id = id;
  toast.className = `fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
  
  // Set colors based on type
  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white', 
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-black'
  };
  
  toast.className += ` ${colors[options.type]}`;
  toast.textContent = message;
  
  // Add to DOM
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 10);
  
  // Remove after duration
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, duration);
};

export const toast = {
  success: (message: string) => simpleToast(message, { type: 'success' }),
  error: (message: string) => simpleToast(message, { type: 'error' }),
  info: (message: string) => simpleToast(message, { type: 'info' }),
  warning: (message: string) => simpleToast(message, { type: 'warning' })
};
