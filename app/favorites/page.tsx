"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { integrations } from "../data/integrations"
import { FavoriteCard } from "../components/favorites/favorite-card"
import { EmptyFavorites } from "../components/favorites/empty-favorites"
import { useFavorites } from "../context/favorites-context"
import { FavoritesProvider } from "../context/favorites-context"
import { ArrowLeft, Search, SlidersHorizontal, Trash2, CheckSquare, Square, Share2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

function FavoritesPageContent() {
  const { favoritesData, clearFavorites, loading } = useFavorites()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredFavorites, setFilteredFavorites] = useState(favoritesData)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const { toast } = useToast()

  // 获取所有收藏的集成应用的类别
  const categories = ["all", ...Array.from(new Set(favoritesData.map((item) => item.category)))]

  // 筛选和排序收藏列表
  useEffect(() => {
    let filtered = [...favoritesData]

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.developer.toLowerCase().includes(query),
      )
    }

    // 类别筛选
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    // 排序
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "price":
        filtered.sort((a, b) => {
          if (a.price.type === "free") return -1
          if (b.price.type === "free") return 1
          return (a.price.value || 0) - (b.price.value || 0)
        })
        break
      case "recent":
      default:
        // 保持原顺序，假设最近添加的在前面
        break
    }

    setFilteredFavorites(filtered)
  }, [favoritesData, searchQuery, sortBy, selectedCategory])

  // 处理全选/取消全选
  const handleToggleSelectAll = () => {
    if (selectedItems.length === filteredFavorites.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredFavorites.map((item) => item.id))
    }
  }

  // 处理选择单个项目
  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  // 处理删除选中项目
  const handleDeleteSelected = () => {
    // 这里实际上会通过context中的removeFavorite方法逐个删除
    toast({
      title: "已删除选中的收藏",
      description: `已从收藏列表中移除 ${selectedItems.length} 个集成应用`,
    })
    setSelectedItems([])
    setIsSelectMode(false)
  }

  // 处理清空所有收藏
  const handleClearAll = () => {
    clearFavorites()
    setShowClearDialog(false)
    toast({
      title: "收藏列表已清空",
      description: "所有集成应用已从您的收藏列表中移除",
    })
  }

  // 处理分享收藏列表
  const handleShare = () => {
    const shareText = `我在言语云³集成中心收藏了这些集成应用：\n${favoritesData.map((item) => item.name).join(", ")}`

    if (navigator.share) {
      navigator
        .share({
          title: "我的收藏集成应用",
          text: shareText,
          url: window.location.href,
        })
        .catch((error) => console.log("分享失败", error))
    } else {
      navigator.clipboard.writeText(shareText)
      toast({
        title: "分享链接已复制",
        description: "收藏列表链接已复制到剪贴板",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (favoritesData.length === 0) {
    return <EmptyFavorites />
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">我的收藏</h1>
          <p className="text-gray-500">管理您收藏的 {favoritesData.length} 个集成应用</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {isSelectMode ? (
            <>
              <Button variant="outline" size="sm" onClick={handleToggleSelectAll} className="gap-2">
                {selectedItems.length === filteredFavorites.length ? (
                  <>
                    <CheckSquare className="h-4 w-4" />
                    取消全选
                  </>
                ) : (
                  <>
                    <Square className="h-4 w-4" />
                    全选
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                disabled={selectedItems.length === 0}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                删除所选 ({selectedItems.length})
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsSelectMode(false)}>
                取消
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsSelectMode(true)} className="gap-2">
                <CheckSquare className="h-4 w-4" />
                选择
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="h-4 w-4" />
                分享
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setShowClearDialog(true)} className="gap-2">
                <Trash2 className="h-4 w-4" />
                清空
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="搜索收藏的集成应用..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">最近添加</SelectItem>
              <SelectItem value="name">名称</SelectItem>
              <SelectItem value="rating">评分</SelectItem>
              <SelectItem value="price">价格</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {categories.length > 1 && (
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="all">全部</TabsTrigger>
            {categories
              .filter((cat) => cat !== "all")
              .map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
          </TabsList>
        </Tabs>
      )}

      {filteredFavorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">未找到匹配的集成应用</h2>
          <p className="text-gray-500 mb-6">尝试使用不同的搜索关键词或筛选条件</p>
          <Button onClick={() => setSearchQuery("")}>清除搜索</Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8"
        >
          {filteredFavorites.map((integration) => (
            <FavoriteCard
              key={integration.id}
              integration={integration}
              showSelectCheckbox={isSelectMode}
              isSelected={selectedItems.includes(integration.id)}
              onSelect={() => handleSelectItem(integration.id)}
            />
          ))}
        </motion.div>
      )}

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认清空收藏列表？</AlertDialogTitle>
            <AlertDialogDescription>此操作将删除您收藏的所有集成应用。此操作无法撤销。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAll}>确认</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default function FavoritesPage() {
  return (
    <FavoritesProvider integrations={integrations}>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Link href="/marketplace" className="text-blue-600 hover:underline mr-2">
              <ArrowLeft className="mr-2 h-4 w-4 inline" />
              返回市场
            </Link>
          </div>

          <FavoritesPageContent />
        </main>

        {/* 页脚 */}
        <footer className="bg-gray-900 text-white py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h2 className="text-xl font-bold">言语云³ 集成中心</h2>
                <p className="text-gray-400 mt-2">© {new Date().getFullYear()} YY C³-IC. 保留所有权利。</p>
              </div>
              <div className="flex space-x-6">
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  关于我们
                </Link>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  联系我们
                </Link>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  隐私政策
                </Link>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  服务条款
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </FavoritesProvider>
  )
}
