"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const button3DVariants = cva(
  "relative inline-flex items-center justify-center font-medium transition-all duration-300 transform-gpu perspective-1000 preserve-3d group overflow-hidden",
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500",
          "hover:from-blue-600 hover:via-purple-700 hover:to-cyan-600",
          "text-white shadow-lg hover:shadow-xl",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100",
          "after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/10 after:to-transparent",
        ],
        secondary: [
          "bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300",
          "hover:from-gray-200 hover:via-gray-300 hover:to-gray-400",
          "text-gray-800 shadow-md hover:shadow-lg",
          "border border-gray-300/50",
        ],
        accent: [
          "bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600",
          "hover:from-emerald-500 hover:via-teal-600 hover:to-cyan-700",
          "text-white shadow-lg hover:shadow-xl",
        ],
        warning: [
          "bg-gradient-to-br from-orange-400 via-red-500 to-pink-600",
          "hover:from-orange-500 hover:via-red-600 hover:to-pink-700",
          "text-white shadow-lg hover:shadow-xl",
        ],
        success: [
          "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600",
          "hover:from-green-500 hover:via-emerald-600 hover:to-teal-700",
          "text-white shadow-lg hover:shadow-xl",
        ],
        glass: [
          "bg-white/10 backdrop-blur-md border border-white/20",
          "hover:bg-white/20 hover:border-white/30",
          "text-white shadow-lg hover:shadow-xl",
        ],
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        default: "h-10 px-4 py-2 text-sm rounded-lg",
        lg: "h-12 px-6 py-3 text-base rounded-xl",
        xl: "h-14 px-8 py-4 text-lg rounded-2xl",
        icon: "h-10 w-10 rounded-lg",
      },
      effect: {
        none: "",
        glow: "hover:shadow-2xl hover:shadow-current/25",
        pulse: "animate-pulse hover:animate-none",
        bounce: "hover:animate-bounce",
        float: "hover:-translate-y-1 hover:shadow-2xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      effect: "float",
    },
  },
)

export interface Button3DProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button3DVariants> {
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

const Button3D = React.forwardRef<HTMLButtonElement, Button3DProps>(
  ({ className, variant, size, effect, icon, iconPosition = "left", children, ...props }, ref) => {
    return (
      <button className={cn(button3DVariants({ variant, size, effect }), className)} ref={ref} {...props}>
        {/* 3D 底面效果 */}
        <div className="absolute inset-0 bg-black/20 transform translate-y-1 translate-x-1 rounded-lg -z-10 group-hover:translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />

        {/* 光泽效果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

        {/* 内容 */}
        <div className="relative z-10 flex items-center gap-2">
          {icon && iconPosition === "left" && (
            <span className="transition-transform duration-300 group-hover:scale-110">{icon}</span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span className="transition-transform duration-300 group-hover:scale-110">{icon}</span>
          )}
        </div>

        {/* 彩虹边框效果 */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 via-red-500 via-orange-500 via-yellow-500 via-green-500 via-teal-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-gradient-x" />
      </button>
    )
  },
)
Button3D.displayName = "Button3D"

export { Button3D, button3DVariants }
