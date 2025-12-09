"use client"

import { useEffect } from "react"
import { ErrorDisplay } from "./components/error-handling/error-display"
import { logError } from "./services/error-logging"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // 记录错误到日志服务
    logError({
      error: error.toString(),
      timestamp: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : "",
      additionalInfo: {
        digest: error.digest,
      },
    })
  }, [error])

  return <ErrorDisplay error={error} resetError={reset} title="页面加载失败" showDetails={true} />
}
