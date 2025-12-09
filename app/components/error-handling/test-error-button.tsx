"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useErrorHandler } from "@/app/hooks/use-error-handler"

interface TestErrorButtonProps {
  errorType: "component" | "api" | "async" | "toast"
  label?: string
}

export function TestErrorButton({ errorType, label }: TestErrorButtonProps) {
  const { handleError } = useErrorHandler()
  const [loading, setLoading] = useState(false)

  const triggerComponentError = () => {
    // 这将触发组件错误，被错误边界捕获
    throw new Error("这是一个组件渲染错误测试")
  }

  const triggerApiError = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/example?error=true")
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error?.message || "请求失败")
      }
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const triggerAsyncError = async () => {
    setLoading(true)
    try {
      // 模拟异步操作错误
      await new Promise((_, reject) => {
        setTimeout(() => reject(new Error("这是一个异步操作错误测试")), 1000)
      })
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const triggerToastError = () => {
    handleError(new Error("这是一个Toast错误提示测试"))
  }

  const handleClick = () => {
    switch (errorType) {
      case "component":
        triggerComponentError()
        break
      case "api":
        triggerApiError()
        break
      case "async":
        triggerAsyncError()
        break
      case "toast":
        triggerToastError()
        break
    }
  }

  const getLabel = () => {
    switch (errorType) {
      case "component":
        return label || "触发组件错误"
      case "api":
        return label || "触发API错误"
      case "async":
        return label || "触发异步错误"
      case "toast":
        return label || "触发Toast错误"
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading} variant="destructive">
      {loading ? "加载中..." : getLabel()}
    </Button>
  )
}
