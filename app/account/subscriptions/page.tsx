"use client"

import { useState } from "react"
import { Navbar } from "@/components/ui/navbar"
import { useSubscription, type Subscription, type SubscriptionType } from "@/app/context/subscription-context"
import { useAuth } from "@/app/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Bell, Trash2, AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

export default function SubscriptionsPage() {
  const { subscriptions, unsubscribe, updateSubscriptionSettings, getSubscriptionsByType } = useSubscription()
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<SubscriptionType>("category")
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<string | null>(null)

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 container max-w-6xl mx-auto px-4 py-8">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>订阅管理</CardTitle>
              <CardDescription>管理您的分类、开发者和集成订阅</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">需要登录</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                您需要登录后才能管理订阅。请登录后再访问此页面。
              </p>
              <Button onClick={() => router.push("/")}>返回首页</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const categorySubscriptions = getSubscriptionsByType("category")
  const developerSubscriptions = getSubscriptionsByType("developer")
  const integrationSubscriptions = getSubscriptionsByType("integration")

  const handleDeleteSubscription = async () => {
    if (subscriptionToDelete) {
      await unsubscribe(subscriptionToDelete)
      setSubscriptionToDelete(null)
    }
  }

  const handleUpdateSettings = async (
    subscriptionId: string,
    settings: Partial<Pick<Subscription, "notificationEnabled" | "emailNotification" | "frequency">>,
  ) => {
    await updateSubscriptionSettings(subscriptionId, settings)
  }

  const renderSubscriptionList = (subscriptionList: Subscription[]) => {
    if (subscriptionList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Bell className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold mb-2">暂无订阅</h3>
          <p className="text-muted-foreground text-center max-w-md">
            您还没有订阅任何
            {activeTab === "category" ? "分类" : activeTab === "developer" ? "开发者" : "集成"}
            。订阅后可以及时获取更新通知。
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {subscriptionList.map((subscription) => (
          <Card key={subscription.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{subscription.targetName}</CardTitle>
                  <CardDescription>
                    订阅于 {new Date(subscription.createdAt).toLocaleDateString("zh-CN")}
                  </CardDescription>
                </div>
                <AlertDialog
                  open={subscriptionToDelete === subscription.id}
                  onOpenChange={(open) => !open && setSubscriptionToDelete(null)}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setSubscriptionToDelete(subscription.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认取消订阅</AlertDialogTitle>
                      <AlertDialogDescription>
                        您确定要取消订阅 {subscription.targetName} 吗？取消后将不再接收相关通知。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteSubscription}>确认</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`notifications-${subscription.id}`} className="flex flex-col gap-1">
                    <span>应用内通知</span>
                    <span className="font-normal text-xs text-muted-foreground">在应用中接收新集成和更新通知</span>
                  </Label>
                  <Switch
                    id={`notifications-${subscription.id}`}
                    checked={subscription.notificationEnabled}
                    onCheckedChange={(checked) =>
                      handleUpdateSettings(subscription.id, { notificationEnabled: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor={`email-${subscription.id}`} className="flex flex-col gap-1">
                    <span>邮件通知</span>
                    <span className="font-normal text-xs text-muted-foreground">通过邮件接收重要更新</span>
                  </Label>
                  <Switch
                    id={`email-${subscription.id}`}
                    checked={subscription.emailNotification}
                    onCheckedChange={(checked) => handleUpdateSettings(subscription.id, { emailNotification: checked })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>通知频率</Label>
                  <RadioGroup
                    value={subscription.frequency}
                    onValueChange={(value) => handleUpdateSettings(subscription.id, { frequency: value as any })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="instant" id={`instant-${subscription.id}`} />
                      <Label htmlFor={`instant-${subscription.id}`}>实时通知</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id={`daily-${subscription.id}`} />
                      <Label htmlFor={`daily-${subscription.id}`}>每日摘要</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id={`weekly-${subscription.id}`} />
                      <Label htmlFor={`weekly-${subscription.id}`}>每周摘要</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>订阅管理</CardTitle>
            <CardDescription>管理您的分类、开发者和集成订阅</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SubscriptionType)}>
              <TabsList className="w-full mb-6">
                <TabsTrigger value="category" className="flex-1">
                  分类订阅 ({categorySubscriptions.length})
                </TabsTrigger>
                <TabsTrigger value="developer" className="flex-1">
                  开发者订阅 ({developerSubscriptions.length})
                </TabsTrigger>
                <TabsTrigger value="integration" className="flex-1">
                  集成订阅 ({integrationSubscriptions.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="category">{renderSubscriptionList(categorySubscriptions)}</TabsContent>
              <TabsContent value="developer">{renderSubscriptionList(developerSubscriptions)}</TabsContent>
              <TabsContent value="integration">{renderSubscriptionList(integrationSubscriptions)}</TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
