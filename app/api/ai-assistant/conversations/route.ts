import { NextResponse } from "next/server"
import { mockDataService } from "@/app/services/ai-assistant/mock-data"

export const dynamic = "force-static"

export async function GET() {
  try {
    // 使用模拟用户ID 1
    const conversations = mockDataService.getUserConversations(1)
    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("获取对话列表失败:", error)
    return NextResponse.json(
      { error: "获取对话列表失败", message: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    // 返回第一个模拟对话
    const conversation = mockDataService.getConversationById(1)
    return NextResponse.json({ conversation })
  } catch (error) {
    console.error("创建对话失败:", error)
    return NextResponse.json(
      { error: "创建对话失败", message: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}
