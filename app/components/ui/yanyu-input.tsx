import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/20",
        underlined: "border-0 border-b rounded-none focus-visible:border-primary",
        filled: "bg-muted border-transparent focus-visible:bg-background",
      },
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-8 px-2 py-1 text-xs",
        lg: "h-12 px-4 py-3 text-base",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
      width: {
        default: "w-full",
        auto: "w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
      width: "default",
    },
  },
)

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const YanyuInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, rounded, width, ...props }, ref) => {
    return <input className={cn(inputVariants({ variant, size, rounded, width, className }))} ref={ref} {...props} />
  },
)
YanyuInput.displayName = "YanyuInput"

export { YanyuInput }
