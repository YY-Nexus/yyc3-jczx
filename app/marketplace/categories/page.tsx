"use client"

import type React from "react"

import { Navbar } from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { categories, subcategories, integrations } from "@/app/data/integrations"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  BarChart,
  Mail,
  ShoppingCart,
  Users,
  CreditCard,
  MessageSquare,
  Cloud,
  Shield,
  Palette,
  Code,
  UserCheck,
  HeadphonesIcon,
  ShoppingBag,
  Share2,
  ArrowRight,
} from "lucide-react"

export default function CategoriesPage() {
  // 为每个类别分配图标
  const categoryIcons: Record<string, React.ReactNode> = {
    数据分析: <BarChart className="w-8 h-8 text-blue-600" />,
    营销推广: <Mail className="w-8 h-8 text-green-600" />,
    效率工具: <ShoppingCart className="w-8 h-8 text-purple-600" />,
    销售管理: <Users className="w-8 h-8 text-red-600" />,
    财务管理: <CreditCard className="w-8 h-8 text-yellow-600" />,
    通信工具: <MessageSquare className="w-8 h-8 text-pink-600" />,
    云端服务: <Cloud className="w-8 h-8 text-cyan-600" />,
    安全防护: <Shield className="w-8 h-8 text-orange-600" />,
    设计创意: <Palette className="w-8 h-8 text-indigo-600" />,
    开发工具: <Code className="w-8 h-8 text-gray-600" />,
    人力资源: <UserCheck className="w-8 h-8 text-teal-600" />,
    客户支持: <HeadphonesIcon className="w-8 h-8 text-amber-600" />,
    电子商务: <ShoppingBag className="w-8 h-8 text-lime-600" />,
    社交媒体: <Share2 className="w-8 h-8 text-rose-600" />,
  }

  // 计算每个类别的集成应用数量
  const categoryCount: Record<string, number> = {}
  categories.slice(1).forEach((category) => {
    categoryCount[category] = integrations.filter((integration) => integration.category === category).length
  })

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/marketplace" className="text-blue-600 hover:underline mr-2">
            市场首页
          </Link>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-600">分类</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">浏览分类</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(1).map((category) => (
            <motion.div
              key={category}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href={`/marketplace/category/${encodeURIComponent(category)}`}>
                <Card className="h-full hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                        {categoryIcons[category] || <BarChart className="w-8 h-8 text-gray-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold mb-2">{category}</h3>
                          <span className="text-sm text-gray-500">{categoryCount[category]}个应用</span>
                        </div>
                        <div className="space-y-1">
                          {subcategories[category as keyof typeof subcategories]?.slice(0, 3).map((sub) => (
                            <div key={sub} className="text-sm text-gray-600">
                              • {sub}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="ghost" size="sm" className="text-blue-600 p-0 h-auto">
                            查看全部
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
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
