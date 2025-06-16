
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const loadingVariants = cva(
  "flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "text-primary",
        muted: "text-muted-foreground",
        destructive: "text-destructive",
        success: "text-green-600"
      },
      size: {
        sm: "h-4 w-4",
        default: "h-6 w-6", 
        lg: "h-8 w-8",
        xl: "h-12 w-12"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  text?: string
  overlay?: boolean
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, variant, size, text, overlay, ...props }, ref) => {
    const content = (
      <div 
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-3",
          overlay && "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
          className
        )}
        {...props}
      >
        <Loader2 className={cn(loadingVariants({ variant, size }), "animate-spin")} />
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    )

    return content
  }
)
Loading.displayName = "Loading"

// Skeleton component for loading states
const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("animate-pulse rounded-md bg-muted relative overflow-hidden", className)}
    {...props}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent animate-shimmer" />
  </div>
))
Skeleton.displayName = "Skeleton"

// Shimmer wrapper for loading content
const ShimmerWrapper: React.FC<{ 
  children: React.ReactNode
  isLoading?: boolean
  className?: string
}> = ({ children, isLoading, className }) => {
  if (!isLoading) return <>{children}</>
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent animate-shimmer" />
    </div>
  )
}

export { Loading, Skeleton, ShimmerWrapper, loadingVariants }
