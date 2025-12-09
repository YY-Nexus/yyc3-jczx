import { NextResponse } from "next/server"
import { mockDataService } from "@/app/services/ai-assistant/mock-data"

export const dynamic = "force-static"

export async function GET() {
  try {
    const models = mockDataService.getActiveModels()
    return NextResponse.json({ models })
  } catch (error) {
    console.error("获取AI模型失败:", error)
    return NextResponse.json(
      { error: "获取AI模型失败", message: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}
