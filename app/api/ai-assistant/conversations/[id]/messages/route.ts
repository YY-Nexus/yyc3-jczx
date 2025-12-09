import { NextResponse } from "next/server"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }]
}

export async function POST() {
  try {
    // 返回模拟用户消息和助手消息
    const userMessage = {
      id: 100,
      conversation_id: 1,
      role: "user",
      content: "这是一个新问题",
      tokens_used: 10,
      created_at: new Date(),
    }

    const assistantMessage = {
      id: 101,
      conversation_id: 1,
      role: "assistant",
      content:
        "这是一个模拟回复。由于我们使用的是静态数据，所有对话都会返回这个预设回复。在实际应用中，这里会连接到AI服务生成真实回复。",
      tokens_used: 50,
      created_at: new Date(),
    }

    return NextResponse.json({ userMessage, assistantMessage })
  } catch (error) {
    console.error("发送消息失败:", error)
    return NextResponse.json(
      { error: "发送消息失败", message: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}
