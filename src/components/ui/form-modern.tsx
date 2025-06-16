
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card-modern"
import { Button } from "@/components/ui/button-modern"
import { Input } from "@/components/ui/input-modern"
import { Label } from "@/components/ui/label"

const formVariants = cva(
  "space-y-6",
  {
    variants: {
      variant: {
        default: "",
        card: "p-6",
        inline: "flex flex-wrap gap-4 items-end"
      },
      size: {
        default: "max-w-md",
        lg: "max-w-2xl",
        full: "w-full"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface ModernFormProps
  extends React.FormHTMLAttributes<HTMLFormElement>,
    VariantProps<typeof formVariants> {
  title?: string
  description?: string
  cardVariant?: "default" | "elevated" | "glass" | "gradient"
}

const ModernForm = React.forwardRef<HTMLFormElement, ModernFormProps>(
  ({ className, variant, size, title, description, cardVariant = "elevated", children, ...props }, ref) => {
    const content = (
      <form
        ref={ref}
        className={cn(formVariants({ variant: variant === "card" ? "default" : variant, size, className }))}
        {...props}
      >
        {title && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        {children}
      </form>
    )

    if (variant === "card") {
      return (
        <Card variant={cardVariant} className={cn("max-w-md", size === "lg" && "max-w-2xl", size === "full" && "w-full")}>
          {content}
        </Card>
      )
    }

    return content
  }
)
ModernForm.displayName = "ModernForm"

const FormField = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label?: string
    error?: string
    required?: boolean
    hint?: string
  }
>(({ className, label, error, required, hint, children, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props}>
    {label && (
      <Label className={cn("text-sm font-medium", error && "text-destructive")}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
    )}
    {children}
    {(error || hint) && (
      <div className="text-xs">
        {error && <p className="text-destructive">{error}</p>}
        {hint && !error && <p className="text-muted-foreground">{hint}</p>}
      </div>
    )}
  </div>
))
FormField.displayName = "FormField"

const FormActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "left" | "right" | "center" | "between"
  }
>(({ className, align = "right", children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex gap-3 pt-4",
      align === "left" && "justify-start",
      align === "right" && "justify-end",
      align === "center" && "justify-center",
      align === "between" && "justify-between",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
FormActions.displayName = "FormActions"

export { ModernForm, FormField, FormActions, formVariants }
