// 分类热度计算和趋势分析服务

import { integrations } from "../data/integrations"

// 热度级别定义
export type HeatLevel = "极热" | "热门" | "活跃" | "稳定" | "冷门"

// 趋势方向
export type TrendDirection = "上升" | "平稳" | "下降"

// 分类热度信息
export interface CategoryHeat {
  category: string
  heatScore: number
  heatLevel: HeatLevel
  trend: TrendDirection
  growthRate: number // 百分比
  installCount: number
  avgRating: number
  updateFrequency: number // 平均更新间隔（天）
}

// 计算分类热度
export function calculateCategoryHeat(category: string): CategoryHeat {
  // 获取该分类下的所有集成
  const categoryIntegrations = integrations.filter((integration) => integration.category === category)

  if (categoryIntegrations.length === 0) {
    return {
      category,
      heatScore: 0,
      heatLevel: "冷门",
      trend: "平稳",
      growthRate: 0,
      installCount: 0,
      avgRating: 0,
      updateFrequency: 0,
    }
  }

  // 计算总安装量
  const totalInstalls = categoryIntegrations.reduce((sum, integration) => sum + integration.installCount, 0)

  // 计算平均评分
  const avgRating =
    categoryIntegrations.reduce((sum, integration) => sum + integration.rating, 0) / categoryIntegrations.length

  // 计算平均更新频率（模拟数据）
  const now = new Date()
  const avgUpdateDays =
    categoryIntegrations.reduce((sum, integration) => {
      const lastUpdate = new Date(integration.lastUpdate)
      const daysSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24))
      return sum + daysSinceUpdate
    }, 0) / categoryIntegrations.length

  // 计算新集成比例（30天内）
  const newIntegrations = categoryIntegrations.filter((integration) => integration.new).length
  const newRatio = newIntegrations / categoryIntegrations.length

  // 计算热度分数 (0-100)
  // 权重: 安装量 40%, 评分 25%, 更新频率 20%, 新集成比例 15%
  const installScore = Math.min(totalInstalls / 1000, 100) * 0.4
  const ratingScore = ((avgRating - 3) / 2) * 100 * 0.25 // 3-5分映射到0-100
  const updateScore = Math.max(0, (90 - avgUpdateDays) / 90) * 100 * 0.2 // 更新越近分数越高
  const newRatioScore = newRatio * 100 * 0.15

  const heatScore = installScore + ratingScore + updateScore + newRatioScore

  // 确定热度级别
  let heatLevel: HeatLevel
  if (heatScore >= 80) heatLevel = "极热"
  else if (heatScore >= 60) heatLevel = "热门"
  else if (heatScore >= 40) heatLevel = "活跃"
  else if (heatScore >= 20) heatLevel = "稳定"
  else heatLevel = "冷门"

  // 模拟趋势方向和增长率
  // 在实际应用中，这应该基于历史数据计算
  let trend: TrendDirection
  let growthRate: number

  // 使用伪随机但确定性的方法基于分类名生成趋势
  const hash = category.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const randomValue = (hash % 100) / 100

  if (randomValue > 0.7) {
    trend = "上升"
    growthRate = 5 + Math.floor(randomValue * 20) // 5-25%
  } else if (randomValue > 0.3) {
    trend = "平稳"
    growthRate = -2 + Math.floor(randomValue * 4) // -2-2%
  } else {
    trend = "下降"
    growthRate = -15 + Math.floor(randomValue * 10) // -15--5%
  }

  // 热门分类更可能上升
  if (heatLevel === "极热" || heatLevel === "热门") {
    if (trend === "下降") {
      trend = "平稳"
      growthRate = Math.abs(growthRate) / 2
    }
  }

  return {
    category,
    heatScore,
    heatLevel,
    trend,
    growthRate,
    installCount: totalInstalls,
    avgRating,
    updateFrequency: avgUpdateDays,
  }
}

// 获取所有分类的热度信息
export function getAllCategoryHeat(categories: string[]): CategoryHeat[] {
  // 排除"全部分类"
  const filteredCategories = categories.filter((category) => category !== "全部分类")
  return filteredCategories.map((category) => calculateCategoryHeat(category))
}

// 获取热门分类（前N个）
export function getHotCategories(categories: string[], limit = 5): CategoryHeat[] {
  const allHeat = getAllCategoryHeat(categories)
  return allHeat.sort((a, b) => b.heatScore - a.heatScore).slice(0, limit)
}

// 获取上升最快的分类
export function getTrendingCategories(categories: string[], limit = 5): CategoryHeat[] {
  const allHeat = getAllCategoryHeat(categories)
  return allHeat
    .filter((heat) => heat.trend === "上升")
    .sort((a, b) => b.growthRate - a.growthRate)
    .slice(0, limit)
}
