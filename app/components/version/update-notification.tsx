"use client"

import { useState } from "react"
import { AlertCircle, X, Download, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useVersionCheck } from "@/app/context/version-check-context"
import { formatDate } from "@/app/utils/format-date"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function UpdateNotification() {
  const { updateAvailable, updateInfo, dismissUpdate } = useVersionCheck()
  const [showDetails, setShowDetails] = useState(false)

  if (!updateAvailable || !updateInfo) {
    return null
  }

  const { currentVersion, latestVersion, updateType } = updateInfo
  const updateTypeText = updateType === "major" ? "重大更新" : updateType === "minor" ? "功能更新" : "补丁更新"
  const updateTypeClass =
    updateType === "major"
      ? "bg-red-100 text-red-800"
      : updateType === "minor"
        ? "bg-blue-100 text-blue-800"
        : "bg-green-100 text-green-800"

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full shadow-lg">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
                发现新版本
                <span className={`ml-2 text-xs px-2 py-1 rounded-full ${updateTypeClass}`}>{updateTypeText}</span>
              </CardTitle>
              <CardDescription>
                版本 {latestVersion.version} 已发布，您当前的版本是 {currentVersion}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={dismissUpdate} className="h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">关闭</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          {showDetails ? (
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">发布日期：</span> {formatDate(latestVersion.releaseDate)}
              </div>
              <div>
                <span className="font-medium">更新内容：</span>
                <div className="mt-1 p-2 bg-gray-50 rounded text-xs whitespace-pre-line">
                  {latestVersion.releaseNotes}
                </div>
              </div>
            </div>
          ) : (
            <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => setShowDetails(true)}>
              查看更新详情
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <UpdateSettings />
          <Button size="sm" className="gap-1" onClick={() => window.open(latestVersion.downloadUrl, "_blank")}>
            <Download className="h-4 w-4" />
            立即更新
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function UpdateSettings() {
  const { settings, updateSettings } = useVersionCheck()
  const [open, setOpen] = useState(false)

  const handleIntervalChange = (value: string) => {
    const intervals: Record<string, number> = {
      hourly: 60 * 60 * 1000,
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
      never: 0,
    }
    updateSettings({ checkInterval: intervals[value] })
  }

  const getIntervalValue = () => {
    const interval = settings.checkInterval
    if (interval === 0) return "never"
    if (interval <= 60 * 60 * 1000) return "hourly"
    if (interval <= 24 * 60 * 60 * 1000) return "daily"
    if (interval <= 7 * 24 * 60 * 60 * 1000) return "weekly"
    return "monthly"
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Settings className="h-4 w-4" />
          更新设置
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>更新检查设置</DialogTitle>
          <DialogDescription>配置应用如何检查和通知新版本</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-check">自动检查更新</Label>
              <p className="text-sm text-muted-foreground">允许应用定期检查新版本</p>
            </div>
            <Switch
              id="auto-check"
              checked={settings.autoCheck}
              onCheckedChange={(checked) => updateSettings({ autoCheck: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notify-startup">启动时通知</Label>
              <p className="text-sm text-muted-foreground">应用启动时检查并通知更新</p>
            </div>
            <Switch
              id="notify-startup"
              checked={settings.notifyOnStartup}
              onCheckedChange={(checked) => updateSettings({ notifyOnStartup: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="check-interval">检查频率</Label>
            <Select value={getIntervalValue()} onValueChange={handleIntervalChange} disabled={!settings.autoCheck}>
              <SelectTrigger id="check-interval" className="w-full">
                <SelectValue placeholder="选择检查频率" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">每小时</SelectItem>
                <SelectItem value="daily">每天</SelectItem>
                <SelectItem value="weekly">每周</SelectItem>
                <SelectItem value="monthly">每月</SelectItem>
                <SelectItem value="never">从不</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>保存设置</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
