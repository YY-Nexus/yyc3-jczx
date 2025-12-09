"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LinkIcon } from "lucide-react"

interface CategoryConnectButtonProps {
  categoryName: string
  size?: "default" | "sm" | "lg"
  showText?: boolean
  className?: string
  onClick?: () => void
}

export default function CategoryConnectButton({
  categoryName,
  size = "default",
  showText = true,
  className,
  onClick,
}: CategoryConnectButtonProps) {
  const handleConnect = () => {
    // 处理连接逻辑
    console.log(`连接到分类: ${categoryName}`)
    if (onClick) onClick()
  }

  return (
    <Button
      variant="default"
      size={size}
      onClick={handleConnect}
      className={cn(
        "bg-sky-500 hover:bg-sky-600 text-white font-medium",
        size === "sm" && "text-xs py-1 px-2 h-7",
        className,
      )}
      aria-label={`连接到${categoryName}`}
    >
      <LinkIcon className="h-4 w-4 mr-1" />
      {showText && "连接"}
    </Button>
  )
}
