import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { google } from "@ai-sdk/google"
import { generateText, streamText, embed } from "ai"

export interface AIModel {
  id: string
  name: string
  provider: "openai" | "anthropic" | "google" | "local"
  modelId: string
  maxTokens: number
  costPer1kTokens: number
  capabilities: string[]
  isAvailable: boolean
}

export interface AIRequest {
  messages: Array<{ role: string; content: string }>
  model?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  stream?: boolean
}

export interface AIResponse {
  content: string
  model: string
  tokensUsed: number
  cost: number
  cached: boolean
}

export interface CacheEntry {
  key: string
  response: string
  timestamp: number
  hits: number
}

export class AIServiceManager {
  private models: Map<string, AIModel> = new Map()
  private cache: Map<string, CacheEntry> = new Map()
  private readonly CACHE_TTL = 3600000
  private readonly MAX_CACHE_SIZE = 1000

  constructor() {
    this.initializeModels()
  }

  private initializeModels() {
    const models: AIModel[] = [
      {
        id: "gpt-4o",
        name: "GPT-4 Optimized",
        provider: "openai",
        modelId: "gpt-4o",
        maxTokens: 128000,
        costPer1kTokens: 0.005,
        capabilities: ["chat", "analysis", "code", "reasoning"],
        isAvailable: true,
      },
      {
        id: "gpt-4o-mini",
        name: "GPT-4 Mini",
        provider: "openai",
        modelId: "gpt-4o-mini",
        maxTokens: 128000,
        costPer1kTokens: 0.00015,
        capabilities: ["chat", "analysis", "fast"],
        isAvailable: true,
      },
      {
        id: "claude-3-5-sonnet",
        name: "Claude 3.5 Sonnet",
        provider: "anthropic",
        modelId: "claude-3-5-sonnet-20241022",
        maxTokens: 200000,
        costPer1kTokens: 0.003,
        capabilities: ["chat", "analysis", "code", "reasoning", "long-context"],
        isAvailable: true,
      },
      {
        id: "gemini-2.0-flash",
        name: "Gemini 2.0 Flash",
        provider: "google",
        modelId: "gemini-2.0-flash-exp",
        maxTokens: 1000000,
        costPer1kTokens: 0.0001,
        capabilities: ["chat", "analysis", "multimodal", "fast"],
        isAvailable: true,
      },
    ]

    models.forEach((model) => this.models.set(model.id, model))
  }

  getAvailableModels(): AIModel[] {
    return Array.from(this.models.values()).filter((m) => m.isAvailable)
  }

  getModel(modelId: string): AIModel | undefined {
    return this.models.get(modelId)
  }

  selectBestModel(requirements: {
    capability?: string
    maxCost?: number
    minTokens?: number
    preferSpeed?: boolean
  }): AIModel {
    let candidates = this.getAvailableModels()

    if (requirements.capability) {
      candidates = candidates.filter((m) => m.capabilities.includes(requirements.capability!))
    }

    if (requirements.maxCost) {
      candidates = candidates.filter((m) => m.costPer1kTokens <= requirements.maxCost!)
    }

    if (requirements.minTokens) {
      candidates = candidates.filter((m) => m.maxTokens >= requirements.minTokens!)
    }

    if (requirements.preferSpeed) {
      candidates.sort((a, b) => {
        const aSpeed = a.capabilities.includes("fast") ? 1 : 0
        const bSpeed = b.capabilities.includes("fast") ? 1 : 0
        return bSpeed - aSpeed
      })
    } else {
      candidates.sort((a, b) => a.costPer1kTokens - b.costPer1kTokens)
    }

    return candidates[0] || this.models.get("gpt-4o-mini")!
  }

  private generateCacheKey(request: AIRequest): string {
    const normalized = {
      messages: request.messages.map((m) => ({ role: m.role, content: m.content.trim() })),
      model: request.model || "default",
      temperature: request.temperature || 0.7,
    }
    return JSON.stringify(normalized)
  }

  private getCachedResponse(key: string): string | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() - entry.timestamp > this.CACHE_TTL) {
      this.cache.delete(key)
      return null
    }

    entry.hits++
    return entry.response
  }

  private setCachedResponse(key: string, response: string) {
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = Array.from(this.cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0]
      this.cache.delete(oldestKey)
    }

    this.cache.set(key, {
      key,
      response,
      timestamp: Date.now(),
      hits: 0,
    })
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const cacheKey = this.generateCacheKey(request)
    const cached = this.getCachedResponse(cacheKey)

    if (cached) {
      return {
        content: cached,
        model: request.model || "cached",
        tokensUsed: 0,
        cost: 0,
        cached: true,
      }
    }

    const modelId = request.model || "gpt-4o-mini"
    const model = this.getModel(modelId)

    if (!model) {
      throw new Error(`Model not found: ${modelId}`)
    }

    const messages = request.systemPrompt
      ? [{ role: "system", content: request.systemPrompt }, ...request.messages]
      : request.messages

    let aiModel
    switch (model.provider) {
      case "openai":
        aiModel = openai(model.modelId)
        break
      case "anthropic":
        aiModel = anthropic(model.modelId)
        break
      case "google":
        aiModel = google(model.modelId)
        break
      default:
        throw new Error(`Unsupported provider: ${model.provider}`)
    }

    const result = await generateText({
      model: aiModel,
      messages: messages as any,
      temperature: request.temperature || 0.7,
      maxTokens: request.maxTokens || 2000,
    })

    const tokensUsed = result.usage?.totalTokens || 0
    const cost = (tokensUsed / 1000) * model.costPer1kTokens

    this.setCachedResponse(cacheKey, result.text)

    return {
      content: result.text,
      model: modelId,
      tokensUsed,
      cost,
      cached: false,
    }
  }

  async streamResponse(request: AIRequest) {
    const modelId = request.model || "gpt-4o-mini"
    const model = this.getModel(modelId)

    if (!model) {
      throw new Error(`Model not found: ${modelId}`)
    }

    const messages = request.systemPrompt
      ? [{ role: "system", content: request.systemPrompt }, ...request.messages]
      : request.messages

    let aiModel
    switch (model.provider) {
      case "openai":
        aiModel = openai(model.modelId)
        break
      case "anthropic":
        aiModel = anthropic(model.modelId)
        break
      case "google":
        aiModel = google(model.modelId)
        break
      default:
        throw new Error(`Unsupported provider: ${model.provider}`)
    }

    return streamText({
      model: aiModel,
      messages: messages as any,
      temperature: request.temperature || 0.7,
      maxTokens: request.maxTokens || 2000,
    })
  }

  async generateEmbedding(text: string, model = "text-embedding-3-small"): Promise<number[]> {
    const result = await embed({
      model: openai.embedding(model),
      value: text,
    })

    return result.embedding
  }

  getCacheStats() {
    const entries = Array.from(this.cache.values())
    return {
      size: this.cache.size,
      totalHits: entries.reduce((sum, e) => sum + e.hits, 0),
      avgHits: entries.length > 0 ? entries.reduce((sum, e) => sum + e.hits, 0) / entries.length : 0,
      oldestEntry: entries.length > 0 ? Math.min(...entries.map((e) => e.timestamp)) : null,
    }
  }

  clearCache() {
    this.cache.clear()
  }
}

export const aiServiceManager = new AIServiceManager()
