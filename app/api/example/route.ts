import { type NextRequest, NextResponse } from "next/server"
import { withErrorHandler } from "../middleware/error-handler"

export async function GET(request: NextRequest) {
  return withErrorHandler(request, async () => {
    // 模拟API处理逻辑
    const { searchParams } = new URL(request.url)
    const shouldError = searchParams.get("error") === "true"

    if (shouldError) {
      throw new Error("这是一个测试错误")
    }

    return NextResponse.json({
      message: "请求成功",
      data: {
        timestamp: new Date().toISOString(),
      },
      success: true,
    })
  })
}
