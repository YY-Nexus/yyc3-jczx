"use client"

import { useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { logError } from "@/app/services/error-logging"

interface ErrorOptions {
  showToast?: boolean
  logToServer?: boolean
  additionalInfo?: Record<string, any>
}

export function useErrorHandler() {
  const { toast } = useToast()

  const handleError = useCallback(
    (error: unknown, options: ErrorOptions = {}) => {
      const { showToast = true, logToServer = true, additionalInfo = {} } = options

      // 确保错误是Error对象
      const errorObj = error instanceof Error ? error : new Error(String(error))

      // 记录到控制台
      console.error("错误:", errorObj)

      // 显示Toast通知
      if (showToast) {
        toast({
          title: "操作失败",
          description: errorObj.message || "发生了未知错误",
          variant: "destructive",
        })
      }

      // 记录到服务器
      if (logToServer) {
        logError({
          error: errorObj.toString(),
          timestamp: new Date().toISOString(),
          url: typeof window !== "undefined" ? window.location.href : "",
          additionalInfo,
        })
      }

      return errorObj
    },
    [toast],
  )

  return { handleError }
}
