import { logError } from "./error-logging"

export class ApiError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
  }
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `请求失败: ${response.status} ${response.statusText}`
    let errorCode: string | undefined

    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorMessage
      errorCode = errorData.code
    } catch (e) {
      // 如果无法解析JSON，使用默认错误消息
    }

    const error = new ApiError(errorMessage, response.status, errorCode)

    // 记录API错误
    logError({
      error: error.toString(),
      timestamp: new Date().toISOString(),
      url: response.url,
      additionalInfo: {
        status: response.status,
        statusText: response.statusText,
        code: errorCode,
      },
    })

    throw error
  }

  return (await response.json()) as T
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

export function getHttpStatusFromError(error: unknown): number | null {
  if (error instanceof ApiError) {
    return error.status
  }

  return null
}
