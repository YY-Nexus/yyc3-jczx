"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Download } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import type { Integration } from "@/app/data/integrations"
import { FavoriteButton } from "@/app/components/favorites/favorite-button"
import { useState } from "react"

interface IntegrationCardProps {
  integration: Integration
}

export function IntegrationCard({ integration }: IntegrationCardProps) {
  const Icon = integration.icon
  const [isHovering, setIsHovering] = useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <Link href={`/marketplace/integration/${integration.id}`}>
        <Card className="overflow-hidden h-full border hover:border-primary/50 transition-all duration-300 group relative">
          {integration.new && <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">新上线</Badge>}
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${integration.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: integration.color }} />
              </div>
              <div>
                <h3 className="font-semibold text-sm line-clamp-1">{integration.name}</h3>
                <div className="text-xs text-gray-500">{integration.developer}</div>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{integration.description}</p>

            <div className="mt-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-500 mr-1" />
                  <span className="text-xs font-medium">{integration.rating}</span>
                  <span className="text-xs text-gray-500 ml-1">({integration.reviewCount})</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Download className="w-3 h-3 mr-1" />
                  {integration.installCount > 1000
                    ? `${(integration.installCount / 1000).toFixed(1)}千`
                    : integration.installCount}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={
                    integration.price.type === "free"
                      ? "text-green-600 border-green-200 bg-green-50"
                      : integration.price.type === "freemium"
                        ? "text-blue-600 border-blue-200 bg-blue-50"
                        : "text-gray-500 border-gray-200 bg-gray-50"
                  }
                >
                  {integration.price.type === "free"
                    ? "免费"
                    : integration.price.type === "freemium"
                      ? "免费增值"
                      : `¥${integration.price.value}/月`}
                </Badge>
                <div className="text-xs text-gray-500">{integration.category}</div>
              </div>
            </div>

            {/* 收藏按钮 - 仅在悬停时显示 */}
            {isHovering && (
              <div className="absolute top-2 right-2 z-10">
                <FavoriteButton id={integration.id as string} variant="ghost" size="sm" showText={false} />
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
