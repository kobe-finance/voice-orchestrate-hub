
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const Form = FormProvider

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

type FormFieldContextValue = {
  name: string
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label?: string
    error?: string
    required?: boolean
    hint?: string
  }
>(({ className, label, error, required, hint, children, ...props }, ref) => {
  const id = React.useId()

  // Modern form field styling
  if (label || error || hint) {
    return (
      <FormItemContext.Provider value={{ id }}>
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
      </FormItemContext.Provider>
    )
  }

  // Standard form item
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

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

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  ModernForm,
  FormActions,
  formVariants,
}
