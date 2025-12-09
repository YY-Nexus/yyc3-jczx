"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"

export function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return
    }

    navigator.serviceWorker.ready.then((reg) => {
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing

        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setShowPrompt(true)
              setRegistration(reg)
            }
          })
        }
      })
    })
  }, [])

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" })
      window.location.reload()
    }
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">新版本可用</CardTitle>
          </div>
          <CardDescription>发现新版本，点击更新以获取最新功能</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button onClick={handleUpdate} className="flex-1">
            立即更新
          </Button>
          <Button variant="outline" onClick={() => setShowPrompt(false)}>
            忽略
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
