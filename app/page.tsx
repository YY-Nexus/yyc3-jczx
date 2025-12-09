"use client"

import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/ui/navbar"
import { motion } from "framer-motion"
import { ArrowRight, Zap, Shield, Globe, Database, Cpu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { AssistantPanel } from "./components/ai-assistant/assistant-panel"
import { BackgroundPattern } from "./components/ui/background-pattern"
import { PageTransition } from "./components/ui/page-transition"
import { Card3D } from "./components/ui/3d-card"
import type { Integration } from "./types"
import type { JSX } from "react/jsx-runtime"

interface FeatureItem {
  icon: JSX.Element
  title: string
  description: string
  gradient: string
  bgGradient: string
}

const integrations: Omit<
  Integration,
  | "tags"
  | "pricing"
  | "developer"
  | "lastUpdated"
  | "version"
  | "compatibility"
  | "verified"
  | "featured"
  | "rating"
  | "reviews"
  | "installs"
>[] = [
  {
    id: "slack",
    name: "Slack聊天",
    description: "连接Slack以简化团队沟通并自动化工作流程。",
    category: "通信协作",
    icon: Zap,
    color: "#E01E5A",
  },
  {
    id: "google-sheets",
    name: "谷歌表格",
    description: "集成谷歌表格进行实时数据分析和报告生成。",
    category: "数据分析",
    icon: Database,
    color: "#34A853",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "同步Salesforce数据以增强客户关系管理能力。",
    category: "客户管理",
    icon: Shield,
    color: "#00A1E0",
  },
  {
    id: "aws",
    name: "亚马逊云服务",
    description: "连接到亚马逊云服务获取云计算和存储解决方案。",
    category: "云服务",
    icon: Cpu,
    color: "#FF9900",
  },
  {
    id: "github",
    name: "GitHub代码库",
    description: "集成GitHub实现无缝代码管理和团队协作。",
    category: "开发工具",
    icon: Globe,
    color: "#24292E",
  },
  {
    id: "zoom",
    name: "Zoom视频会议",
    description: "连接Zoom进行视频会议和在线会议。",
    category: "通信协作",
    icon: Zap,
    color: "#2D8CFF",
  },
  {
    id: "stripe",
    name: "Stripe支付",
    description: "集成Stripe实现安全在线支付和财务管理。",
    category: "财务工具",
    icon: Shield,
    color: "#6772E5",
  },
  {
    id: "jira",
    name: "Jira项目管理",
    description: "连接Jira进行项目跟踪和问题解决。",
    category: "项目管理",
    icon: Database,
    color: "#0052CC",
  },
]

const features: FeatureItem[] = [
  {
    icon: <Zap className="h-10 w-10 text-orange-500" />,
    title: "快速集成",
    description: "一键连接各类应用，无需复杂配置",
    gradient: "from-orange-500 to-amber-500",
    bgGradient: "from-orange-50 via-amber-50 to-white",
  },
  {
    icon: <Shield className="h-10 w-10 text-green-500" />,
    title: "安全可靠",
    description: "企业级安全保障，数据传输加密处理",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 via-emerald-50 to-white",
  },
  {
    icon: <Globe className="h-10 w-10 text-blue-500" />,
    title: "全球连接",
    description: "支持全球各地区服务，无缝跨境协作",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 via-cyan-50 to-white",
  },
  {
    icon: <Database className="h-10 w-10 text-purple-500" />,
    title: "数据同步",
    description: "实时数据同步，确保信息一致性",
    gradient: "from-purple-500 to-fuchsia-500",
    bgGradient: "from-purple-50 via-fuchsia-50 to-white",
  },
]

export default function HomePage() {
  const [showChat, setShowChat] = useState(false)

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        {/* 英雄区域 */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-background">
          <BackgroundPattern variant="gradient" />
          <div className="container relative mx-auto px-4 text-center z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <motion.h1 className="text-4xl md:text-6xl font-bold mb-6 relative inline-block">
                <motion.span
                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                  style={{ backgroundSize: "200% auto" }}
                >
                  YanYuCloud³ Integration Center
                </motion.span>
              </motion.h1>
              <motion.div
                className="absolute -inset-1 rounded-lg blur-xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-0"
                animate={{ opacity: [0, 0.7, 0] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              />
              <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-muted-foreground">
                万象归元于云枢丨深栈智启新纪元
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Link href="/integrations">
                    浏览集成
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 bg-transparent"
                  onClick={() => setShowChat(!showChat)}
                >
                  {showChat ? "隐藏助手" : "智能助手"}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* AI 助手 */}
        {showChat && <AssistantPanel onClose={() => setShowChat(false)} />}

        {/* 特色区域 */}
        <section className="py-16 bg-background relative">
          <BackgroundPattern variant="dots" />
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              核心功能
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card3D backgroundGradient={feature.bgGradient} className="h-full">
                    <div className="flex flex-col items-center text-center h-full">
                      <div className={`mb-4 p-3 rounded-full bg-gradient-to-br ${feature.bgGradient}`}>
                        {feature.icon}
                      </div>
                      <h3
                        className={`text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${feature.gradient}`}
                      >
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </Card3D>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 集成引擎 */}
        <section className="py-16 bg-muted/50 relative">
          <BackgroundPattern variant="waves" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                集成引擎
              </h2>
              <Button asChild variant="outline">
                <Link href="/integrations">
                  查看全部
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {integrations.slice(0, 8).map((integration, index) => {
                const Icon = integration.icon
                return (
                  <motion.div
                    key={integration.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Card3D className="h-full">
                      <div className="flex flex-col items-center text-center space-y-2 h-full">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 shadow-md"
                          style={{ backgroundColor: `${integration.color}20` }}
                        >
                          <Icon
                            className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                            style={{ color: integration.color }}
                          />
                        </div>
                        <h3 className="font-semibold text-sm">{integration.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {integration.category}
                        </span>
                        <p className="text-xs text-muted-foreground flex-grow overflow-hidden">
                          {integration.description.length > 100
                            ? `${integration.description.substring(0, 100)}...`
                            : integration.description}
                        </p>
                      </div>
                    </Card3D>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 页脚 */}
        <footer className="bg-gradient-to-r from-gray-900 via-indigo-950 to-purple-900 text-white py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  YanYuCloud³ Integration Center
                </h2>
                <p className="text-gray-400 mt-2">© YanYu Cloud³ {new Date().getFullYear()}. 保留所有权利。</p>
              </div>
              <div className="flex space-x-6">
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  关于我们
                </Link>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  联系我们
                </Link>
                <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                  隐私政策
                </Link>
                <Link href="/terms" className="hover:text-blue-400 transition-colors">
                  服务条款
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  )
}
