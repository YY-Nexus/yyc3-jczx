/**
 * 数据库服务模块
 * 提供统一的数据库错误处理和类型定义
 */

import type { ApiError } from "../types"

// 模拟数据库服务
export const db = {
  // 空对象，不再尝试连接数据库
}

/**
 * 处理数据库错误
 * @param error 错误对象
 * @param operation 操作名称
 * @returns 格式化的错误对象
 */
export function handleDbError(error: unknown, operation: string): ApiError {
  const errorMessage = error instanceof Error ? error.message : "未知错误"
  const errorCode =
    error instanceof Error && "code" in error ? String((error as Error & { code?: string }).code) : "DB_ERROR"

  console.error(`数据库操作失败 (${operation}):`, errorMessage)

  return {
    code: errorCode,
    message: `数据库操作失败: ${errorMessage}`,
    status: 500,
    details: {
      operation,
      timestamp: new Date().toISOString(),
    },
  }
}

/**
 * 验证数据库连接状态
 * @returns 连接是否可用
 */
export function isDatabaseAvailable(): boolean {
  // 在实际应用中，这里应该检查真实的数据库连接
  return false
}

/**
 * 安全地执行数据库操作
 * @param operation 操作名称
 * @param callback 操作回调函数
 * @returns 操作结果或错误
 */
export async function safeDbOperation<T>(
  operation: string,
  callback: () => Promise<T>,
): Promise<{ success: true; data: T } | { success: false; error: ApiError }> {
  try {
    const data = await callback()
    return { success: true, data }
  } catch (error) {
    return { success: false, error: handleDbError(error, operation) }
  }
}
