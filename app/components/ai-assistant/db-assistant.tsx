"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import {
  Bot,
  User,
  Trash2,
  Plus,
  MessageSquare,
  Edit,
  Copy,
  Loader2,
  BarChart,
  Key,
  Save,
  Pin,
  PinOff,
} from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import ReactMarkdown from "react-markdown"

// 类型定义
type Message = {
  id: number
  conversation_id: number
  role: "user" | "assistant" | "system"
  content: string
  tokens_used: number | null
  created_at: string | Date
}

type Conversation = {
  id: number
  user_id: number
  title: string
  model_id: number | null
  system_prompt: string | null
  is_pinned: boolean
  created_at: string | Date
  updated_at: string | Date
}

type AiModel = {
  id: number
  name: string
  provider: string
  model_id: string
  description: string | null
  is_active: boolean
  created_at: string | Date
  updated_at: string | Date
}

type UserPreference = {
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

type UsageStat = {
  date: string
  tokens_used: number
  request_count: number
  model_name: string
  provider: string
}

// 消息组件
function AssistantMessageItem({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const createdAt = typeof message.created_at === "string" ? new Date(message.created_at) : message.created_at

  return (
    <div
      className={`flex gap-3 p-4 rounded-lg group ${
        message.role === "user" ? "bg-blue-50 ml-8" : message.role === "system" ? "bg-gray-100" : "bg-gray-50 mr-8"
      }`}
    >
      <div className="flex-shrink-0">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            message.role === "user" ? "bg-blue-100" : message.role === "system" ? "bg-gray-300" : "bg-gray-200"
          }`}
        >
          {message.role === "user" ? (
            <User className="w-4 h-4 text-blue-600" />
          ) : (
            <Bot className="w-4 h-4 text-gray-600" />
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="text-xs text-gray-500 mb-1">
            {format(createdAt, "yyyy年MM月dd日 HH:mm", { locale: zhCN })}
            {message.tokens_used && <span className="ml-2 text-xs text-gray-400">{message.tokens_used} tokens</span>}
          </div>
          {message.role !== "system" && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyToClipboard}>
                {copied ? (
                  <Badge variant="outline" className="text-xs">
                    已复制
                  </Badge>
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          )}
        </div>
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

// 会话列表项组件
function ConversationListItem({
  conversation,
  isActive,
  onClick,
  onDelete,
  onRename,
  onTogglePin,
}: {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
  onDelete: () => void
  onRename: (newTitle: string) => void
  onTogglePin: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(conversation.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleRename = () => {
    if (title.trim()) {
      onRename(title)
      setIsEditing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename()
    } else if (e.key === "Escape") {
      setTitle(conversation.title)
      setIsEditing(false)
    }
  }

  return (
    <div
      className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
        isActive ? "bg-blue-50 border-l-4 border-blue-500" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center flex-1 min-w-0">
        <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm border rounded px-1 py-0.5"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="flex items-center flex-1 truncate text-sm">
            {conversation.is_pinned && <Pin className="h-3 w-3 mr-1 text-blue-500" />}
            {conversation.title}
          </div>
        )}
      </div>
      <div className="flex space-x-1">
        {!isEditing && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                onTogglePin()
              }}
              title={conversation.is_pinned ? "取消置顶" : "置顶对话"}
            >
              {conversation.is_pinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(true)
              }}
              title="重命名"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          title="删除对话"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

// 设置对话框组件
function AssistantSettings({
  models,
  preferences,
  onSavePreferences,
  onSaveApiKey,
}: {
  models: AiModel[]
  preferences: UserPreference | null
  onSavePreferences: (preferences: Partial<UserPreference>) => Promise<void>
  onSaveApiKey: (provider: string, apiKey: string) => Promise<void>
}) {
  const [activeTab, setActiveTab] = useState("general")
  const [localPreferences, setLocalPreferences] = useState<Partial<UserPreference>>(preferences || {})
  const [apiKeys, setApiKeys] = useState({
    openai: "",
    anthropic: "",
    gemini: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences)
    }
  }, [preferences])

  const handlePreferenceChange = (key: string, value: any) => {
    setLocalPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const handleApiKeyChange = (provider: string, value: string) => {
    setApiKeys((prev) => ({ ...prev, [provider]: value }))
  }

  const handleSavePreferences = async () => {
    setIsSaving(true)
    try {
      await onSavePreferences(localPreferences)
      toast({
        title: "设置已保存",
        description: "您的偏好设置已成功保存。",
      })
    } catch (error) {
      toast({
        title: "保存设置失败",
        description: error instanceof Error ? error.message : "发生未知错误",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveApiKey = async (provider: string) => {
    const apiKey = apiKeys[provider as keyof typeof apiKeys]
    if (!apiKey) return

    setIsSaving(true)
    try {
      await onSaveApiKey(provider, apiKey)
      toast({
        title: "API密钥已保存",
        description: `${provider.toUpperCase()} API密钥已成功保存。`,
      })
      // 清空输入框
      setApiKeys((prev) => ({ ...prev, [provider]: "" }))
    } catch (error) {
      toast({
        title: "保存API密钥失败",
        description: error instanceof Error ? error.message : "发生未知错误",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="general">常规设置</TabsTrigger>
        <TabsTrigger value="api-keys">API密钥</TabsTrigger>
        <TabsTrigger value="advanced">高级设置</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="default_model_id">默认AI模型</Label>
          <Select
            value={localPreferences.default_model_id?.toString() || ""}
            onValueChange={(value) => handlePreferenceChange("default_model_id", Number.parseInt(value))}
          >
            <SelectTrigger id="default_model_id">
              <SelectValue placeholder="选择默认AI模型" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id.toString()}>
                  {model.name} ({model.provider})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="default_system_prompt">默认系统提示词</Label>
          <Textarea
            id="default_system_prompt"
            value={localPreferences.default_system_prompt || ""}
            onChange={(e) => handlePreferenceChange("default_system_prompt", e.target.value)}
            placeholder="输入默认系统提示词"
            rows={4}
          />
          <p className="text-xs text-gray-500">系统提示词用于指导AI助手的行为和知识范围。</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">界面语言</Label>
          <Select
            value={localPreferences.language || "zh-CN"}
            onValueChange={(value) => handlePreferenceChange("language", value)}
          >
            <SelectTrigger id="language">
              <SelectValue placeholder="选择界面语言" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="zh-CN">简体中文</SelectItem>
              <SelectItem value="en-US">English (US)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme">界面主题</Label>
          <Select
            value={localPreferences.theme || "light"}
            onValueChange={(value) => handlePreferenceChange("theme", value)}
          >
            <SelectTrigger id="theme">
              <SelectValue placeholder="选择界面主题" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">浅色</SelectItem>
              <SelectItem value="dark">深色</SelectItem>
              <SelectItem value="system">跟随系统</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSavePreferences} disabled={isSaving} className="w-full">
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          保存设置
        </Button>
      </TabsContent>

      <TabsContent value="api-keys" className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
              O
            </div>
            <div className="ml-2">
              <h3 className="font-medium">OpenAI</h3>
              <p className="text-xs text-gray-500">支持GPT-4、GPT-3.5等模型</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="password"
              placeholder="输入OpenAI API密钥"
              value={apiKeys.openai}
              onChange={(e) => handleApiKeyChange("openai", e.target.value)}
            />
            <Button onClick={() => handleSaveApiKey("openai")} disabled={!apiKeys.openai || isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="ml-2">
              <h3 className="font-medium">Anthropic</h3>
              <p className="text-xs text-gray-500">支持Claude系列模型</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="password"
              placeholder="输入Anthropic API密钥"
              value={apiKeys.anthropic}
              onChange={(e) => handleApiKeyChange("anthropic", e.target.value)}
            />
            <Button onClick={() => handleSaveApiKey("anthropic")} disabled={!apiKeys.anthropic || isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
              G
            </div>
            <div className="ml-2">
              <h3 className="font-medium">Google Gemini</h3>
              <p className="text-xs text-gray-500">支持Gemini系列模型</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="password"
              placeholder="输入Google Gemini API密钥"
              value={apiKeys.gemini}
              onChange={(e) => handleApiKeyChange("gemini", e.target.value)}
            />
            <Button onClick={() => handleSaveApiKey("gemini")} disabled={!apiKeys.gemini || isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          <p>API密钥仅存储在您的账户中，用于访问相应的AI服务。</p>
          <p>我们不会将您的API密钥用于任何其他目的或与第三方共享。</p>
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="temperature">温度 ({localPreferences.temperature || 0.7})</Label>
          <input
            id="temperature"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={localPreferences.temperature || 0.7}
            onChange={(e) => handlePreferenceChange("temperature", Number.parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>精确</span>
            <span>创造性</span>
          </div>
          <p className="text-xs text-gray-500">
            较低的温度会产生更确定和一致的回复，较高的温度会产生更多样化和创造性的回复。
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_tokens">最大生成长度</Label>
          <Select
            value={(localPreferences.max_tokens || 1000).toString()}
            onValueChange={(value) => handlePreferenceChange("max_tokens", Number.parseInt(value))}
          >
            <SelectTrigger id="max_tokens">
              <SelectValue placeholder="选择最大生成长度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="500">短 (500 tokens)</SelectItem>
              <SelectItem value="1000">中 (1000 tokens)</SelectItem>
              <SelectItem value="2000">长 (2000 tokens)</SelectItem>
              <SelectItem value="4000">超长 (4000 tokens)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">控制AI回复的最大长度。较长的回复可能会消耗更多的API额度。</p>
        </div>

        <Button onClick={handleSavePreferences} disabled={isSaving} className="w-full">
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          保存设置
        </Button>
      </TabsContent>
    </Tabs>
  )
}

// 使用统计组件
function UsageStatistics({ usageStats }: { usageStats: UsageStat[] }) {
  // 按日期分组
  const groupedByDate = usageStats.reduce(
    (acc, stat) => {
      const date = stat.date
      if (!acc[date]) {
        acc[date] = {
          date,
          totalTokens: 0,
          totalRequests: 0,
          models: {},
        }
      }

      acc[date].totalTokens += stat.tokens_used
      acc[date].totalRequests += stat.request_count

      const modelKey = `${stat.provider}-${stat.model_name}`
      if (!acc[date].models[modelKey]) {
        acc[date].models[modelKey] = {
          name: stat.model_name,
          provider: stat.provider,
          tokens: 0,
          requests: 0,
        }
      }

      acc[date].models[modelKey].tokens += stat.tokens_used
      acc[date].models[modelKey].requests += stat.request_count

      return acc
    },
    {} as Record<string, any>,
  )

  // 转换为数组并排序
  const sortedStats = Object.values(groupedByDate).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  if (sortedStats.length === 0) {
    return (
      <div className="text-center py-8">
        <BarChart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
        <h3 className="text-lg font-medium">暂无使用数据</h3>
        <p className="text-gray-500">开始使用AI助手后，您的使用统计将显示在这里。</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {sortedStats.reduce((sum, stat) => sum + stat.totalTokens, 0).toLocaleString()}
              </div>
              <p className="text-sm text-gray-500">总Token使用量</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {sortedStats.reduce((sum, stat) => sum + stat.totalRequests, 0).toLocaleString()}
              </div>
              <p className="text-sm text-gray-500">总请求次数</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{sortedStats.length}</div>
              <p className="text-sm text-gray-500">活跃天数</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">每日使用统计</h3>
        <div className="space-y-2">
          {sortedStats.map((stat) => (
            <Card key={stat.date}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">{format(new Date(stat.date), "yyyy年MM月dd日", { locale: zhCN })}</div>
                  <div className="text-sm text-gray-500">
                    {stat.totalRequests} 次请求 | {stat.totalTokens.toLocaleString()} tokens
                  </div>
                </div>

                <div className="space-y-2">
                  {Object.values(stat.models).map((model: any) => (
                    <div key={`${model.provider}-${model.name}`} className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            model.provider === "openai"
                              ? "bg-green-500"
                              : model.provider === "anthropic"
                                ? "bg-purple-500"
                                : model.provider === "gemini"
                                  ? "bg-blue-500"
                                  : "bg-gray-500"
                          }`}
                        ></div>
                        <span>
                          {model.name} ({model.provider})
                        </span>
                      </div>
                      <div className="text-gray-500">
                        {model.requests} 次 | {model.tokens.toLocaleString()} tokens
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// 新建对话对话框
function NewConversationDialog({
  models,
  onCreateConversation,
  open,
  onOpenChange,
}: {
  models: AiModel[]
  onCreateConversation: (title: string, modelId?: number, systemPrompt?: string) => Promise<void>
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [title, setTitle] = useState("新对话")
  const [modelId, setModelId] = useState<number | undefined>(undefined)
  const [systemPrompt, setSystemPrompt] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    if (!title.trim()) return

    setIsCreating(true)
    try {
      await onCreateConversation(title, modelId, systemPrompt || undefined)
      // 重置表单
      setTitle("新对话")
      setModelId(undefined)
      setSystemPrompt("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "创建对话失败",
        description: error instanceof Error ? error.message : "发生未知错误",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建对话</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">对话标题</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="输入对话标题" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">AI模型 (可选)</Label>
            <Select
              value={modelId?.toString()}
              onValueChange={(value) => setModelId(value ? Number.parseInt(value) : undefined)}
            >
              <SelectTrigger id="model">
                <SelectValue placeholder="选择AI模型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">默认模型</SelectItem>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id.toString()}>
                    {model.name} ({model.provider})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="systemPrompt">系统提示词 (可选)</Label>
            <Textarea
              id="systemPrompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="输入系统提示词，定义助手的行为和知识范围"
              rows={4}
            />
          </div>

          <Button onClick={handleCreate} disabled={!title.trim() || isCreating} className="w-full">
            {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            创建对话
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 主助手组件
export function DbAssistant({
  initialExpanded = true,
  className = "",
}: {
  initialExpanded?: boolean
  className?: string
}) {
  const [expanded, setExpanded] = useState(initialExpanded)
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeTab, setActiveTab] = useState("chat")
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [newConversationOpen, setNewConversationOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 状态
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [models, setModels] = useState<AiModel[]>([])
  const [preferences, setPreferences] = useState<UserPreference | null>(null)
  const [usageStats, setUsageStats] = useState<UsageStat[]>([])

  // 加载状态
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isLoadingModels, setIsLoadingModels] = useState(true)
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true)
  const [isLoadingUsageStats, setIsLoadingUsageStats] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)

  // 输入状态
  const [input, setInput] = useState("")

  // 加载对话列表
  const loadConversations = async () => {
    setIsLoadingConversations(true)
    try {
      const response = await fetch("/api/ai-assistant/conversations")
      if (!response.ok) throw new Error("加载对话列表失败")

      const data = await response.json()
      setConversations(data.conversations)

      // 如果有对话但没有当前对话，选择第一个
      if (data.conversations.length > 0 && !currentConversation) {
        setCurrentConversation(data.conversations[0])
        loadMessages(data.conversations[0].id)
      }
    } catch (error) {
      console.error("加载对话列表失败:", error)
      toast({
        title: "加载对话列表失败",
        description: error instanceof Error ? error.message : "发生未知错误",
        variant: "destructive",
      })
    } finally {
      setIsLoadingConversations(false)
    }
  }

  // 加载对话消息
  const loadMessages = async (conversationId: number) => {
    setIsLoadingMessages(true)
    try {
      const response = await fetch(`/api/ai-assistant/conversations/${conversationId}`)
      if (!response.ok) throw new Error("加载对话消息失败")

      const data = await response.json()
      setMessages(data.messages)
    } catch (error) {
      console.error("加载对话消息失败:", error)
      toast({
        title: "加载对话消息失败",
        description: error instanceof Error ? error.message : "发生未知错误",
        variant: "destructive",
      })
    } finally {
      setIsLoadingMessages(false)
    }
  }

  // 加载AI模型
  const loadModels = async () => {
    setIsLoadingModels(true)
    try {
      const response = await fetch("/api/ai-assistant/models")
      if (!response.ok) throw new Error("加载AI模型失败")

      const data = await response.json()
      setModels(data.models)
    } catch (error) {
      console.error("加载AI模型失败:", error)
      toast({
        title: "加载AI模型失败",
        description: error instanceof Error ? error.message : "发生未知错误",
        variant: "destructive",
      })
    } finally {
      setIsLoadingModels(false)
    }
  }

  // 加载用户偏好设置
  const loadPreferences = async () => {
    setIsLoadingPreferences(true)
    try {
      const response = await fetch("/api/ai-assistant/preferences")
      if (!response.ok) throw new Error("加载用户偏好设置失败")

      const data = await response.json()
      setPreferences(data.preferences)
    } catch (error) {
      console.error("加载用户偏好设置失败:", error)
      // 不显示错误提示，因为可能是首次使用
    } finally {
      setIsLoadingPreferences(false)
    }
  }

  // 加载使用统计
  const loadUsageStats = async () => {
    setIsLoadingUsageStats(true)
    try {
      const response = await fetch("/api/ai-assistant/usage")
      if (!response.ok) throw new Error("加载使用统计失败")

      const data = await response.json()
      setUsageStats(data.usageStats)
    } catch (error) {
      console.error("加载使用统计失败:", error)
      toast({
        title: "加载使用统计失败",
        description: error instanceof Error ? error.message : "发生未知错误",
        variant: "destructive",
      })
    } finally {
      setIsLoadingUsageStats(false)
    }
  }

  // 创建新对话
  const createConversation = async (title: string, modelId?: number, systemPrompt?: string) => {
    try {
      const response = await fetch("/api/ai-assistant/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, modelId, systemPrompt }),
      })

      if (!response.ok) throw new Error("创建对话失败")

      const data = await response.json()

      // 更新对话列表
      setConversations((prev) => [data.conversation, ...prev])
      setCurrentConversation(data.conversation)
      setMessages([])
      setActiveTab("chat")
    } catch (error) {
      console.error("创建对话失败:", error)
      throw error
    }
  }

  // 删除对话
  const deleteConversation = async (conversationId: number) => {
    try {
      const response = await fetch(`/api/ai-assistant/conversations/${conversationId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("删除对话失败")

      // 更新对话列表
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId))

      // 如果删除的是当前对话，选择另一个对话
      if (currentConversation?.id === conversationId) {
        const remainingConversations = conversations.filter((conv) => conv.id !== conversationId)
        if (remainingConversations.length > 0) {
          setCurrentConversation(remainingConversations[0])
          loadMessages(remainingConversations[0].id)
        } else {
          setCurrentConversation(null)
          setMessages([])
        }
      }
    } catch (error) {
      console.error("删除对话失败:", error)
      toast({
        title: "删除对话失败",
        description: error instanceof Error ? error.message : "发生未知错误",
        variant: "destructive",
      })
    }
  }

  // 重命名对话
  const renameConversation = async (conversationId: number, newTitle: string) => {
    try {
      const response = await fetch(`/api/ai-assistant/conversations/${conversationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      })

      if (!response.ok) throw new Error("重命名对话失败")

      // 更新对话列表
      setConversations((prev) =>
        prev.map((conv) => (conv.id === conversationId ? { ...conv, title: newTitle } : conv)),
      )

      // 如果重命名的是当前对话，更新当前对话
      if (currentConversation?.id === conversationId) {
        setCurrentConversation((prev) => (prev ? { ...prev, title: newTitle } : null))
      }
    } catch (error) {
      console.error("重命名对话失败:", error)
      toast({
        title: "重命名对话失败",
        description: error instanceof Error ? error.message : "发生未知错误",
        variant: "destructive",
      })
    }
  }

  // 切换对话置顶状态
  const togglePinConversation = async (conversationId: number) => {
    try {
      const conversation = conversations.find((conv) => conv.id === conversationId)
      if (!conversation) return

      const response = await fetch(`/api/ai-assistant/conversations/${conversationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_pinned: !conversation.is_pinned }),
      })

      if (!response.ok) throw new Error("更新对话置顶状态失败")

      // 更新对话列表
      setConversations((prev) =>
        prev.map((conv) => (conv.id === conversationId ? { ...conv, is_pinned: !conv.is_pinned } : conv)),
      )

      // 如果更新的是当前对话，更新当前对话
      if (currentConversation?.id === conversationId) {
        setCurrentConversation((prev) => (prev ? { ...prev, is_pinned: !prev.is_pinned } : null))
      }
    } catch (error) {
      console.error("更新对话置顶状态失败:", error)
      toast({
        title: "更新对话置顶状态失败",
        description: error instanceof Error ? error.message : "发生未知错误",
        variant: "destructive",
      })
    }
  }

  // 发送消息
  const sendMessage = async () => {
    if (!input.trim() || !currentConversation || isSendingMessage) return

    const userMessage = input
    setInput("")
    setIsSendingMessage(true)

    // 添加用户消息到界面
    const tempUserMessage: Message = {
      id: Date.now(),
      conversation_id: currentConversation.id,
      role: "user",
      content: userMessage,
      tokens_used: null,
      created_at: new Date(),
    }

    setMessages((prev) => [...prev, tempUserMessage])

    try {
      const response = await fetch(`/api/ai-assistant/conversations/${currentConversation.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: userMessage }),
      })

      if (!response.ok) throw new Error("发送消息失败")

      const data = await response.json()

      // 更新消息列表
      setMessages((prev) => [...prev.filter((msg) => msg.id !== tempUserMessage.id), data.user_message, data.assistant_message])

      // 如果对话标题是默认的，更新为第一个用户消息
      if (currentConversation.title === "新对话" || currentConversation.title === "New Conversation") {
        const newTitle = userMessage.slice(0, 30) + (userMessage.length > 30 ? "..." : "")
        renameConversation(currentConversation.id, newTitle)
      }
    } catch (error) {
      console.error("发送消息失败:", error)
      toast({
        title: "发送消息失败",
        description: error instanceof Error ? error.message : "发生未知错误",
        variant: "destructive",
      })
      // 移除临时消息
      setMessages((prev) => prev.filter((msg) => msg.id !== tempUserMessage.id))
    } finally {
      setIsSendingMessage(false)
    }
  }

  // 保存偏好设置
  const savePreferences = async (newPreferences: Partial<UserPreference>) => {
    try {
      const response = await fetch("/api/ai-assistant/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPreferences),
      })

      if (!response.ok) throw new Error("保存偏好设置失败")

      const data = await response.json()
      setPreferences(data.preferences)
    } catch (error) {
      console.error("保存偏好设置失败:", error)
      throw error
    }
  }

  // 保存API密钥
  const saveApiKey = async (provider: string, apiKey: string) => {
    try {
      const response = await fetch("/api/ai-assistant/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ provider, api_key: apiKey }),
      })

      if (!response.ok) throw new Error("保存API密钥失败")
    } catch (error) {
      console.error("保存API密钥失败:", error)
      throw error
    }
  }

  // 初始化加载
  useEffect(() => {
    loadConversations()
    loadModels()
    loadPreferences()
  }, [])

  // 当切换到统计标签时加载使用统计
  useEffect(() => {
    if (activeTab === "stats") {
      loadUsageStats()
    }
  }, [activeTab])

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      sendMessage()
    }
  }

  // 排序对话：置顶的在前，按更新时间降序
  const sortedConversations = [...conversations].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1
    if (!a.is_pinned && b.is_pinned) return 1
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  })

  return (
    <div className={`flex h-full bg-white rounded-lg border ${className}`}>
      {/* 侧边栏 */}
      {showSidebar && (
        <div className="w-64 border-r flex flex-col">
          <div className="p-4 border-b">
            <Button onClick={() => setNewConversationOpen(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              新建对话
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoadingConversations ? (
              <div className="flex justify-center items-center h-20">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : sortedConversations.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>暂无对话</p>
                <Button variant="link" onClick={() => setNewConversationOpen(true)} className="p-0 h-auto">
                  创建第一个对话
                </Button>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {sortedConversations.map((conversation) => (
                  <div key={conversation.id} className="group">
                    <ConversationListItem
                      conversation={conversation}
                      isActive={currentConversation?.id === conversation.id}
                      onClick={() => {
                        setCurrentConversation(conversation)
                        loadMessages(conversation.id)
                        setActiveTab("chat")
                      }}
                      onDelete={() => deleteConversation(conversation.id)}
                      onRename={(newTitle) => renameConversation(conversation.id, newTitle)}
                      onTogglePin={() => togglePinConversation(conversation.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setSettingsOpen(true)}
            >
              <Save className="h-4 w-4 mr-2" />
              设置
            </Button>
          </div>
        </div>
      )}

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 标签页头部 */}
        <div className="border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="p-2">
              <TabsTrigger value="chat" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                对话
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                使用统计
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 标签页内容 */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            {/* 对话标签页 */}
            <TabsContent value="chat" className="h-full m-0">
              {currentConversation ? (
                <div className="flex flex-col h-full">
                  {/* 消息区域 */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {isLoadingMessages ? (
                      <div className="flex justify-center items-center h-20">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Bot className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium">开始新的对话</h3>
                        <p className="mt-2">在下方输入消息开始与AI助手对话</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <AssistantMessageItem key={message.id} message={message} />
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* 输入区域 */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="输入消息... (Ctrl+Enter 发送)"
                        className="min-h-[60px] resize-none"
                        disabled={isSendingMessage}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!input.trim() || isSendingMessage}
                        className="self-end"
                      >
                        {isSendingMessage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "发送"
                        )}
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 text-center">
                      支持 Markdown 格式 • 按 Ctrl+Enter 快速发送
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Bot className="h-16 w-16 mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">选择或创建对话</h3>
                  <p className="mb-4">请从侧边栏选择一个对话或创建新对话</p>
                  <Button onClick={() => setNewConversationOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    新建对话
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* 使用统计标签页 */}
            <TabsContent value="stats" className="h-full m-0 p-4 overflow-y-auto">
              {isLoadingUsageStats ? (
                <div className="flex justify-center items-center h-20">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : (
                <UsageStatistics usageStats={usageStats} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 设置对话框 */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI助手设置</DialogTitle>
          </DialogHeader>
          <AssistantSettings
            models={models}
            preferences={preferences}
            onSavePreferences={savePreferences}
            onSaveApiKey={saveApiKey}
          />
        </DialogContent>
      </Dialog>

      {/* 新建对话对话框 */}
      <NewConversationDialog
        models={models}
        onCreateConversation={createConversation}
        open={newConversationOpen}
        onOpenChange={setNewConversationOpen}
      />
    </div>
  )
}
