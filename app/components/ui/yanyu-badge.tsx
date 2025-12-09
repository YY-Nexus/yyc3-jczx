import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-dark",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-dark",
        accent: "bg-accent text-accent-foreground hover:bg-accent-dark",
        outline: "text-foreground border border-input",
        success: "bg-success/20 text-success-dark",
        warning: "bg-warning/20 text-warning-dark",
        error: "bg-error/20 text-error-dark",
        info: "bg-info/20 text-info-dark",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function YanyuBadge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size, className }))} {...props} />
}

export { YanyuBadge, badgeVariants }
