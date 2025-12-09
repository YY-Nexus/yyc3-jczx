import type { Integration } from "../../data/integrations"
import IntegrationCard from "./IntegrationCard"

type IntegrationGridProps = {
  integrations: Integration[]
}

export default function IntegrationGrid({ integrations }: IntegrationGridProps) {
  if (integrations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">未找到匹配的集成应用</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {integrations.map((integration) => (
        <IntegrationCard key={integration.id} integration={integration} />
      ))}
    </div>
  )
}
