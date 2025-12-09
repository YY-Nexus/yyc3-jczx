"use client"

import { useEncryption } from "@/app/context/encryption-context"
import { Badge } from "@/components/ui/badge"
import { Lock, Unlock } from "lucide-react"

export function EncryptionStatus() {
  const { encryptionStatus, encryptionSettings } = useEncryption()

  if (encryptionStatus === "loading") {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-500">
        <span className="animate-pulse">加载中...</span>
      </Badge>
    )
  }

  if (encryptionStatus === "enabled" && encryptionSettings.enabled) {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
        <Lock className="h-3 w-3 mr-1" />
        已加密
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
      <Unlock className="h-3 w-3 mr-1" />
      未加密
    </Badge>
  )
}
