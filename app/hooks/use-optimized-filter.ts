"use client"

import { useMemo, useState, useEffect } from "react"
import type { Integration } from "@/app/data/integrations"

// 防抖Hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// 高级筛选选项
export interface FilterOptions {
  category: string
  subcategory?: string
  searchQuery: string
  priceType?: "free" | "paid" | "freemium"
  rating?: number
  tags?: string[]
  sortBy?: "name" | "rating" | "installCount" | "releaseDate"
  sortOrder?: "asc" | "desc"
  featured?: boolean
  new?: boolean
  popular?: boolean
}

export function useOptimizedFilter(integrations: Integration[], options: FilterOptions) {
  // 防抖搜索查询
  const debouncedSearchQuery = useDebounce(options.searchQuery, 300)

  // 优化的筛选逻辑
  const filteredIntegrations = useMemo(() => {
    let result = [...integrations]

    // 分类筛选
    if (options.category !== "全部分类") {
      result = result.filter((integration) => integration.category === options.category)
    }

    // 子分类筛选
    if (options.subcategory) {
      result = result.filter((integration) => integration.subcategory === options.subcategory)
    }

    // 搜索筛选（使用防抖值）
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase()
      result = result.filter((integration) => {
        return (
          integration.name.toLowerCase().includes(query) ||
          integration.description.toLowerCase().includes(query) ||
          integration.developer.toLowerCase().includes(query) ||
          integration.tags.some((tag) => tag.toLowerCase().includes(query))
        )
      })
    }

    // 价格类型筛选
    if (options.priceType) {
      result = result.filter((integration) => integration.price.type === options.priceType)
    }

    // 评分筛选
    if (options.rating) {
      result = result.filter((integration) => integration.rating >= options.rating!)
    }

    // 标签筛选
    if (options.tags && options.tags.length > 0) {
      result = result.filter((integration) => options.tags!.some((tag) => integration.tags.includes(tag)))
    }

    // 特色筛选
    if (options.featured) {
      result = result.filter((integration) => integration.featured)
    }

    // 新品筛选
    if (options.new) {
      result = result.filter((integration) => integration.new)
    }

    // 热门筛选
    if (options.popular) {
      result = result.filter((integration) => integration.popular)
    }

    // 排序
    if (options.sortBy) {
      result.sort((a, b) => {
        let aValue: any, bValue: any

        switch (options.sortBy) {
          case "name":
            aValue = a.name.toLowerCase()
            bValue = b.name.toLowerCase()
            break
          case "rating":
            aValue = a.rating
            bValue = b.rating
            break
          case "installCount":
            aValue = a.installCount
            bValue = b.installCount
            break
          case "releaseDate":
            aValue = new Date(a.releaseDate).getTime()
            bValue = new Date(b.releaseDate).getTime()
            break
          default:
            return 0
        }

        if (aValue < bValue) return options.sortOrder === "asc" ? -1 : 1
        if (aValue > bValue) return options.sortOrder === "asc" ? 1 : -1
        return 0
      })
    }

    return result
  }, [
    integrations,
    options.category,
    options.subcategory,
    debouncedSearchQuery, // 使用防抖值
    options.priceType,
    options.rating,
    options.tags,
    options.sortBy,
    options.sortOrder,
    options.featured,
    options.new,
    options.popular,
  ])

  // 筛选统计
  const filterStats = useMemo(() => {
    return {
      total: integrations.length,
      filtered: filteredIntegrations.length,
      categories: [...new Set(filteredIntegrations.map((i) => i.category))].length,
      freeCount: filteredIntegrations.filter((i) => i.price.type === "free").length,
      paidCount: filteredIntegrations.filter((i) => i.price.type === "paid").length,
      averageRating: filteredIntegrations.reduce((sum, i) => sum + i.rating, 0) / filteredIntegrations.length || 0,
    }
  }, [integrations, filteredIntegrations])

  return {
    filteredIntegrations,
    filterStats,
    isSearching: options.searchQuery !== debouncedSearchQuery,
  }
}
