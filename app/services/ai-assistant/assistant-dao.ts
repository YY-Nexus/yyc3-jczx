import { db } from "../database"
import {
  mockUserDao,
  mockAiModelDao,
  mockConversationDao,
  mockMessageDao,
  mockUserPreferenceDao,
  mockApiKeyDao,
  mockUsageStatisticsDao,
} from "./mock-data"

// 用户类型
export type User = {
  id: number
  email: string
  name: string
  created_at: Date
  updated_at: Date
}

// AI模型类型
export type AiModel = {
  id: number
  name: string
  provider: string
  model_id: string
  description: string | null
  is_active: boolean
  created_at: Date
  updated_at: Date
}

// 对话会话类型
export type Conversation = {
  id: number
  user_id: number
  title: string
  model_id: number | null
  system_prompt: string | null
  is_pinned: boolean
  created_at: Date
  updated_at: Date
}

// 消息类型
export type Message = {
  id: number
  conversation_id: number
  role: "user" | "assistant" | "system"
  content: string
  tokens_used: number | null
  created_at: Date
}

// 用户偏好设置类型
export type UserPreference = {
  user_id: number
  default_model_id: number | null
  default_system_prompt: string | null
  temperature: number
  max_tokens: number
  theme: string
  language: string
  created_at: Date
  updated_at: Date
}

// 检查数据库是否可用
function isDatabaseAvailable(): boolean {
  return !!process.env.DATABASE_URL && typeof db !== "undefined"
}

// 用户数据访问对象
export const userDao = {
  // 创建用户
  async createUser(email: string, name: string): Promise<User> {
    if (!isDatabaseAvailable()) {
      return mockUserDao.createUser(email, name)
    }

    try {
      const result = await db.query.raw<User[]>(
        `
        INSERT INTO users (email, name)
        VALUES ($1, $2)
        RETURNING *
      `,
        [email, name],
      )

      return result[0]
    } catch (error) {
      console.warn("数据库不可用，使用模拟数据:", error)
      return mockUserDao.createUser(email, name)
    }
  },

  // 根据ID获取用户
  async getUserById(id: number): Promise<User | null> {
    if (!isDatabaseAvailable()) {
      return mockUserDao.getUserById(id)
    }

    try {
      const result = await db.query.raw<User[]>(
        `
        SELECT * FROM users WHERE id = $1
      `,
        [id],
      )

      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.warn("数据库不可用，使用模拟数据:", error)
      return mockUserDao.getUserById(id)
    }
  },

  // 根据邮箱获取用户
  async getUserByEmail(email: string): Promise<User | null> {
    if (!isDatabaseAvailable()) {
      return mockUserDao.getUserByEmail(email)
    }

    try {
      const result = await db.query.raw<User[]>(
        `
        SELECT * FROM users WHERE email = $1
      `,
        [email],
      )

      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.warn("数据库不可用，使用模拟数据:", error)
      return mockUserDao.getUserByEmail(email)
    }
  },
}

// AI模型数据访问对象
export const aiModelDao = {
  // 创建AI模型
  async createModel(model: Omit<AiModel, "id" | "created_at" | "updated_at">): Promise<AiModel> {
    if (!isDatabaseAvailable()) {
      return mockAiModelDao.createModel(model)
    }

    try {
      const result = await db.query.raw<AiModel[]>(
        `
        INSERT INTO ai_models (name, provider, model_id, description, is_active)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
        [model.name, model.provider, model.model_id, model.description, model.is_active],
      )

      return result[0]
    } catch (error) {
      console.warn("数据库不可用，使用模拟数据:", error)
      return mockAiModelDao.createModel(model)
    }
  },

  // 获取所有活跃的AI模型
  async getActiveModels(): Promise<AiModel[]> {
    if (!isDatabaseAvailable()) {
      return mockAiModelDao.getActiveModels()
    }

    try {
      return await db.query.raw<AiModel[]>(`
        SELECT * FROM ai_models WHERE is_active = true
        ORDER BY provider, name
      `)
    } catch (error) {
      console.warn("数据库不可用，使用模拟数据:", error)
      return mockAiModelDao.getActiveModels()
    }
  },

  // 根据ID获取AI模型
  async getModelById(id: number): Promise<AiModel | null> {
    if (!isDatabaseAvailable()) {
      return mockAiModelDao.getModelById(id)
    }

    try {
      const result = await db.query.raw<AiModel[]>(
        `
        SELECT * FROM ai_models WHERE id = $1
      `,
        [id],
      )

      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.warn("数据库不可用，使用模拟数据:", error)
      return mockAiModelDao.getModelById(id)
    }
  },
}

// 对话会话数据访问对象
export const conversationDao = {
  // 创建对话会话
  async createConversation(
    conversation: Omit<Conversation, "id" | "created_at" | "updated_at">,
  ): Promise<Conversation> {
    if (!isDatabaseAvailable()) {
      return mockConversationDao.createConversation(conversation)
    }

    try {
      const result = await db.query.raw<Conversation[]>(
        `
        INSERT INTO conversations (user_id, title, model_id, system_prompt, is_pinned)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
        [
          conversation.user_id,
          conversation.title,
          conversation.model_id,
          conversation.system_prompt,
          conversation.is_pinned,
        ],
      )

      return result[0]
    } catch (error) {
      console.warn("数据库不可用，使用模拟数据:", error)
      return mockConversationDao.createConversation(conversation)
    }
  },

  // 获取用户的所有对话会话
  async getUserConversations(userId: number): Promise<Conversation[]> {
    if (!isDatabaseAvailable()) {
      return mockConversationDao.getUserConversations(userId)
    }

    try {
      return await db.query.raw<Conversation[]>(
        `
        SELECT * FROM conversations 
        WHERE user_id = $1
        ORDER BY is_pinned DESC, updated_at DESC
      `,
        [userId],
      )
    } catch (error) {
      console.warn("数据库不可用，使用模拟数据:", error)
      return mockConversationDao.getUserConversations(userId)
    }
  },

  // 根据ID获取对话会话
  async getConversationById(id: number): Promise<Conversation | null> {
    if (!isDatabaseAvailable()) {
      return mockConversationDao.getConversationById(id)
    }

    try {
      const result = await db.query.raw<Conversation[]>(
        `
        SELECT * FROM conversations WHERE id = $1
      `,
        [id],
      )

      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.warn("数据库不可用，使用模拟数据:", error)
      return mockConversationDao.getConversationById(id)
    }
  },

  // 更新对话会话
  async updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation> {
    if (!isDatabaseAvailable()) {
      return mockConversationDao.updateConversation(id, updates)
    }

    try {
      const setClause = Object.entries(updates)
        .filter(([key]) => !["id", "user_id", "created_at"].includes(key))
        .map(([key], index) => `${key} = $${index + 2}`)
        .join(", ")

      const values = [
        id,
        ...Object.entries(updates)
          .filter(([key]) => !["id", "user_id", "created_at"].includes(key))
          .map(([_, value]) => value),
      ]

      const query = `
        UPDATE conversations 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `

      const result = await db.query.raw<Conversation[]>(query, values)
      return result[0]
    } catch (error) {
      console.warn("数据库不可用，使用模拟数据:", error)
      return mockConversationDao.updateConversation(id, updates)
    }
  },

  // 删除对话会话
  async deleteConversation(id: number): Promise<boolean> {
    if (!isDatabaseAvailable()) {
      return mockConversationDao.deleteConversation(id)
    }

    try {
      await db.query.raw(
        `
        DELETE FROM conversations WHERE id = $1
      `,
        [id],
      )

      return true
    } catch (error) {
      console.warn("数据库不可用，使用模拟数据:", error)
      return mockConversationDao.deleteConversation(id)
    }
  },
}

// 消息数据访问对象
export const messageDao = {
  // 创建消息
  async createMessage(message: Omit<Message, "id" | "created_at">): Promise<Message> {
    if (!isDatabaseAvailable()) {
      return mockMessageDao.createMessage(message)
    }

    try {
      const result = await db.query.raw<Message[]>(
        `
        INSERT INTO messages (conversation_id, role, content, tokens_used)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
        [message.conversation_id, message.role, message.content, message.tokens_used],
      )

      // 更新对话会话的更新时间
      await db.query.raw(
        `
        UPDATE conversations
        SET updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `,
        [message.conversation_id],
      )

      return result[0]
    } catch (error) {
      console.warn("数据库不可用，使用模拟数据:", error)
      return mockMessageDao.createMessage(message)
    }
  },

  // 获取对话会话的所有消息
  async getConversationMessages(conversationId: number): Promise<Message[]> {
    if (!isDatabaseAvailable()) {
      return mockMessageDao.getConversationMessages(conversationId)
    }

    try {
      return await db.query.raw<Message[]>(
        `
        SELECT * FROM messages
        WHERE conversation_id = $1
        ORDER BY created_at ASC
      `,
        [conversationId],
      )
    } catch (error) {
      console.warn("数据库不可用，使用模拟数据:", error)
      return mockMessageDao.getConversationMessages(conversationId)
    }
  },
}

// 用户偏好设置数据访问对象
export const userPreferenceDao = {
  // 获取用户偏好设置
  async getUserPreference(userId: number): Promise<UserPreference | null> {
    if (!isDatabaseAvailable()) {
      return mockUserPreferenceDao.getUserPreference(userId)
    }

    try {
      const result = await db.query.raw<UserPreference[]>(
        `
        SELECT * FROM user_preferences WHERE user_id = $1
      `,
        [userId],
      )

      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.warn("数据库不可用，使用模拟数据:", error)
      return mockUserPreferenceDao.getUserPreference(userId)
    }
  },

  // 创建或更新用户偏好设置
  async upsertUserPreference(preference: Partial<UserPreference> & { user_id: number }): Promise<UserPreference> {
    if (!isDatabaseAvailable()) {
      return mockUserPreferenceDao.upsertUserPreference(preference)
    }

    try {
      // 检查是否存在
      const existing = await userPreferenceDao.getUserPreference(preference.user_id)

      if (existing) {
        // 更新现有记录
        const setClause = Object.entries(preference)
          .filter(([key]) => key !== "user_id" && key !== "created_at")
          .map(([key], index) => `${key} = $${index + 2}`)
          .join(", ")

        const values = [
          preference.user_id,
          ...Object.entries(preference)
            .filter(([key]) => key !== "user_id" && key !== "created_at")
            .map(([_, value]) => value),
        ]

        const query = `
          UPDATE user_preferences 
          SET ${setClause}, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = $1
          RETURNING *
        `

        const result = await db.query.raw<UserPreference[]>(query, values)
        return result[0]
      } else {
        // 创建新记录
        const keys = Object.keys(preference)
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ")
        const columns = keys.join(", ")
        const values = Object.values(preference)

        const query = `
          INSERT INTO user_preferences (${columns})
          VALUES (${placeholders})
          RETURNING *
        `

        const result = await db.query.raw<UserPreference[]>(query, values)
        return result[0]
      }
    } catch (error) {
      console.warn("数据库不可用，使用模拟数据:", error)
      return mockUserPreferenceDao.upsertUserPreference(preference)
    }
  },
}

// API密钥数据访问对象
export const apiKeyDao = {
  // 获取用户的API密钥
  async getUserApiKeys(userId: number): Promise<any[]> {
    if (!isDatabaseAvailable()) {
      return mockApiKeyDao.getUserApiKeys(userId)
    }

    try {
      return await db.query.raw(
        `
        SELECT id, provider, is_active, created_at, updated_at
        FROM api_keys
        WHERE user_id = $1
      `,
        [userId],
      )
    } catch (error) {
      console.warn("数据库不可用，使用模拟数据:", error)
      return mockApiKeyDao.getUserApiKeys(userId)
    }
  },

  // 保存API密钥
  async saveApiKey(userId: number, provider: string, apiKey: string): Promise<boolean> {
    if (!isDatabaseAvailable()) {
      return mockApiKeyDao.saveApiKey(userId, provider, apiKey)
    }

    try {
      // 检查是否已存在
      const existing = await db.query.raw(
        `
        SELECT id FROM api_keys
        WHERE user_id = $1 AND provider = $2
      `,
        [userId, provider],
      )

      if (existing.length > 0) {
        // 更新现有记录
        await db.query.raw(
          `
          UPDATE api_keys
          SET api_key = $3, is_active = true, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = $1 AND provider = $2
        `,
          [userId, provider, apiKey],
        )
      } else {
        // 创建新记录
        await db.query.raw(
          `
          INSERT INTO api_keys (user_id, provider, api_key)
          VALUES ($1, $2, $3)
        `,
          [userId, provider, apiKey],
        )
      }

      return true
    } catch (error) {
      console.warn("数据库不可用，使用模拟数据:", error)
      return mockApiKeyDao.saveApiKey(userId, provider, apiKey)
    }
  },

  // 获取API密钥
  async getApiKey(userId: number, provider: string): Promise<string | null> {
    if (!isDatabaseAvailable()) {
      return mockApiKeyDao.getApiKey(userId, provider)
    }

    try {
      const result = await db.query.raw(
        `
        SELECT api_key
        FROM api_keys
        WHERE user_id = $1 AND provider = $2 AND is_active = true
      `,
        [userId, provider],
      )

      return result.length > 0 ? result[0].api_key : null
    } catch (error) {
      console.warn("数据库不可用，使用模拟数据:", error)
      return mockApiKeyDao.getApiKey(userId, provider)
    }
  },
}

// 使用统计数据访问对象
export const usageStatisticsDao = {
  // 记录使用情况
  async recordUsage(userId: number, modelId: number, tokensUsed: number): Promise<void> {
    if (!isDatabaseAvailable()) {
      return mockUsageStatisticsDao.recordUsage(userId, modelId, tokensUsed)
    }

    try {
      // 检查今天是否已有记录
      const today = new Date().toISOString().split("T")[0]
      const existing = await db.query.raw(
        `
        SELECT id, tokens_used, request_count
        FROM usage_statistics
        WHERE user_id = $1 AND model_id = $2 AND date = $3
      `,
        [userId, modelId, today],
      )

      if (existing.length > 0) {
        // 更新现有记录
        await db.query.raw(
          `
          UPDATE usage_statistics
          SET tokens_used = tokens_used + $4,
              request_count = request_count + 1,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $5
        `,
          [userId, modelId, today, tokensUsed, existing[0].id],
        )
      } else {
        // 创建新记录
        await db.query.raw(
          `
          INSERT INTO usage_statistics (user_id, model_id, tokens_used, date)
          VALUES ($1, $2, $3, $4)
        `,
          [userId, modelId, tokensUsed, today],
        )
      }
    } catch (error) {
      console.warn("数据库不可用，使用模拟数据:", error)
      return mockUsageStatisticsDao.recordUsage(userId, modelId, tokensUsed)
    }
  },

  // 获取用户使用统计
  async getUserUsageStats(userId: number, startDate?: string, endDate?: string): Promise<any[]> {
    if (!isDatabaseAvailable()) {
      return mockUsageStatisticsDao.getUserUsageStats(userId, startDate, endDate)
    }

    try {
      let query = `
        SELECT 
          us.date,
          us.tokens_used,
          us.request_count,
          am.name as model_name,
          am.provider
        FROM usage_statistics us
        JOIN ai_models am ON us.model_id = am.id
        WHERE us.user_id = $1
      `

      const params = [userId]
      let paramIndex = 2

      if (startDate) {
        query += ` AND us.date >= $${paramIndex}`
        params.push(startDate)
        paramIndex++
      }

      if (endDate) {
        query += ` AND us.date <= $${paramIndex}`
        params.push(endDate)
      }

      query += ` ORDER BY us.date DESC`

      return await db.query.raw(query, params)
    } catch (error) {
      console.warn("数据库不可用，使用模拟数据:", error)
      return mockUsageStatisticsDao.getUserUsageStats(userId, startDate, endDate)
    }
  },
}
