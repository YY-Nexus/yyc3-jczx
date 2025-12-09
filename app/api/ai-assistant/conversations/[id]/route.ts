import { NextResponse } from "next/server"
import { mockDataService } from "@/app/services/ai-assistant/mock-data"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }]
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const conversation = mockDataService.getConversationById(id)
    const messages = mockDataService.getConversationMessages(id)

    if (!conversation) {
      return NextResponse.json({ error: "对话不存在" }, { status: 404 })
    }

    return NextResponse.json({ conversation, messages })
  } catch (error) {
    console.error("获取对话详情失败:", error)
    return NextResponse.json(
      { error: "获取对话详情失败", message: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}

export async function PATCH() {
  try {
    // 返回第一个模拟对话
    const conversation = mockDataService.getConversationById(1)
    return NextResponse.json({ conversation })
  } catch (error) {
    console.error("更新对话失败:", error)
    return NextResponse.json(
      { error: "更新对话失败", message: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}

export async function DELETE() {
  try {
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("删除对话失败:", error)
    return NextResponse.json(
      { error: "删除对话失败", message: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}
