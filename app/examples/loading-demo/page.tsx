"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useGlobalLoading } from "@/app/components/ui/global-loading"

export default function LoadingDemoPage() {
  const router = useRouter()
  const { showLoading } = useGlobalLoading()
  const [message, setMessage] = useState("正在加载中...")
  const [timeout, setTimeout] = useState(3000)
  const [progress, setProgress] = useState<number | undefined>(undefined)
  const [useCustomProgress, setUseCustomProgress] = useState(false)
  const [redirectPath, setRedirectPath] = useState("/")

  const handleShowGlobalLoading = () => {
    showLoading({
      message,
      progress: useCustomProgress ? progress : undefined,
      timeout,
      onComplete: () => {
        console.log("加载完成")
      },
    })
  }

  const handleRedirectWithLoading = () => {
    const params = new URLSearchParams()
    params.append("redirect", redirectPath)
    params.append("message", encodeURIComponent(message))

    if (useCustomProgress && progress !== undefined) {
      params.append("progress", progress.toString())
    }

    params.append("timeout", timeout.toString())

    router.push(`/loading?${params.toString()}`)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">加载页面演示</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>全局加载状态</CardTitle>
            <CardDescription>显示一个全局加载状态覆盖层</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">加载消息</label>
              <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="输入加载消息" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">超时时间 (毫秒): {timeout}</label>
              <Slider
                value={[timeout]}
                min={1000}
                max={10000}
                step={500}
                onValueChange={(value) => setTimeout(value[0])}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useCustomProgress"
                checked={useCustomProgress}
                onChange={(e) => setUseCustomProgress(e.target.checked)}
              />
              <label htmlFor="useCustomProgress">使用自定义进度</label>
            </div>

            {useCustomProgress && (
              <div>
                <label className="block text-sm font-medium mb-1">进度: {progress}%</label>
                <Slider
                  value={[progress || 0]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setProgress(value[0])}
                />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleShowGlobalLoading}>显示加载状态</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>加载页面跳转</CardTitle>
            <CardDescription>跳转到专门的加载页面，然后重定向</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">加载消息</label>
              <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="输入加载消息" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">重定向路径</label>
              <Input
                value={redirectPath}
                onChange={(e) => setRedirectPath(e.target.value)}
                placeholder="输入重定向路径"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">超时时间 (毫秒): {timeout}</label>
              <Slider
                value={[timeout]}
                min={1000}
                max={10000}
                step={500}
                onValueChange={(value) => setTimeout(value[0])}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useCustomProgressRedirect"
                checked={useCustomProgress}
                onChange={(e) => setUseCustomProgress(e.target.checked)}
              />
              <label htmlFor="useCustomProgressRedirect">使用自定义进度</label>
            </div>

            {useCustomProgress && (
              <div>
                <label className="block text-sm font-medium mb-1">进度: {progress}%</label>
                <Slider
                  value={[progress || 0]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setProgress(value[0])}
                />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleRedirectWithLoading}>跳转到加载页面</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
