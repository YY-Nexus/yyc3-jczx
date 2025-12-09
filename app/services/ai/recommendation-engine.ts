import { aiServiceManager } from "./ai-service-manager"
import { integrations, type Integration } from "@/app/data/integrations"

export interface UserProfile {
  userId: string
  favorites: string[]
  recentViews: string[]
  categories: string[]
  preferences: {
    type?: string
    priceRange?: string
  }
}

export interface RecommendationRequest {
  userProfile: UserProfile
  context?: string
  limit?: number
  excludeIds?: string[]
}

export interface Recommendation {
  integration: Integration
  score: number
  reason: string
  confidence: number
}

export class RecommendationEngine {
  async getRecommendations(request: RecommendationRequest): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []

    const collaborativeRecs = await this.collaborativeFiltering(request)
    const contentBasedRecs = await this.contentBasedFiltering(request)
    const aiRecs = await this.aiBasedRecommendation(request)

    const combined = this.combineRecommendations([collaborativeRecs, contentBasedRecs, aiRecs])

    return combined.filter((rec) => !request.excludeIds?.includes(rec.integration.id)).slice(0, request.limit || 10)
  }

  private async collaborativeFiltering(request: RecommendationRequest): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []
    const { favorites, recentViews } = request.userProfile

    const userInteractions = new Set([...favorites, ...recentViews])

    for (const integration of integrations) {
      if (userInteractions.has(integration.id)) continue

      let score = 0

      const userCategories = new Set(request.userProfile.categories)
      if (userCategories.has(integration.category)) {
        score += 30
      }

      const userTags = new Set(integrations.filter((i) => userInteractions.has(i.id)).flatMap((i) => i.tags))
      const commonTags = integration.tags.filter((tag) => userTags.has(tag)).length
      score += commonTags * 10

      if (score > 0) {
        recommendations.push({
          integration,
          score,
          reason: "基于您的浏览历史和偏好",
          confidence: Math.min(score / 100, 1),
        })
      }
    }

    return recommendations.sort((a, b) => b.score - a.score)
  }

  private async contentBasedFiltering(request: RecommendationRequest): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []
    const { favorites } = request.userProfile

    if (favorites.length === 0) return recommendations

    const favoriteIntegrations = integrations.filter((i) => favorites.includes(i.id))

    for (const integration of integrations) {
      if (favorites.includes(integration.id)) continue

      let score = 0

      for (const favorite of favoriteIntegrations) {
        if (integration.category === favorite.category) {
          score += 20
        }

        const commonTags = integration.tags.filter((tag) => favorite.tags.includes(tag)).length
        score += commonTags * 5

        if (integration.type === favorite.type) {
          score += 10
        }
      }

      if (score > 0) {
        recommendations.push({
          integration,
          score: score / favoriteIntegrations.length,
          reason: "与您收藏的应用相似",
          confidence: Math.min(score / 100, 1),
        })
      }
    }

    return recommendations.sort((a, b) => b.score - a.score)
  }

  private async aiBasedRecommendation(request: RecommendationRequest): Promise<Recommendation[]> {
    const { userProfile, context } = request

    const userContext = `
用户偏好分析:
- 收藏的应用: ${userProfile.favorites.length}个
- 最近浏览: ${userProfile.recentViews.length}个
- 感兴趣的分类: ${userProfile.categories.join(", ")}
- 偏好类型: ${userProfile.preferences.type || "未指定"}
${context ? `- 当前上下文: ${context}` : ""}
`

    const availableIntegrations = integrations
      .filter((i) => !userProfile.favorites.includes(i.id))
      .slice(0, 50)
      .map((i) => `${i.id}: ${i.name} - ${i.category} - ${i.description.substring(0, 100)}`)
      .join("\n")

    try {
      const response = await aiServiceManager.generateResponse({
        messages: [
          {
            role: "user",
            content: `${userContext}

基于以上用户信息，从以下集成应用中推荐最合适的5个，并说明推荐理由。

可选应用:
${availableIntegrations}

请以JSON格式返回，格式如下:
[
  {
    "id": "应用ID",
    "reason": "推荐理由",
    "score": 分数(0-100)
  }
]`,
          },
        ],
        model: "gpt-4o-mini",
        temperature: 0.7,
        maxTokens: 1000,
      })

      const recommendations: Recommendation[] = []
      try {
        const parsed = JSON.parse(response.content)
        for (const item of parsed) {
          const integration = integrations.find((i) => i.id === item.id)
          if (integration) {
            recommendations.push({
              integration,
              score: item.score,
              reason: item.reason,
              confidence: item.score / 100,
            })
          }
        }
      } catch (parseError) {
        console.error("[v0] Failed to parse AI recommendations:", parseError)
      }

      return recommendations
    } catch (error) {
      console.error("[v0] AI recommendation failed:", error)
      return []
    }
  }

  private combineRecommendations(recommendationSets: Recommendation[][]): Recommendation[] {
    const combined = new Map<string, Recommendation>()

    for (const recommendations of recommendationSets) {
      for (const rec of recommendations) {
        const existing = combined.get(rec.integration.id)
        if (existing) {
          existing.score = (existing.score + rec.score) / 2
          existing.confidence = (existing.confidence + rec.confidence) / 2
          existing.reason = `${existing.reason}; ${rec.reason}`
        } else {
          combined.set(rec.integration.id, { ...rec })
        }
      }
    }

    return Array.from(combined.values()).sort((a, b) => b.score - a.score)
  }

  async explainRecommendation(integrationId: string, userProfile: UserProfile): Promise<string> {
    const integration = integrations.find((i) => i.id === integrationId)
    if (!integration) return "未找到该集成应用"

    const response = await aiServiceManager.generateResponse({
      messages: [
        {
          role: "user",
          content: `用户收藏了${userProfile.favorites.length}个应用，最近浏览了${userProfile.recentViews.length}个应用，感兴趣的分类包括: ${userProfile.categories.join(", ")}。

为什么推荐"${integration.name}"这个${integration.category}类应用给该用户？请用1-2句话简洁说明。`,
        },
      ],
      model: "gpt-4o-mini",
      temperature: 0.7,
      maxTokens: 200,
    })

    return response.content
  }
}

export const recommendationEngine = new RecommendationEngine()
