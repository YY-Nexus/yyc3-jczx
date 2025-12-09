// 分类记忆服务
interface CategoryMemory {
  selectedCategory: string
  selectedSubcategory?: string
  expandedCategories: Record<string, boolean>
  searchQuery: string
  searchHistory: string[]
  lastVisited: number
}

const STORAGE_KEY = "yanyu-category-memory"
const SEARCH_HISTORY_KEY = "yanyu-search-history"
const MAX_SEARCH_HISTORY = 10

export class CategoryMemoryService {
  // 保存分类选择
  static saveSelection(category: string, subcategory?: string, expandedCategories?: Record<string, boolean>): void {
    try {
      const memory: CategoryMemory = {
        selectedCategory: category,
        selectedSubcategory: subcategory,
        expandedCategories: expandedCategories || {},
        searchQuery: "",
        searchHistory: this.getSearchHistory(),
        lastVisited: Date.now(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memory))
    } catch (error) {
      console.warn("无法保存分类选择:", error)
    }
  }

  // 获取分类选择
  static getSelection(): Partial<CategoryMemory> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const memory: CategoryMemory = JSON.parse(stored)
        // 检查是否过期（7天）
        if (Date.now() - memory.lastVisited < 7 * 24 * 60 * 60 * 1000) {
          return memory
        }
      }
    } catch (error) {
      console.warn("无法获取分类选择:", error)
    }
    return {
      selectedCategory: "全部分类",
      selectedSubcategory: undefined,
      expandedCategories: {},
      searchQuery: "",
      searchHistory: [],
    }
  }

  // 保存搜索查询
  static saveSearchQuery(query: string): void {
    try {
      const memory = this.getSelection()
      memory.searchQuery = query
      memory.lastVisited = Date.now()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memory))
    } catch (error) {
      console.warn("无法保存搜索查询:", error)
    }
  }

  // 添加搜索历史
  static addSearchHistory(query: string): void {
    if (!query.trim()) return

    try {
      let history = this.getSearchHistory()
      // 移除重复项
      history = history.filter((item) => item !== query)
      // 添加到开头
      history.unshift(query)
      // 限制数量
      history = history.slice(0, MAX_SEARCH_HISTORY)

      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history))
    } catch (error) {
      console.warn("无法保存搜索历史:", error)
    }
  }

  // 获取搜索历史
  static getSearchHistory(): string[] {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.warn("无法获取搜索历史:", error)
      return []
    }
  }

  // 清除搜索历史
  static clearSearchHistory(): void {
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY)
    } catch (error) {
      console.warn("无法清除搜索历史:", error)
    }
  }

  // 保存展开状态
  static saveExpandedState(expandedCategories: Record<string, boolean>): void {
    try {
      const memory = this.getSelection()
      memory.expandedCategories = expandedCategories
      memory.lastVisited = Date.now()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memory))
    } catch (error) {
      console.warn("无法保存展开状态:", error)
    }
  }

  // 清除所有记忆
  static clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(SEARCH_HISTORY_KEY)
    } catch (error) {
      console.warn("无法清除记忆:", error)
    }
  }
}
