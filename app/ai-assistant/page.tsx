"use client"
import { DbAssistant } from "@/app/components/ai-assistant/db-assistant"

export default function AiAssistantPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">言语云³智能助手</h1>
      <DbAssistant initialExpanded={true} />
    </div>
  )
}
