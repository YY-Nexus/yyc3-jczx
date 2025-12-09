"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"

interface LoadingScreenProps {
  message?: string
  progress?: number
  showProgress?: boolean
  duration?: number
  onComplete?: () => void
}

export function LoadingScreen({
  message = "正在加载中...",
  progress,
  showProgress = true,
  duration = 3000,
  onComplete,
}: LoadingScreenProps) {
  const [currentProgress, setCurrentProgress] = useState(0)

  useEffect(() => {
    if (progress !== undefined) {
      setCurrentProgress(progress)
      return
    }

    const interval = setInterval(() => {
      setCurrentProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          onComplete?.()
          return 100
        }
        return prev + 100 / (duration / 100)
      })
    }, 100)

    return () => clearInterval(interval)
  }, [progress, duration, onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
      {/* 背景动画效果 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-teal-600/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-8 p-8">
        {/* Logo区域 */}
        <div className="relative">
          <div className="w-24 h-24 relative animate-float">
            <Image
              src="/images/yanyu-shield-logo.png"
              alt="言语云³集成中心系统"
              width={96}
              height={96}
              className="object-contain drop-shadow-2xl"
            />
          </div>

          {/* 光环效果 */}
          <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-20 animate-ping" />
          <div className="absolute inset-2 w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 opacity-30 animate-pulse" />
        </div>

        {/* 标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
            言语云³集成中心系统
          </h1>
          <p className="text-sm text-muted-foreground font-medium">YanYu Cloud³ Integration Center</p>
        </div>

        {/* 加载消息 */}
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700 mb-2">{message}</p>
          {showProgress && (
            <div className="w-64 space-y-2">
              <Progress value={currentProgress} className="h-2 bg-gray-200" />
              <p className="text-sm text-gray-500">{Math.round(currentProgress)}%</p>
            </div>
          )}
        </div>

        {/* 装饰性元素 */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
        </div>
      </div>
    </div>
  )
}
