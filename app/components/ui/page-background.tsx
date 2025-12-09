"use client"

import { cn } from "@/lib/utils"
import type React from "react"

interface PageBackgroundProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "gradient" | "pattern"
}

export function PageBackground({ children, className, variant = "default" }: PageBackgroundProps) {
  const backgroundStyles = {
    default: "bg-gradient-to-br from-blue-50/50 via-sky-50/30 to-cyan-50/50",
    gradient: "bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50",
    pattern:
      "bg-gradient-to-br from-blue-50/50 via-sky-50/30 to-cyan-50/50 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.1)_1px,transparent_0)] bg-[length:20px_20px]",
  }

  return (
    <div className={cn("min-h-screen transition-all duration-300", backgroundStyles[variant], className)}>
      {children}
    </div>
  )
}
