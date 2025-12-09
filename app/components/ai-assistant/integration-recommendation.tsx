"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Integration } from "@/app/data/integrations"

interface IntegrationRecommendationProps {
  messages: { role: string; content: string }[]
  onClose: () => void
  className?: string
}

export function IntegrationRecommendation({ messages, onClose, className }: IntegrationRecommendationProps) {
  const [recommendations, setRecommendations] = useState<Integration[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 只在有新消息时触发推荐
    if (messages.length > 0) {
      generateRecommendations()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length])

  const generateRecommendations = async () => {
    if (messages.length === 0) return

    setIsLoading(true)
    try {
      // 获取最近5条消息作为上下文
      const recentMessages = messages
        .slice(-5)
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n")

      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: recentMessages }),
      })

      if (!response.ok) {
        throw new Error("推荐请求失败")
      }

      const data = await response.json()
      setRecommendations(data.recommendations)
    } catch (error) {
      console.error("获取推荐时出错:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (recommendations.length === 0 && !isLoading) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className={cn("w-full overflow-hidden", className)}
      >
        <Card className="border-primary/20 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                推荐集成应用
              </h3>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                <X className="h-3 w-3" />
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="flex space-x-1 items-center">
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                  {recommendations.slice(0, 2).map((integration) => (
                    <RecommendationCard key={integration.id} integration={integration} />
                  ))}
                </div>
                {recommendations.length > 2 && (
                  <Button asChild variant="link" size="sm" className="w-full mt-1 text-xs">
                    <Link href="/integrations">
                      查看更多推荐
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

interface RecommendationCardProps {
  integration: Integration
}

function RecommendationCard({ integration }: RecommendationCardProps) {
  const Icon = integration.icon

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="group"
    >
      <Link href={`/integrations?id=${integration.id}`}>
        <Card className="overflow-hidden border hover:border-primary/50 transition-all duration-300 h-full">
          <CardContent className="p-3 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${integration.color}20` }}
            >
              <Icon className="w-5 h-5" style={{ color: integration.color }} />
            </div>
            <div className="overflow-hidden">
              <h4 className="font-medium text-sm truncate">{integration.name}</h4>
              <p className="text-xs text-gray-500 truncate">{integration.category}</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
