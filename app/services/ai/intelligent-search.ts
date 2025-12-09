import { aiServiceManager } from "./ai-service-manager"
import { integrations, type Integration } from "@/app/data/integrations"

export interface SearchQuery {
  query: string
  filters?: {
    category?: string
    type?: string
    minRating?: number
  }
  limit?: number
  useSemanticSearch?: boolean
}

export interface SearchResult {
  integration: Integration
  score: number
  relevance: string
  highlights: string[]
}

export class IntelligentSearch {
  private embeddingsCache: Map<string, number[]> = new Map()

  async search(searchQuery: SearchQuery): Promise<SearchResult[]> {
    let results: SearchResult[] = []

    if (searchQuery.useSemanticSearch) {
      results = await this.semanticSearch(searchQuery)
    } else {
      results = await this.keywordSearch(searchQuery)
    }

    if (searchQuery.filters) {
      results = this.applyFilters(results, searchQuery.filters)
    }

    return results.slice(0, searchQuery.limit || 20)
  }

  private async keywordSearch(searchQuery: SearchQuery): Promise<SearchResult[]> {
    const query = searchQuery.query.toLowerCase()
    const results: SearchResult[] = []

    for (const integration of integrations) {
      let score = 0
      const highlights: string[] = []

      if (integration.name.toLowerCase().includes(query)) {
        score += 10
        highlights.push(`名称匹配: ${integration.name}`)
      }

      if (integration.description.toLowerCase().includes(query)) {
        score += 5
        highlights.push(`描述匹配`)
      }

      if (integration.tags.some((tag) => tag.toLowerCase().includes(query))) {
        score += 3
        highlights.push(`标签匹配`)
      }

      if (integration.category.toLowerCase().includes(query)) {
        score += 2
        highlights.push(`分类匹配`)
      }

      if (score > 0) {
        results.push({
          integration,
          score,
          relevance: this.getRelevanceLabel(score),
          highlights,
        })
      }
    }

    return results.sort((a, b) => b.score - a.score)
  }

  private async semanticSearch(searchQuery: SearchQuery): Promise<SearchResult[]> {
    const queryEmbedding = await this.getEmbedding(searchQuery.query)
    const results: SearchResult[] = []

    for (const integration of integrations) {
      const integrationText = `${integration.name} ${integration.description} ${integration.tags.join(" ")}`
      const integrationEmbedding = await this.getEmbedding(integrationText)

      const similarity = this.cosineSimilarity(queryEmbedding, integrationEmbedding)
      const score = similarity * 100

      if (score > 20) {
        results.push({
          integration,
          score,
          relevance: this.getRelevanceLabel(score),
          highlights: [`语义相似度: ${score.toFixed(1)}%`],
        })
      }
    }

    return results.sort((a, b) => b.score - a.score)
  }

  private async getEmbedding(text: string): Promise<number[]> {
    if (this.embeddingsCache.has(text)) {
      return this.embeddingsCache.get(text)!
    }

    const embedding = await aiServiceManager.generateEmbedding(text)
    this.embeddingsCache.set(text, embedding)
    return embedding
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  private applyFilters(results: SearchResult[], filters: SearchQuery["filters"]): SearchResult[] {
    return results.filter((result) => {
      if (filters?.category && result.integration.category !== filters.category) {
        return false
      }

      if (filters?.type && result.integration.type !== filters.type) {
        return false
      }

      if (filters?.minRating && result.integration.rating < filters.minRating) {
        return false
      }

      return true
    })
  }

  private getRelevanceLabel(score: number): string {
    if (score >= 80) return "高度相关"
    if (score >= 50) return "相关"
    if (score >= 20) return "可能相关"
    return "低相关"
  }

  async suggestQuery(partialQuery: string): Promise<string[]> {
    if (partialQuery.length < 2) return []

    const response = await aiServiceManager.generateResponse({
      messages: [
        {
          role: "user",
          content: `基于用户输入"${partialQuery}"，生成5个相关的搜索建议。只返回建议列表，每行一个，不要编号或其他格式。`,
        },
      ],
      model: "gpt-4o-mini",
      temperature: 0.7,
      maxTokens: 200,
    })

    return response.content
      .split("\n")
      .filter((s) => s.trim())
      .slice(0, 5)
  }
}

export const intelligentSearch = new IntelligentSearch()
