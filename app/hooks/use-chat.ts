"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

export interface UseChatOptions {
  api?: string
  onResponse?: (response: Response) => void
  onFinish?: (message: Message) => void
  onError?: (error: Error) => void
}

export interface UseChatHelpers {
  messages: Message[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  isLoading: boolean
  error: Error | null
  setMessages: (messages: Message[]) => void
  append: (message: Omit<Message, "id">) => Promise<void>
  reload: () => Promise<void>
  stop: () => void
}

export function useChat(options: UseChatOptions = {}): UseChatHelpers {
  const { api = "/api/chat", onResponse, onFinish, onError } = options

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }, [])

  const append = useCallback(
    async (message: Omit<Message, "id">) => {
      const newMessage: Message = {
        ...message,
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }

      setMessages((prev) => [...prev, newMessage])
      setIsLoading(true)
      setError(null)

      try {
        abortControllerRef.current = new AbortController()

        const response = await fetch(api, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, newMessage],
          }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        if (onResponse) {
          onResponse(response)
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          throw new Error("Response body is null")
        }

        let assistantMessage = ""
        const assistantMessageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        setMessages((prev) => [
          ...prev,
          {
            id: assistantMessageId,
            role: "assistant",
            content: "",
          },
        ])

        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            break
          }

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("0:")) {
              const data = line.slice(2).trim()
              if (data) {
                assistantMessage += data
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? {
                          ...msg,
                          content: assistantMessage,
                        }
                      : msg,
                  ),
                )
              }
            }
          }
        }

        const finalMessage: Message = {
          id: assistantMessageId,
          role: "assistant",
          content: assistantMessage,
        }

        if (onFinish) {
          onFinish(finalMessage)
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            return
          }
          setError(err)
          if (onError) {
            onError(err)
          }
        }
      } finally {
        setIsLoading(false)
        abortControllerRef.current = null
      }
    },
    [api, messages, onResponse, onFinish, onError],
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (!input.trim() || isLoading) {
        return
      }

      const userMessage = input.trim()
      setInput("")

      await append({
        role: "user",
        content: userMessage,
      })
    },
    [input, isLoading, append],
  )

  const reload = useCallback(async () => {
    if (messages.length === 0) {
      return
    }

    const lastUserMessageIndex = messages.findLastIndex((msg) => msg.role === "user")

    if (lastUserMessageIndex === -1) {
      return
    }

    const newMessages = messages.slice(0, lastUserMessageIndex + 1)
    setMessages(newMessages)

    const lastUserMessage = messages[lastUserMessageIndex]
    await append({
      role: lastUserMessage.role,
      content: lastUserMessage.content,
    })
  }, [messages, append])

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)
    }
  }, [])

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setMessages,
    append,
    reload,
    stop,
  }
}
