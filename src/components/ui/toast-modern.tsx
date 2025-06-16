
import React from "react"
import toast, { Toaster, ToastBar } from "react-hot-toast"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

// Enhanced toast functions
export const showToast = {
  success: (message: string, options?: any) => 
    toast.success(message, {
      duration: 4000,
      ...options,
    }),
    
  error: (message: string, options?: any) => 
    toast.error(message, {
      duration: 5000,
      ...options,
    }),
    
  loading: (message: string, options?: any) => 
    toast.loading(message, {
      ...options,
    }),
    
  info: (message: string, options?: any) => 
    toast(message, {
      icon: <Info className="h-4 w-4" />,
      duration: 4000,
      ...options,
    }),
    
  warning: (message: string, options?: any) => 
    toast(message, {
      icon: <AlertCircle className="h-4 w-4" />,
      duration: 4000,
      ...options,
    }),
    
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    },
    options?: any
  ) => toast.promise(promise, messages, options)
}

// Custom toast component with modern styling
export const ModernToaster: React.FC = () => {
  // Defensive check - don't render if React isn't fully ready
  if (!React || typeof React.useState !== 'function' || typeof React.useEffect !== 'function') {
    console.log('ModernToaster: React not ready, skipping render');
    return null;
  }

  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // Double check React is ready after mount
    if (React && typeof React.useState === 'function') {
      setIsReady(true);
      console.log('ModernToaster: React confirmed ready');
    }
  }, []);

  // Don't render Toaster until React is confirmed ready
  if (!isReady) {
    return null;
  }

  return (
    <Toaster
      position="top-right"
      gutter={8}
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl border bg-background/95 backdrop-blur-md p-4 shadow-large transition-all duration-200",
                "min-w-[300px] max-w-[500px]",
                t.visible ? "animate-slide-in-from-top" : "animate-fade-out"
              )}
            >
              {/* Custom icons based on toast type */}
              <div className="flex-shrink-0">
                {t.type === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {t.type === 'error' && (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                {t.type === 'loading' && (
                  <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
                {t.type === 'blank' && icon}
              </div>
              
              <div className="flex-1 text-sm font-medium text-foreground">
                {message}
              </div>
              
              {t.type !== 'loading' && (
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="flex-shrink-0 rounded-full p-1 hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  )
}

// Progress toast for long operations
export const showProgressToast = (
  message: string,
  progress: number,
  options?: any
) => {
  return toast(
    (t) => (
      <div className="flex flex-col gap-2 min-w-[250px]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{message}</span>
          <span className="text-xs text-muted-foreground">{progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div 
            className="bg-primary h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    ),
    {
      duration: Infinity,
      ...options,
    }
  )
}
