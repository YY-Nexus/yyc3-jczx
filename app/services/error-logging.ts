interface ErrorLogData {
  error: string
  componentStack?: string
  url?: string
  timestamp: string
  userId?: string
  additionalInfo?: Record<string, any>
}

// 错误严重程度枚举
export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// 错误类型枚举
export enum ErrorType {
  CLIENT = "client",
  SERVER = "server",
  NETWORK = "network",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  VALIDATION = "validation",
  UNKNOWN = "unknown",
}

// 扩展的错误日志数据
interface EnhancedErrorLogData extends ErrorLogData {
  severity?: ErrorSeverity
  type?: ErrorType
  browser?: string
  os?: string
  appVersion?: string
}

/**
 * 记录错误到日志服务
 */
export async function logError(data: ErrorLogData): Promise<void> {
  // 增强错误数据
  const enhancedData: EnhancedErrorLogData = {
    ...data,
    severity: determineErrorSeverity(data.error),
    type: determineErrorType(data.error),
    browser: getBrowserInfo(),
    os: getOSInfo(),
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "未知",
  }

  // 在开发环境中打印到控制台
  if (process.env.NODE_ENV === "development") {
    console.error("错误日志:", enhancedData)
    return
  }

  // 在生产环境中发送到日志服务
  try {
    // 这里可以替换为实际的日志服务API调用
    // 例如: await fetch('/api/log-error', { method: 'POST', body: JSON.stringify(enhancedData) })

    // 模拟发送到日志服务
    console.error("发送错误到日志服务:", enhancedData)
  } catch (error) {
    // 如果日志服务本身出错，至少在控制台记录一下
    console.error("发送错误日志失败:", error)
  }
}

/**
 * 确定错误的严重程度
 */
function determineErrorSeverity(errorMessage: string): ErrorSeverity {
  const lowSeverityPatterns = ["warning", "警告", "deprecated"]
  const highSeverityPatterns = ["database", "数据库", "connection", "连接", "timeout", "超时"]
  const criticalPatterns = ["crash", "崩溃", "security", "安全", "memory", "内存"]

  const lowerCaseError = errorMessage.toLowerCase()

  if (criticalPatterns.some((pattern) => lowerCaseError.includes(pattern))) {
    return ErrorSeverity.CRITICAL
  }

  if (highSeverityPatterns.some((pattern) => lowerCaseError.includes(pattern))) {
    return ErrorSeverity.HIGH
  }

  if (lowSeverityPatterns.some((pattern) => lowerCaseError.includes(pattern))) {
    return ErrorSeverity.LOW
  }

  return ErrorSeverity.MEDIUM
}

/**
 * 确定错误的类型
 */
function determineErrorType(errorMessage: string): ErrorType {
  const lowerCaseError = errorMessage.toLowerCase()

  if (lowerCaseError.includes("network") || lowerCaseError.includes("fetch") || lowerCaseError.includes("网络")) {
    return ErrorType.NETWORK
  }

  if (lowerCaseError.includes("auth") || lowerCaseError.includes("login") || lowerCaseError.includes("登录")) {
    return ErrorType.AUTHENTICATION
  }

  if (
    lowerCaseError.includes("permission") ||
    lowerCaseError.includes("forbidden") ||
    lowerCaseError.includes("权限")
  ) {
    return ErrorType.AUTHORIZATION
  }

  if (lowerCaseError.includes("validation") || lowerCaseError.includes("invalid") || lowerCaseError.includes("验证")) {
    return ErrorType.VALIDATION
  }

  return ErrorType.UNKNOWN
}

/**
 * 获取浏览器信息
 */
function getBrowserInfo(): string {
  if (typeof window === "undefined") return "服务器端"

  const userAgent = navigator.userAgent

  if (userAgent.includes("Chrome")) return "Chrome"
  if (userAgent.includes("Firefox")) return "Firefox"
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari"
  if (userAgent.includes("Edge")) return "Edge"
  if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) return "Internet Explorer"

  return "未知浏览器"
}

/**
 * 获取操作系统信息
 */
function getOSInfo(): string {
  if (typeof window === "undefined") return "服务器端"

  const userAgent = navigator.userAgent

  if (userAgent.includes("Windows")) return "Windows"
  if (userAgent.includes("Mac")) return "MacOS"
  if (userAgent.includes("Linux")) return "Linux"
  if (userAgent.includes("Android")) return "Android"
  if (userAgent.includes("iOS") || userAgent.includes("iPhone") || userAgent.includes("iPad")) return "iOS"

  return "未知操作系统"
}
