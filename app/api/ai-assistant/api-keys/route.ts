import { NextResponse } from "next/server"

export const dynamic = "force-static"

export async function POST() {
  try {
    // 模拟成功保存API密钥
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("保存API密钥失败:", error)
    return NextResponse.json(
      { error: "保存API密钥失败", message: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}
