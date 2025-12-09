import { aiServiceManager } from "./ai-service-manager"

export interface UsagePattern {
  userId: string
  timestamp: Date
  action: string
  integrationId?: string
  category?: string
  metadata?: Record<string, any>
}

export interface Prediction {
  type: string
  confidence: number
  prediction: any
  reasoning: string
}

export class PredictiveAnalytics {
  private usageHistory: UsagePattern[] = []

  recordUsage(pattern: UsagePattern) {
    this.usageHistory.push(pattern)

    if (this.usageHistory.length > 10000) {
      this.usageHistory = this.usageHistory.slice(-5000)
    }
  }

  async predictNextAction(userId: string): Promise<Prediction> {
    const userHistory = this.usageHistory.filter((p) => p.userId === userId).slice(-50)

    if (userHistory.length < 5) {
      return {
        type: "next_action",
        confidence: 0,
        prediction: null,
        reasoning: "用户历史数据不足",
      }
    }

    const recentActions = userHistory.slice(-10).map((p) => p.action)
    const actionCounts = new Map<string, number>()

    for (const action of recentActions) {
      actionCounts.set(action, (actionCounts.get(action) || 0) + 1)
    }

    const mostCommon = Array.from(actionCounts.entries()).sort((a, b) => b[1] - a[1])[0]

    return {
      type: "next_action",
      confidence: mostCommon[1] / recentActions.length,
      prediction: mostCommon[0],
      reasoning: `用户最近${recentActions.length}次操作中，${mostCommon[1]}次执行了"${mostCommon[0]}"操作`,
    }
  }

  async predictChurnRisk(userId: string): Promise<Prediction> {
    const userHistory = this.usageHistory.filter((p) => p.userId === userId)

    if (userHistory.length === 0) {
      return {
        type: "churn_risk",
        confidence: 0,
        prediction: "unknown",
        reasoning: "无用户数据",
      }
    }

    const now = new Date()
    const lastActivity = userHistory[userHistory.length - 1].timestamp
    const daysSinceLastActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)

    const last30Days = userHistory.filter((p) => (now.getTime() - p.timestamp.getTime()) / (1000 * 60 * 60 * 24) <= 30)

    const activityFrequency = last30Days.length / 30

    let risk = "low"
    let confidence = 0.7

    if (daysSinceLastActivity > 14) {
      risk = "high"
      confidence = 0.9
    } else if (daysSinceLastActivity > 7 || activityFrequency < 0.5) {
      risk = "medium"
      confidence = 0.75
    }

    return {
      type: "churn_risk",
      confidence,
      prediction: risk,
      reasoning: `用户最后活跃于${daysSinceLastActivity.toFixed(0)}天前，最近30天活跃度为${(activityFrequency * 100).toFixed(1)}%`,
    }
  }

  async predictPopularIntegrations(category?: string): Promise<Prediction> {
    const recentUsage = this.usageHistory.filter(
      (p) =>
        p.integrationId &&
        (!category || p.category === category) &&
        Date.now() - p.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000,
    )

    const integrationCounts = new Map<string, number>()

    for (const usage of recentUsage) {
      if (usage.integrationId) {
        integrationCounts.set(usage.integrationId, (integrationCounts.get(usage.integrationId) || 0) + 1)
      }
    }

    const topIntegrations = Array.from(integrationCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, count]) => ({ id, count }))

    return {
      type: "popular_integrations",
      confidence: 0.85,
      prediction: topIntegrations,
      reasoning: `基于最近7天的${recentUsage.length}次使用记录分析${category ? `"${category}"分类` : "所有分类"}的热门应用`,
    }
  }

  async detectAnomalies(userId: string): Promise<Prediction[]> {
    const userHistory = this.usageHistory.filter((p) => p.userId === userId).slice(-100)

    if (userHistory.length < 20) {
      return []
    }

    const anomalies: Prediction[] = []

    const hourCounts = new Map<number, number>()
    for (const usage of userHistory) {
      const hour = usage.timestamp.getHours()
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1)
    }

    const avgCount = Array.from(hourCounts.values()).reduce((a, b) => a + b, 0) / hourCounts.size
    const stdDev = Math.sqrt(
      Array.from(hourCounts.values())
        .map((c) => Math.pow(c - avgCount, 2))
        .reduce((a, b) => a + b, 0) / hourCounts.size,
    )

    for (const [hour, count] of hourCounts.entries()) {
      if (count > avgCount + 2 * stdDev) {
        anomalies.push({
          type: "unusual_activity_time",
          confidence: 0.8,
          prediction: { hour, count },
          reasoning: `用户在${hour}点的活动次数(${count})明显高于平均水平(${avgCount.toFixed(1)})`,
        })
      }
    }

    const recentActions = userHistory.slice(-10).map((p) => p.action)
    const uniqueActions = new Set(recentActions)

    if (uniqueActions.size === 1 && recentActions.length >= 5) {
      anomalies.push({
        type: "repetitive_behavior",
        confidence: 0.75,
        prediction: { action: recentActions[0], count: recentActions.length },
        reasoning: `用户连续${recentActions.length}次执行相同操作"${recentActions[0]}"`,
      })
    }

    return anomalies
  }

  async generateInsights(userId?: string): Promise<string> {
    const history = userId ? this.usageHistory.filter((p) => p.userId === userId) : this.usageHistory

    if (history.length === 0) {
      return "暂无数据可分析"
    }

    const actionCounts = new Map<string, number>()
    const categoryCounts = new Map<string, number>()

    for (const usage of history) {
      actionCounts.set(usage.action, (actionCounts.get(usage.action) || 0) + 1)
      if (usage.category) {
        categoryCounts.set(usage.category, (categoryCounts.get(usage.category) || 0) + 1)
      }
    }

    const topActions = Array.from(actionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    const topCategories = Array.from(categoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    const response = await aiServiceManager.generateResponse({
      messages: [
        {
          role: "user",
          content: `分析以下用户行为数据并生成洞察报告:

总操作次数: ${history.length}
时间范围: ${history.length > 0 ? `${history[0].timestamp.toLocaleDateString()} 至 ${history[history.length - 1].timestamp.toLocaleDateString()}` : "N/A"}

最常见操作:
${topActions.map(([action, count]) => `- ${action}: ${count}次`).join("\n")}

最热门分类:
${topCategories.map(([category, count]) => `- ${category}: ${count}次`).join("\n")}

请生成一份简洁的洞察报告(3-5个要点)，包括用户行为模式、趋势和建议。`,
        },
      ],
      model: "gpt-4o-mini",
      temperature: 0.7,
      maxTokens: 500,
    })

    return response.content
  }
}

export const predictiveAnalytics = new PredictiveAnalytics()
