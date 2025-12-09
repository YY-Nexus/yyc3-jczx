import type React from "react"
/**
 * 全局类型定义文件
 * 统一管理项目中的所有类型定义
 */

// ==================== 用户相关类型 ====================
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  lastSyncTime?: string
  createdAt?: string
}

export interface StoredUser extends User {
  password: string
}

// ==================== 集成相关类型 ====================
export interface Integration {
  id: string
  name: string
  description: string
  category: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  rating: number
  reviews: number
  installs: number
  verified: boolean
  featured: boolean
  tags: string[]
  pricing: "free" | "paid" | "freemium"
  developer: string
  lastUpdated: string
  version: string
  compatibility: string[]
}

// ==================== AI助手相关类型 ====================
export interface Message {
  id: number
  conversation_id: number
  role: "user" | "assistant" | "system"
  content: string
  tokens_used: number | null
  created_at: string | Date
}

export interface Conversation {
  id: number
  user_id: number
  title: string
  model_id: number | null
  system_prompt: string | null
  is_pinned: boolean
  created_at: string | Date
  updated_at: string | Date
}

export interface AiModel {
  id: number
  name: string
  provider: string
  model_id: string
  description: string | null
  is_active: boolean
  created_at: string | Date
  updated_at: string | Date
}

export interface UserPreference {
  user_id: number
  default_model_id: number | null
  default_system_prompt: string | null
  temperature: number
  max_tokens: number
  theme: string
  language: string
  created_at: string | Date
  updated_at: string | Date
}

export interface UsageStat {
  date: string
  tokens_used: number
  request_count: number
  model_name: string
  provider: string
}

// ==================== 加密相关类型 ====================
export type EncryptionStatus = "enabled" | "disabled" | "initializing" | "error"

export interface EncryptionSettings {
  enabled: boolean
  autoEncrypt: boolean
  passwordHint?: string
}

export interface KeyPackage {
  salt: string
  encryptedValidationToken: string
}

// ==================== 同步相关类型 ====================
export interface SyncOptions {
  autoSync: boolean
  syncInterval: number
  syncOnChange: boolean
  conflictResolution: "local" | "remote" | "manual"
}

export interface SyncStats {
  lastSyncTime: string | null
  totalSyncs: number
  successfulSyncs: number
  failedSyncs: number
}

// ==================== 订阅相关类型 ====================
export interface Subscription {
  id: string
  integrationId: string
  integrationName: string
  frequency: "daily" | "weekly" | "monthly"
  enabled: boolean
  lastNotification?: string
  createdAt: string
}

export interface SubscriptionSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  notificationTime: string
}

// ==================== 版本相关类型 ====================
export interface VersionInfo {
  current: string
  latest: string
  hasUpdate: boolean
  releaseNotes?: string
  releaseDate?: string
}

export interface VersionCheckSettings {
  autoCheck: boolean
  checkFrequency: "daily" | "weekly" | "monthly"
  notifyOnUpdate: boolean
}

// ==================== 错误处理类型 ====================
export interface ErrorLog {
  id: string
  timestamp: string
  level: "error" | "warning" | "info"
  message: string
  stack?: string
  context?: Record<string, unknown>
  userId?: string
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
  status: number
}

// ==================== 表单相关类型 ====================
export interface FormData {
  [key: string]: string | number | boolean | undefined
}

export interface ValidationError {
  field: string
  message: string
}

// ==================== 通用工具类型 ====================
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type AsyncFunction<T = void> = () => Promise<T>
export type EventHandler<T = void> = (event: T) => void
