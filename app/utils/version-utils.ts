/**
 * 比较两个语义化版本号
 * @param v1 第一个版本号 (如 "1.2.3")
 * @param v2 第二个版本号 (如 "1.3.0")
 * @returns 如果v1 < v2返回-1，如果v1 > v2返回1，如果相等返回0
 */
export function compareVersions(v1: string, v2: string): number {
  // 清理版本号字符串，移除可能的'v'前缀
  const cleanV1 = v1.replace(/^v/, "")
  const cleanV2 = v2.replace(/^v/, "")

  // 将版本号分割为主要部分和预发布部分
  const [v1Main, v1Pre] = cleanV1.split("-")
  const [v2Main, v2Pre] = cleanV2.split("-")

  // 将主要版本部分分割为数字数组
  const v1Parts = v1Main.split(".").map(Number)
  const v2Parts = v2Main.split(".").map(Number)

  // 比较主要版本部分
  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const part1 = i < v1Parts.length ? v1Parts[i] : 0
    const part2 = i < v2Parts.length ? v2Parts[i] : 0

    if (part1 < part2) return -1
    if (part1 > part2) return 1
  }

  // 如果主要版本相同，检查是否有预发布标识符
  // 有预发布标识符的版本小于没有预发布标识符的版本
  if (v1Pre && !v2Pre) return -1
  if (!v1Pre && v2Pre) return 1
  if (v1Pre && v2Pre) {
    // 比较预发布标识符
    return v1Pre.localeCompare(v2Pre)
  }

  // 版本完全相同
  return 0
}

/**
 * 解析版本字符串为结构化对象
 * @param version 版本字符串 (如 "1.2.3-beta.1")
 * @returns 解析后的版本对象
 */
export function parseVersion(version: string) {
  // 默认值
  const result: any = {
    display: version,
    raw: version,
  }

  // 清理版本号字符串，移除可能的'v'前缀
  const cleanVersion = version.replace(/^v/, "")

  // 尝试解析语义化版本
  const semVerRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?(?:\+([a-zA-Z0-9.-]+))?$/
  const match = cleanVersion.match(semVerRegex)

  if (match) {
    result.major = Number.parseInt(match[1], 10)
    result.minor = Number.parseInt(match[2], 10)
    result.patch = Number.parseInt(match[3], 10)
    if (match[4]) result.prerelease = match[4]
    if (match[5]) result.buildMeta = match[5]
  }

  // 检查是否包含Git哈希
  const hashRegex = /-([a-f0-9]{7,40})$/
  const hashMatch = version.match(hashRegex)
  if (hashMatch) {
    result.hash = hashMatch[1]
  }

  return result
}

/**
 * 检查版本是否需要更新
 * @param currentVersion 当前版本
 * @param latestVersion 最新版本
 * @returns 是否需要更新
 */
export function needsUpdate(currentVersion: string, latestVersion: string): boolean {
  return compareVersions(currentVersion, latestVersion) < 0
}

/**
 * 获取版本更新类型
 * @param currentVersion 当前版本
 * @param latestVersion 最新版本
 * @returns 更新类型: 'major', 'minor', 'patch', 或 'none'
 */
export function getUpdateType(currentVersion: string, latestVersion: string): "major" | "minor" | "patch" | "none" {
  const current = parseVersion(currentVersion)
  const latest = parseVersion(latestVersion)

  if (!current.major || !latest.major) return "none"

  if (latest.major > current.major) return "major"
  if (latest.minor > current.minor) return "minor"
  if (latest.patch > current.patch) return "patch"
  return "none"
}
