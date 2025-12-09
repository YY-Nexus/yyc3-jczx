import { needsUpdate, getUpdateType } from "../utils/version-utils"

// 版本信息接口
export interface VersionInfo {
  version: string
  releaseDate: string
  releaseNotes: string
  downloadUrl: string
  critical: boolean
}

// 版本检查结果接口
export interface VersionCheckResult {
  hasUpdate: boolean
  currentVersion: string
  latestVersion: VersionInfo
  updateType: "major" | "minor" | "patch" | "none"
}

// 版本检查服务
export class VersionCheckService {
  private apiUrl: string
  private lastChecked: Date | null = null
  private checkInterval: number // 毫秒

  constructor(apiUrl = "/api/version", checkInterval: number = 24 * 60 * 60 * 1000) {
    this.apiUrl = apiUrl
    this.checkInterval = checkInterval
  }

  /**
   * 检查是否有新版本
   * @param currentVersion 当前版本号
   * @param force 是否强制检查，忽略时间间隔
   * @returns 版本检查结果
   */
  async checkForUpdates(currentVersion: string, force = false): Promise<VersionCheckResult | null> {
    // 如果不是强制检查，且上次检查时间在检查间隔内，则跳过
    if (!force && this.lastChecked && Date.now() - this.lastChecked.getTime() < this.checkInterval) {
      return null
    }

    try {
      // 更新最后检查时间
      this.lastChecked = new Date()

      // 获取最新版本信息
      const latestVersion = await this.fetchLatestVersion()

      // 检查是否需要更新
      const hasUpdate = needsUpdate(currentVersion, latestVersion.version)
      const updateType = getUpdateType(currentVersion, latestVersion.version)

      return {
        hasUpdate,
        currentVersion,
        latestVersion,
        updateType,
      }
    } catch (error) {
      console.error("检查更新失败:", error)
      return null
    }
  }

  /**
   * 获取最新版本信息
   * @returns 最新版本信息
   */
  private async fetchLatestVersion(): Promise<VersionInfo> {
    try {
      // 在实际应用中，这里应该是一个真实的API调用
      // 为了演示，我们模拟一个API响应
      // const response = await fetch(this.apiUrl);
      // return await response.json();

      // 模拟API响应
      return {
        version: "1.2.0",
        releaseDate: new Date().toISOString(),
        releaseNotes: "## 新功能\n\n- 添加了版本检查功能\n- 优化了性能\n- 修复了已知问题",
        downloadUrl: "https://example.com/download",
        critical: false,
      }
    } catch (error) {
      console.error("获取最新版本信息失败:", error)
      throw error
    }
  }

  /**
   * 保存最后检查时间到本地存储
   */
  saveLastChecked(): void {
    if (this.lastChecked) {
      localStorage.setItem("version_last_checked", this.lastChecked.toISOString())
    }
  }

  /**
   * 从本地存储加载最后检查时间
   */
  loadLastChecked(): void {
    const lastChecked = localStorage.getItem("version_last_checked")
    if (lastChecked) {
      this.lastChecked = new Date(lastChecked)
    }
  }

  /**
   * 设置检查间隔
   * @param interval 间隔时间（毫秒）
   */
  setCheckInterval(interval: number): void {
    this.checkInterval = interval
    localStorage.setItem("version_check_interval", interval.toString())
  }

  /**
   * 从本地存储加载检查间隔
   */
  loadCheckInterval(): void {
    const interval = localStorage.getItem("version_check_interval")
    if (interval) {
      this.checkInterval = Number.parseInt(interval, 10)
    }
  }
}

// 创建单例实例
export const versionCheckService = new VersionCheckService()
