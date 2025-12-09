"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useGlobalLoading } from "../components/ui/global-loading"
import { ImageComponent } from "../components/ui/image-component"

export default function LoadingDemoPage() {
  const router = useRouter()
  const { showLoading, hideLoading, updateProgress } = useGlobalLoading()
  const [message, setMessage] = useState("正在加载中...")
  const [timeout, setTimeout] = useState(3000)
  const [redirectPath, setRedirectPath] = useState("/")

  const handleGlobalLoading = () => {
    showLoading({ message })

    // 模拟进度更新
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      updateProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          hideLoading()
        }, 500)
      }
    }, timeout / 10)
  }

  const handleRedirectLoading = () => {
    const params = new URLSearchParams()
    params.append("redirect", redirectPath)
    params.append("message", message)
    params.append("timeout", timeout.toString())

    router.push(`/loading?${params.toString()}`)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">加载状态演示</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>图片组件测试</CardTitle>
            <CardDescription>测试封装的ImageComponent组件</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">言语云³标志</h3>
              <div className="flex justify-center">
                <div className="relative w-40 h-40">
                  <ImageComponent
                    src="/images/yanyu-shield-logo.png"
                    alt="言语云³标志"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>加载指示器测试</CardTitle>
            <CardDescription>测试Spinner组件</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              <div>
                <h3 className="font-medium mb-2 text-center">小尺寸</h3>
                <div className="flex justify-center">
                  <div className="spinner-small border-blue-500"></div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2 text-center">中尺寸</h3>
                <div className="flex justify-center">
                  <div className="spinner-medium border-blue-500"></div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2 text-center">大尺寸</h3>
                <div className="flex justify-center">
                  <div className="spinner-large border-blue-500"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global">全局加载状态</TabsTrigger>
          <TabsTrigger value="redirect">加载页面跳转</TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          <Card>
            <CardHeader>
              <CardTitle>全局加载状态</CardTitle>
              <CardDescription>显示覆盖整个应用的加载状态</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="global-message">加载消息</Label>
                <Input
                  id="global-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="输入加载消息"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="global-timeout">加载时长 (毫秒)</Label>
                <Input
                  id="global-timeout"
                  type="number"
                  value={timeout}
                  onChange={(e) => setTimeout(Number.parseInt(e.target.value))}
                  min={1000}
                  max={10000}
                  step={1000}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGlobalLoading} className="w-full">
                显示全局加载状态
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="redirect">
          <Card>
            <CardHeader>
              <CardTitle>加载页面跳转</CardTitle>
              <CardDescription>跳转到专门的加载页面，然后重定向到目标页面</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="redirect-message">加载消息</Label>
                <Input
                  id="redirect-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="输入加载消息"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="redirect-timeout">加载时长 (毫秒)</Label>
                <Input
                  id="redirect-timeout"
                  type="number"
                  value={timeout}
                  onChange={(e) => setTimeout(Number.parseInt(e.target.value))}
                  min={1000}
                  max={10000}
                  step={1000}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="redirect-path">重定向路径</Label>
                <Input
                  id="redirect-path"
                  value={redirectPath}
                  onChange={(e) => setRedirectPath(e.target.value)}
                  placeholder="输入重定向路径"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleRedirectLoading} className="w-full">
                跳转到加载页面
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
