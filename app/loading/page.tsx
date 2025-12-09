"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LoadingScreen } from "../components/ui/loading-screen"

export default function LoadingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)

  const redirect = searchParams.get("redirect") || "/"
  const message = searchParams.get("message") || "正在加载中..."
  const timeout = Number.parseInt(searchParams.get("timeout") || "3000")

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2
        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return newProgress
      })
    }, timeout / 50)

    return () => clearInterval(interval)
  }, [timeout])

  useEffect(() => {
    if (progress === 100) {
      const redirectTimer = setTimeout(() => {
        router.push(redirect)
      }, 500)

      return () => clearTimeout(redirectTimer)
    }
  }, [progress, redirect, router])

  return <LoadingScreen message={message} progress={progress} showProgress={true} />
}
