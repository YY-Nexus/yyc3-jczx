"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import {
  type AssistantService,
  type AssistantState,
  type AssistantConfig,
  type AssistantMessage,
  type AssistantSession,
  createAssistantService,
} from "@/app/services/ai-assistant/assistant-service"

// 上下文类型定义
type AssistantContextType = {
  state: AssistantState
  sendMessage: (content: string) => Promise<AssistantMessage | null>
  createSession: (title?: string) => AssistantSession
  switchSession: (sessionId: string) => AssistantSession | null
  deleteSession: (sessionId: string) => boolean
  cancelRequest: () => void
  configureAssistant: (config: Partial<AssistantConfig>) => void
  clearCurrentSession: () => void
}

// 创建上下文
const AssistantContext = createContext<AssistantContextType | undefined>(undefined)

// 提供者组件
export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [assistantService] = useState<AssistantService>(() => createAssistantService())
  const [state, setState] = useState<AssistantState>(assistantService.getState())

  // 更新状态的事件监听器
  useEffect(() => {
    const updateState = () => {
      setState(assistantService.getState())
    }

    // 注册事件监听
    assistantService.on("messageSent", updateState)
    assistantService.on("responseReceived", updateState)
    assistantService.on("processingStarted", updateState)
    assistantService.on("requestCancelled", updateState)
    assistantService.on("error", updateState)
    assistantService.on("sessionCreated", updateState)
    assistantService.on("sessionSwitched", updateState)
    assistantService.on("sessionDeleted", updateState)
    assistantService.on("configChanged", updateState)
    assistantService.on("sessionsLoaded", updateState)

    // 从本地存储加载会话
    assistantService.loadSessionsFromStorage()

    // 清理事件监听
    return () => {
      assistantService.removeAllListeners()
    }
  }, [assistantService])

  // 发送消息
  const sendMessage = useCallback((content: string) => assistantService.sendMessage(content), [assistantService])

  // 创建会话
  const createSession = useCallback((title?: string) => assistantService.createSession(title), [assistantService])

  // 切换会话
  const switchSession = useCallback(
    (sessionId: string) => assistantService.switchSession(sessionId),
    [assistantService],
  )

  // 删除会话
  const deleteSession = useCallback(
    (sessionId: string) => assistantService.deleteSession(sessionId),
    [assistantService],
  )

  // 取消请求
  const cancelRequest = useCallback(() => assistantService.cancelRequest(), [assistantService])

  // 配置助手
  const configureAssistant = useCallback(
    (config: Partial<AssistantConfig>) => assistantService.configure(config),
    [assistantService],
  )

  // 清空当前会话
  const clearCurrentSession = useCallback(() => {
    if (state.currentSession) {
      const newSession = assistantService.createSession("新对话")
      return newSession
    }
    return null
  }, [assistantService, state.currentSession])

  // 保存会话到本地存储
  useEffect(() => {
    const saveToStorage = () => {
      assistantService.saveSessionsToStorage()
    }

    // 当会话更新时保存
    assistantService.on("messageSent", saveToStorage)
    assistantService.on("responseReceived", saveToStorage)
    assistantService.on("sessionCreated", saveToStorage)
    assistantService.on("sessionDeleted", saveToStorage)

    return () => {
      assistantService.removeListener("messageSent", saveToStorage)
      assistantService.removeListener("responseReceived", saveToStorage)
      assistantService.removeListener("sessionCreated", saveToStorage)
      assistantService.removeListener("sessionDeleted", saveToStorage)
    }
  }, [assistantService])

  // 提供上下文值
  const contextValue: AssistantContextType = {
    state,
    sendMessage,
    createSession,
    switchSession,
    deleteSession,
    cancelRequest,
    configureAssistant,
    clearCurrentSession,
  }

  return <AssistantContext.Provider value={contextValue}>{children}</AssistantContext.Provider>
}

// 使用助手的Hook
export function useAssistant() {
  const context = useContext(AssistantContext)
  if (context === undefined) {
    throw new Error("useAssistant must be used within an AssistantProvider")
  }
  return context
}
