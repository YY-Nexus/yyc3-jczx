"use client"

import { useState } from "react"
import { Navbar } from "@/components/ui/navbar"
import { motion } from "framer-motion"
import { Search, Filter, ChevronDown, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { categories, integrations } from "../data/integrations"
import Link from "next/link"
import { IntegrationCard } from "./components/integration-card"
import { FeaturedCarousel } from "./components/featured-carousel"
import { CategoryGrid } from "./components/category-grid"
import { FilterSidebar } from "./components/filter-sidebar"

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // 获取特色集成
  const featuredIntegrations = integrations.filter((integration) => integration.featured).slice(0, 5)

  // 获取新上线的集成
  const newIntegrations = integrations.filter((integration) => integration.new).slice(0, 8)

  // 获取热门集成
  const popularIntegrations = integrations
    .filter((integration) => integration.popular)
    .sort((a, b) => b.installCount - a.installCount)
    .slice(0, 8)

  // 按评分排序的集成
  const topRatedIntegrations = [...integrations]
    .sort((a, b) => b.rating - a.rating)
    .filter((integration) => integration.reviewCount > 50)
    .slice(0, 8)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* 英雄区域 */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                言语云³ 集成应用市场
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl mb-8 text-blue-100"
              >
                发现并连接强大的集成应用，提升您的业务效率
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative max-w-2xl mx-auto"
              >
                <Input
                  type="text"
                  placeholder="搜索集成应用..."
                  className="pl-10 pr-4 py-6 rounded-lg text-gray-900 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => {
                    if (searchQuery.trim()) {
                      window.location.href = `/marketplace/search?q=${encodeURIComponent(searchQuery)}`
                    }
                  }}
                >
                  搜索
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex justify-center mt-4 text-sm"
              >
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center text-blue-100 hover:text-white"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  高级筛选
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* 筛选侧边栏 */}
          {showFilters && <FilterSidebar onClose={() => setShowFilters(false)} />}

          {/* 特色轮播 */}
          <section className="mb-12">
            <FeaturedCarousel integrations={featuredIntegrations} />
          </section>

          {/* 分类导航 */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">浏览分类</h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/marketplace/categories">
                  查看全部
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <CategoryGrid categories={categories.slice(1)} />
          </section>

          {/* 集成列表 */}
          <section>
            <Tabs defaultValue="all" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">集成应用</h2>
                <TabsList>
                  <TabsTrigger value="all">全部</TabsTrigger>
                  <TabsTrigger value="new">新上线</TabsTrigger>
                  <TabsTrigger value="popular">热门</TabsTrigger>
                  <TabsTrigger value="top-rated">高评分</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {activeTab === "all" &&
                integrations
                  .slice(0, 8)
                  .map((integration) => <IntegrationCard key={integration.id} integration={integration} />)}

              {activeTab === "new" &&
                newIntegrations.map((integration) => (
                  <IntegrationCard key={integration.id} integration={integration} />
                ))}

              {activeTab === "popular" &&
                popularIntegrations.map((integration) => (
                  <IntegrationCard key={integration.id} integration={integration} />
                ))}

              {activeTab === "top-rated" &&
                topRatedIntegrations.map((integration) => (
                  <IntegrationCard key={integration.id} integration={integration} />
                ))}
            </div>

            <div className="flex justify-center mt-8">
              <Button asChild size="lg">
                <Link href="/marketplace/browse">
                  浏览更多集成应用
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </section>

          {/* 统计数据 */}
          <section className="mt-16 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{integrations.length}+</div>
                <div className="text-gray-600">可用集成应用</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{categories.length - 1}</div>
                <div className="text-gray-600">应用类别</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {Math.floor(integrations.reduce((sum, integration) => sum + integration.installCount, 0) / 1000)}
                  K+
                </div>
                <div className="text-gray-600">总安装次数</div>
              </div>
            </div>
          </section>
        </div>
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
  )
}
