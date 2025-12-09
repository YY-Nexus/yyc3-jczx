import { NextResponse } from "next/server"
import { mockDataService } from "@/app/services/ai-assistant/mock-data"

export const dynamic = "force-static"

export async function GET() {
  try {
    // 使用模拟用户ID 1
    const preferences = mockDataService.getUserPreference(1)
    return NextResponse.json({ preferences })
  } catch (error) {
    console.error("获取用户偏好设置失败:", error)
    return NextResponse.json(
      { error: "获取用户偏好设置失败", message: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    // 返回模拟用户偏好设置
    const preferences = mockDataService.getUserPreference(1)
    return NextResponse.json({ preferences })
  } catch (error) {
    console.error("保存用户偏好设置失败:", error)
    return NextResponse.json(
      { error: "保存用户偏好设置失败", message: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}
