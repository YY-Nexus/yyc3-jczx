"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { Integration } from "../data/integrations"
import { useAuth } from "./auth-context"
import { useEncryption } from "./encryption-context"
import { useToast } from "@/hooks/use-toast"
import {
  fetchCloudFavorites,
  saveToCloud,
  getUserSyncOptions,
  updateSyncStats,
  resolveConflicts,
  hasConflicts,
  updateLastSyncTime,
  saveEncryptedToCloud,
  type SyncStatus,
  type SyncOptions,
} from "../services/cloud-sync"

type FavoritesContextType = {
  favorites: string[]
  favoritesData: Integration[]
  addFavorite: (id: string) => void
  removeFavorite: (id: string) => void
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  clearFavorites: () => void
  loading: boolean
  syncStatus: SyncStatus
  lastSyncTime: string | null
  syncWithCloud: () => Promise<boolean>
  syncOptions: SyncOptions
  updateSyncOptions: (options: Partial<SyncOptions>) => void
  hasPendingChanges: boolean
  isEncrypted: boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}

interface FavoritesProviderProps {
  children: ReactNode
  integrations: Integration[]
}

export function FavoritesProvider({ children, integrations }: FavoritesProviderProps) {
  const { user, isAuthenticated } = useAuth()
  const { encryptionStatus, encryptionSettings, encrypt, decrypt } = useEncryption()
  const { toast } = useToast()
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle")
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)
  const [syncOptions, setSyncOptions] = useState<SyncOptions>({
    autoSync: true,
    syncInterval: 30,
    syncOnStartup: true,
    syncOnChange: true,
    conflictResolution: "manual",
  })
  const [hasPendingChanges, setHasPendingChanges] = useState(false)
  const [lastSavedFavorites, setLastSavedFavorites] = useState<string[]>([])
  const [isEncrypted, setIsEncrypted] = useState(false)

  // 从localStorage加载收藏数据
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        // 如果用户已登录，尝试加载本地数据
        const storageKey = isAuthenticated ? `favorites_${user?.id}` : "favorites"
        const storedFavorites = localStorage.getItem(storageKey)

        if (storedFavorites) {
          let parsedFavorites = JSON.parse(storedFavorites)

          // 检查数据是否已加密
          const isDataEncrypted = localStorage.getItem(`favorites_encrypted_${user?.id}`) === "true"
          setIsEncrypted(isDataEncrypted)

          // 如果数据已加密且加密已启用，尝试解密
          if (isDataEncrypted && encryptionStatus === "enabled" && encryptionSettings.enabled) {
            try {
              // 解密数据
              const decryptedData = await decrypt(parsedFavorites)
              parsedFavorites = JSON.parse(decryptedData)
            } catch (error) {
              console.error("解密收藏数据失败:", error)
              // 如果解密失败，使用空数组
              parsedFavorites = []
            }
          }

          setFavorites(parsedFavorites)
          setLastSavedFavorites(parsedFavorites)
        }

        // 如果用户已登录，加载同步选项
        if (isAuthenticated && user) {
          const options = getUserSyncOptions(user.id)
          setSyncOptions(options)
          setLastSyncTime(user.lastSyncTime || null)
        }
      } catch (error) {
        console.error("Error loading favorites from localStorage:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [isAuthenticated, user, encryptionStatus, encryptionSettings, decrypt])

  // 当用户登录状态改变时，同步数据
  useEffect(() => {
    if (isAuthenticated && user && syncOptions.syncOnStartup) {
      syncWithCloud()
    }
  }, [isAuthenticated, user]) // eslint-disable-line react-hooks/exhaustive-deps

  // 自动同步定时器
  useEffect(() => {
    if (!isAuthenticated || !user || !syncOptions.autoSync) return

    const syncIntervalMs = syncOptions.syncInterval * 60 * 1000
    const timer = setInterval(() => {
      if (hasPendingChanges) {
        syncWithCloud()
      }
    }, syncIntervalMs)

    return () => clearInterval(timer)
  }, [isAuthenticated, user, syncOptions.autoSync, syncOptions.syncInterval, hasPendingChanges]) // eslint-disable-line react-hooks/exhaustive-deps

  // 保存收藏数据到localStorage
  useEffect(() => {
    if (!loading) {
      saveFavoritesToLocalStorage()
    }
  }, [favorites, loading]) // eslint-disable-line react-hooks/exhaustive-deps

  // 保存收藏数据到localStorage，支持加密
  const saveFavoritesToLocalStorage = useCallback(async () => {
    if (!isAuthenticated || !user) {
      // 未登录，保存到普通localStorage
      localStorage.setItem("favorites", JSON.stringify(favorites))
      return
    }

    try {
      let dataToSave = JSON.stringify(favorites)

      // 如果加密已启用，加密数据
      if (encryptionStatus === "enabled" && encryptionSettings.enabled) {
        dataToSave = await encrypt(dataToSave)
        localStorage.setItem(`favorites_encrypted_${user.id}`, "true")
        setIsEncrypted(true)
      } else {
        localStorage.setItem(`favorites_encrypted_${user.id}`, "false")
        setIsEncrypted(false)
      }

      // 保存数据
      localStorage.setItem(`favorites_${user.id}`, dataToSave)

      // 检查是否有未同步的更改
      const hasChanges = JSON.stringify(favorites) !== JSON.stringify(lastSavedFavorites)
      setHasPendingChanges(hasChanges)

      // 如果启用了变更同步且有更改，则自动同步
      if (syncOptions.syncOnChange && hasChanges) {
        syncWithCloud()
      }
    } catch (error) {
      console.error("保存收藏数据失败:", error)
      toast({
        title: "保存失败",
        description: "无法保存收藏数据",
        variant: "destructive",
      })
    }
  }, [
    favorites,
    isAuthenticated,
    user,
    encryptionStatus,
    encryptionSettings,
    encrypt,
    lastSavedFavorites,
    syncOptions,
    toast,
  ])

  // 同步到云端，支持加密
  const syncWithCloud = useCallback(async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "同步失败",
        description: "请先登录以使用云同步功能",
        variant: "destructive",
      })
      return false
    }

    try {
      setSyncStatus("syncing")

      // 检查是否启用了加密
      const shouldEncrypt = encryptionStatus === "enabled" && encryptionSettings.enabled

      if (shouldEncrypt) {
        // 加密同步流程
        try {
          // 加密收藏数据
          const favoritesJson = JSON.stringify(favorites)
          const encryptedData = await encrypt(favoritesJson)

          // 保存加密数据到云端
          await saveEncryptedToCloud(user.id, encryptedData)

          // 更新同步状态
          const now = new Date().toISOString()
          setLastSyncTime(now)
          setLastSavedFavorites([...favorites])
          setHasPendingChanges(false)
          setSyncStatus("success")

          // 更新统计信息
          updateSyncStats(user.id, {
            lastSyncTime: now,
            totalSyncs: getSyncStats().totalSyncs + 1,
            itemsSynced: favorites.length,
          })

          // 更新用户最后同步时间
          updateLastSyncTime(user)

          toast({
            title: "同步成功",
            description: "您的收藏已成功加密并同步到云端",
          })

          return true
        } catch (error) {
          console.error("加密同步失败:", error)
          setSyncStatus("error")

          toast({
            title: "同步失败",
            description: "加密同步失败，请稍后重试",
            variant: "destructive",
          })

          return false
        }
      } else {
        // 非加密同步流程
        // 获取云端数据
        const cloudFavorites = await fetchCloudFavorites(user.id)

        // 检查是否有冲突
        if (hasConflicts(favorites, cloudFavorites)) {
          if (syncOptions.conflictResolution === "manual") {
            setSyncStatus("conflict")
            toast({
              title: "发现冲突",
              description: "本地数据与云端数据存在冲突，请手动解决",
            })
            return false
          }

          // 自动解决冲突
          const resolvedFavorites = resolveConflicts(
            favorites,
            cloudFavorites,
            syncOptions.conflictResolution === "remote" ? "remote" : "local",
          )

          setFavorites(resolvedFavorites)
          await saveToCloud(user.id, resolvedFavorites)
        } else {
          // 无冲突，直接保存
          await saveToCloud(user.id, favorites)
        }

        // 更新同步状态
        const now = new Date().toISOString()
        setLastSyncTime(now)
        setLastSavedFavorites([...favorites])
        setHasPendingChanges(false)
        setSyncStatus("success")

        // 更新统计信息
        updateSyncStats(user.id, {
          lastSyncTime: now,
          totalSyncs: getSyncStats().totalSyncs + 1,
          itemsSynced: favorites.length,
        })

        // 更新用户最后同步时间
        updateLastSyncTime(user)

        toast({
          title: "同步成功",
          description: "您的收藏已成功同步到云端",
        })

        return true
      }
    } catch (error) {
      console.error("Sync error:", error)
      setSyncStatus("error")

      // 更新统计信息
      updateSyncStats(user.id, {
        failedSyncs: getSyncStats().failedSyncs + 1,
      })

      toast({
        title: "同步失败",
        description: "无法同步到云端，请稍后重试",
        variant: "destructive",
      })

      return false
    }
  }, [isAuthenticated, user, favorites, syncOptions, encryptionStatus, encryptionSettings, encrypt, toast])

  // 获取同步统计信息
  const getSyncStats = useCallback(() => {
    if (!isAuthenticated || !user) {
      return { totalSyncs: 0, failedSyncs: 0, itemsSynced: 0, lastSyncTime: null }
    }

    try {
      const statsStr = localStorage.getItem(`sync_stats_${user.id}`)
      return statsStr ? JSON.parse(statsStr) : { totalSyncs: 0, failedSyncs: 0, itemsSynced: 0, lastSyncTime: null }
    } catch (error) {
      console.error("Error loading sync stats:", error)
      return { totalSyncs: 0, failedSyncs: 0, itemsSynced: 0, lastSyncTime: null }
    }
  }, [isAuthenticated, user])

  // 更新同步选项
  const updateSyncOptions = useCallback(
    (options: Partial<SyncOptions>) => {
      if (!isAuthenticated || !user) return

      const newOptions = { ...syncOptions, ...options }
      setSyncOptions(newOptions)

      try {
        localStorage.setItem(`sync_options_${user.id}`, JSON.stringify(newOptions))
      } catch (error) {
        console.error("Error saving sync options:", error)
      }
    },
    [isAuthenticated, user, syncOptions],
  )

  // 获取收藏的集成应用数据
  const favoritesData = integrations.filter((integration) => favorites.includes(integration.id))

  // 添加收藏
  const addFavorite = (id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) return prev
      return [...prev, id]
    })
  }

  // 移除收藏
  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((favId) => favId !== id))
  }

  // 切换收藏状态
  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      removeFavorite(id)
    } else {
      addFavorite(id)
    }
  }

  // 检查是否已收藏
  const isFavorite = (id: string) => favorites.includes(id)

  // 清空所有收藏
  const clearFavorites = () => {
    setFavorites([])
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesData,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        loading,
        syncStatus,
        lastSyncTime,
        syncWithCloud,
        syncOptions,
        updateSyncOptions,
        hasPendingChanges,
        isEncrypted,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}
