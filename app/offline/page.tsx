"use client"

import { WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <WifiOff className="h-24 w-24 mx-auto text-muted-foreground" />
        <h1 className="text-3xl font-bold">您当前处于离线状态</h1>
        <p className="text-muted-foreground">无法连接到网络。请检查您的网络连接，然后重试。</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => window.location.reload()} className="w-full sm:w-auto">
            重新加载
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto bg-transparent">
            <Link href="/">返回首页</Link>
          </Button>
        </div>
        <div className="pt-6 border-t">
          <h2 className="font-semibold mb-2">离线可用功能</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>浏览已缓存的集成应用</li>
            <li>查看收藏的应用</li>
            <li>访问已缓存的页面</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
