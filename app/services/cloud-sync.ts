// 修改云同步服务，添加加密支持

import type { User } from "../context/auth-context"

export type SyncStatus = "idle" | "syncing" | "success" | "error" | "conflict"

export type SyncOptions = {
  autoSync: boolean
  syncInterval: number // 分钟
  syncOnStartup: boolean
  syncOnChange: boolean
  conflictResolution: "local" | "remote" | "manual"
}

export type SyncStats = {
  lastSyncTime: string | null
  totalSyncs: number
  failedSyncs: number
  itemsSynced: number
}

// 默认同步选项
export const defaultSyncOptions: SyncOptions = {
  autoSync: true,
  syncInterval: 30, // 30分钟
  syncOnStartup: true,
  syncOnChange: true,
  conflictResolution: "manual",
}

// 模拟云端API调用，支持加密数据
export async function fetchCloudFavorites(userId: string): Promise<string[]> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))

  // 从localStorage获取云端数据（在实际应用中，这将是API调用）
  const cloudData = localStorage.getItem(`cloud_favorites_${userId}`)
  return cloudData ? JSON.parse(cloudData) : []
}

// 模拟将数据保存到云端，支持加密数据
export async function saveToCloud(userId: string, favorites: string[]): Promise<boolean> {
  // 模拟网络延迟和可能的失败
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))

  // 随机模拟失败（10%几率）
  if (Math.random() < 0.1) {
    throw new Error("Network error")
  }

  // 保存到localStorage（在实际应用中，这将是API调用）
  localStorage.setItem(`cloud_favorites_${userId}`, JSON.stringify(favorites))
  return true
}

// 获取用户的同步选项
export function getUserSyncOptions(userId: string): SyncOptions {
  try {
    const options = localStorage.getItem(`sync_options_${userId}`)
    return options ? JSON.parse(options) : defaultSyncOptions
  } catch (error) {
    console.error("Error loading sync options:", error)
    return defaultSyncOptions
  }
}

// 保存用户的同步选项
export function saveUserSyncOptions(userId: string, options: SyncOptions): void {
  localStorage.setItem(`sync_options_${userId}`, JSON.stringify(options))
}

// 获取同步统计信息
export function getSyncStats(userId: string): SyncStats {
  try {
    const stats = localStorage.getItem(`sync_stats_${userId}`)
    return stats
      ? JSON.parse(stats)
      : {
          lastSyncTime: null,
          totalSyncs: 0,
          failedSyncs: 0,
          itemsSynced: 0,
        }
  } catch (error) {
    console.error("Error loading sync stats:", error)
    return {
      lastSyncTime: null,
      totalSyncs: 0,
      failedSyncs: 0,
      itemsSynced: 0,
    }
  }
}

// 更新同步统计信息
export function updateSyncStats(userId: string, update: Partial<SyncStats>): void {
  const currentStats = getSyncStats(userId)
  const newStats = { ...currentStats, ...update }
  localStorage.setItem(`sync_stats_${userId}`, JSON.stringify(newStats))
}

// 模拟解决冲突
export function resolveConflicts(
  localFavorites: string[],
  cloudFavorites: string[],
  strategy: "local" | "remote" | "merge" = "merge",
): string[] {
  switch (strategy) {
    case "local":
      return localFavorites
    case "remote":
      return cloudFavorites
    case "merge":
    default:
      // 合并两个列表，去除重复项
      return Array.from(new Set([...localFavorites, ...cloudFavorites]))
  }
}

// 检查是否有冲突
export function hasConflicts(localFavorites: string[], cloudFavorites: string[]): boolean {
  // 简单检查：如果两个列表长度不同，且都不是对方的子集，则认为有冲突
  const localSet = new Set(localFavorites)
  const cloudSet = new Set(cloudFavorites)

  if (localSet.size === cloudSet.size) {
    // 检查内容是否相同
    return !localFavorites.every((id) => cloudSet.has(id))
  }

  // 检查是否一个是另一个的子集
  if (localSet.size < cloudSet.size) {
    return !localFavorites.every((id) => cloudSet.has(id))
  } else {
    return !cloudFavorites.every((id) => localSet.has(id))
  }
}

// 更新用户最后同步时间
export function updateLastSyncTime(user: User): User {
  const updatedUser = {
    ...user,
    lastSyncTime: new Date().toISOString(),
  }
  localStorage.setItem("user", JSON.stringify(updatedUser))
  return updatedUser
}

// 保存加密的云端数据
export async function saveEncryptedToCloud(userId: string, encryptedData: string): Promise<boolean> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))

  // 随机模拟失败（10%几率）
  if (Math.random() < 0.1) {
    throw new Error("Network error")
  }

  // 保存加密数据
  localStorage.setItem(`encrypted_cloud_favorites_${userId}`, encryptedData)

  // 标记数据为已加密
  localStorage.setItem(`cloud_favorites_encrypted_${userId}`, "true")

  return true
}

// 获取加密的云端数据
export async function fetchEncryptedCloudData(userId: string): Promise<string | null> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))

  // 检查数据是否已加密
  const isEncrypted = localStorage.getItem(`cloud_favorites_encrypted_${userId}`) === "true"

  if (isEncrypted) {
    // 获取加密数据
    return localStorage.getItem(`encrypted_cloud_favorites_${userId}`)
  } else {
    // 数据未加密，返回null
    return null
  }
}

// 检查云端数据是否已加密
export function isCloudDataEncrypted(userId: string): boolean {
  return localStorage.getItem(`cloud_favorites_encrypted_${userId}`) === "true"
}
