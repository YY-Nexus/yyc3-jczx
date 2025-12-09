"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useVersionCheck } from "@/app/context/version-check-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CheckUpdateButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function CheckUpdateButton({ variant = "outline", size = "sm", className = "" }: CheckUpdateButtonProps) {
  const { checking, checkForUpdates } = useVersionCheck()
  const [showTooltip, setShowTooltip] = useState(false)

  const handleClick = async () => {
    await checkForUpdates(true)
    setShowTooltip(true)
    setTimeout(() => setShowTooltip(false), 3000)
  }

  return (
    <TooltipProvider>
      <Tooltip open={showTooltip}>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={`gap-1 ${className}`}
            onClick={handleClick}
            disabled={checking}
          >
            <RefreshCw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} />
            检查更新
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>已检查更新</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
