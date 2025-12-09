"use client"

import type { Integration } from "../../data/integrations"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from "next/link"

type IntegrationCardProps = {
  integration: Integration
}

export default function IntegrationCard({ integration }: IntegrationCardProps) {
  const Icon = integration.icon

  return (
    <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
      <Link href={`/integrations/${integration.id}`}>
        <Card className="overflow-hidden h-full border-2 hover:border-primary/50 transition-all duration-300 group relative">
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
            style={{ backgroundColor: integration.color }}
          ></div>
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex flex-col items-center text-center space-y-2 mb-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 shadow-md"
                style={{ backgroundColor: `${integration.color}20` }}
              >
                <Icon
                  className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: integration.color }}
                />
              </div>
              <h3 className="font-semibold text-sm">{integration.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{integration.category}</span>
            </div>
            <p className="text-xs text-gray-500 flex-grow overflow-hidden">
              {integration.description.length > 120
                ? `${integration.description.substring(0, 120)}...`
                : integration.description}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
