import { NextResponse } from "next/server"
import { mockDataService } from "@/app/services/ai-assistant/mock-data"

export const dynamic = "force-static"

export async function GET() {
  try {
    const usageStats = mockDataService.getUserUsageStats()
    return NextResponse.json({ usageStats })
  } catch (error) {
    console.error("获取使用统计失败:", error)
    return NextResponse.json(
      { error: "获取使用统计失败", message: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}
