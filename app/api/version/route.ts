import { NextResponse } from "next/server"

export async function GET() {
  // 在实际应用中，这里应该从数据库或配置文件中获取最新版本信息
  const latestVersion = {
    version: "1.2.0", // 应该比当前版本高
    releaseDate: new Date().toISOString(),
    releaseNotes: `## 新功能

- 添加了版本检查功能
- 优化了错误处理系统
- 改进了用户界面响应速度

## 修复

- 修复了分类过滤器的错误
- 解决了移动设备上的显示问题
- 修复了同步功能的稳定性问题`,
    downloadUrl: "https://example.com/download",
    critical: false,
  }

  return NextResponse.json(latestVersion)
}
