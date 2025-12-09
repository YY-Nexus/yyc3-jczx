import { type NextRequest, NextResponse } from "next/server"
import { logError } from "@/app/services/error-logging"

export interface ApiErrorResponse {
  error: {
    message: string
    code?: string
    status: number
  }
  success: false
}

export async function withErrorHandler(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>,
): Promise<NextResponse> {
  try {
    return await handler(request)
  } catch (error) {
    // 记录错误
    logError({
      error: error instanceof Error ? error.toString() : String(error),
      timestamp: new Date().toISOString(),
      url: request.url,
      additionalInfo: {
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
      },
    })

    // 构建错误响应
    const errorMessage = error instanceof Error ? error.message : "服务器内部错误"
    const errorCode = error instanceof Error && "code" in error ? (error as any).code : undefined
    const status = error instanceof Error && "status" in error ? (error as any).status : 500

    const errorResponse: ApiErrorResponse = {
      error: {
        message: errorMessage,
        code: errorCode,
        status,
      },
      success: false,
    }

    return NextResponse.json(errorResponse, { status })
  }
}
