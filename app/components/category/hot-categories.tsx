"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { categories } from "@/app/data/integrations"
import { getHotCategories, getTrendingCategories, type CategoryHeat } from "@/app/services/category-trends"
import CategoryHeatBadge from "./category-heat-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import CategorySubscribeButton from "./category-subscribe-button"

export default function HotCategories() {
  const [hotCategories, setHotCategories] = useState<CategoryHeat[]>([])
  const [trendingCategories, setTrendingCategories] = useState<CategoryHeat[]>([])
  const [activeTab, setActiveTab] = useState("hot")
  const router = useRouter()

  useEffect(() => {
    // 获取热门分类
    const hot = getHotCategories(categories, 5)
    setHotCategories(hot)

    // 获取上升趋势分类
    const trending = getTrendingCategories(categories, 5)
    setTrendingCategories(trending)
  }, [])

  const handleCategoryClick = (category: string) => {
    router.push(`/integrations?category=${encodeURIComponent(category)}`)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>分类热度指标</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="hot" className="flex-1">
              热门分类
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex-1">
              上升趋势
            </TabsTrigger>
          </TabsList>
          <TabsContent value="hot">
            <div className="space-y-3">
              {hotCategories.map((category) => (
                <div
                  key={category.category}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <CategoryHeatBadge
                      heatLevel={category.heatLevel}
                      trend={category.trend}
                      growthRate={category.growthRate}
                      showTrend={false}
                    />
                    <button
                      className="text-sm font-medium hover:underline"
                      onClick={() => handleCategoryClick(category.category)}
                    >
                      {category.category}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{category.installCount.toLocaleString()} 安装</span>
                    <CategorySubscribeButton categoryName={category.category} size="sm" showText={false} />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="trending">
            <div className="space-y-3">
              {trendingCategories.map((category) => (
                <div
                  key={category.category}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <CategoryHeatBadge
                      heatLevel={category.heatLevel}
                      trend={category.trend}
                      growthRate={category.growthRate}
                    />
                    <button
                      className="text-sm font-medium hover:underline"
                      onClick={() => handleCategoryClick(category.category)}
                    >
                      {category.category}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">+{category.growthRate}% 增长</span>
                    <CategorySubscribeButton categoryName={category.category} size="sm" showText={false} />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
