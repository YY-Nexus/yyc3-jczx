# 监控与告警指南

## 一、监控架构

### 1.1 监控层次

\`\`\`
应用层监控
├── 性能指标（响应时间、吞吐量）
├── 错误追踪（异常、崩溃）
├── 用户行为（访问量、转化率）
└── 业务指标（集成数、活跃用户）

基础设施监控
├── 服务器资源（CPU、内存、磁盘）
├── 网络状态（带宽、延迟）
├── 容器状态（Docker、K8s）
└── 数据库性能（查询、连接）

日志监控
├── 应用日志
├── 访问日志
├── 错误日志
└── 审计日志
\`\`\`

---

## 二、性能监控

### 2.1 关键指标

**Web Vitals**:
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**API性能**:
- 响应时间: < 200ms (P95)
- 错误率: < 1%
- 可用性: > 99.9%

### 2.2 监控实现

\`\`\`typescript
// app/lib/monitoring.ts
export class PerformanceMonitor {
  // 记录页面加载性能
  static recordPageLoad() {
    if (typeof window === "undefined") return

    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming

    const metrics = {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      ttfb: navigation.responseStart - navigation.requestStart,
      download: navigation.responseEnd - navigation.responseStart,
      domInteractive: navigation.domInteractive - navigation.fetchStart,
      domComplete: navigation.domComplete - navigation.fetchStart,
      loadComplete: navigation.loadEventEnd - navigation.fetchStart,
    }

    // 发送到监控服务
    this.sendMetrics("page_load", metrics)
  }

  // 记录API调用性能
  static recordAPICall(endpoint: string, duration: number, status: number) {
    this.sendMetrics("api_call", {
      endpoint,
      duration,
      status,
      timestamp: Date.now(),
    })
  }

  // 发送指标到监控服务
  private static sendMetrics(type: string, data: any) {
    // 实现发送逻辑（如发送到Sentry、New Relic等）
    console.log(`[Monitoring] ${type}:`, data)
  }
}
\`\`\`

---

## 三、错误追踪

### 3.1 Sentry集成

\`\`\`typescript
// app/lib/sentry.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event, hint) {
    // 过滤敏感信息
    if (event.request) {
      delete event.request.cookies
      delete event.request.headers
    }
    return event
  },
})

export { Sentry }
\`\`\`

### 3.2 错误分类

**严重级别**:
- Critical: 系统崩溃、数据丢失
- High: 核心功能不可用
- Medium: 部分功能异常
- Low: UI问题、性能下降

---

## 四、日志管理

### 4.1 日志级别

\`\`\`typescript
export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  FATAL = "fatal",
}

export class Logger {
  static log(level: LogLevel, message: string, meta?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
      environment: process.env.NODE_ENV,
    }

    // 根据环境选择日志输出方式
    if (process.env.NODE_ENV === "production") {
      // 发送到日志服务（如ELK、Loki）
      this.sendToLogService(logEntry)
    } else {
      console.log(JSON.stringify(logEntry, null, 2))
    }
  }

  private static sendToLogService(entry: any) {
    // 实现日志发送逻辑
  }
}
\`\`\`

---

## 五、告警配置

### 5.1 告警规则

**性能告警**:
\`\`\`yaml
- name: high_response_time
  condition: avg(response_time) > 1000ms
  duration: 5m
  severity: warning
  action: notify_team

- name: error_rate_spike
  condition: error_rate > 5%
  duration: 2m
  severity: critical
  action: page_oncall
\`\`\`

**资源告警**:
\`\`\`yaml
- name: high_memory_usage
  condition: memory_usage > 90%
  duration: 5m
  severity: warning
  action: notify_ops

- name: disk_space_low
  condition: disk_usage > 85%
  duration: 10m
  severity: critical
  action: page_oncall
\`\`\`

### 5.2 告警通知

**通知渠道**:
- Email: 非紧急告警
- Slack/钉钉: 一般告警
- 电话/短信: 紧急告警
- PagerDuty: 值班轮换

---

## 六、仪表板

### 6.1 Grafana仪表板

**系统概览**:
- 请求量趋势
- 响应时间分布
- 错误率统计
- 资源使用情况

**业务指标**:
- 活跃用户数
- 集成安装量
- 功能使用率
- 转化漏斗

### 6.2 自定义仪表板

\`\`\`typescript
// app/admin/dashboard/page.tsx
export default function MonitoringDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="请求量"
        value="1.2M"
        change="+12%"
        trend="up"
      />
      <MetricCard
        title="响应时间"
        value="145ms"
        change="-8%"
        trend="down"
      />
      <MetricCard
        title="错误率"
        value="0.3%"
        change="-0.1%"
        trend="down"
      />
      <MetricCard
        title="可用性"
        value="99.98%"
        change="+0.02%"
        trend="up"
      />
    </div>
  )
}
\`\`\`

---

## 七、最佳实践

### 7.1 监控原则

1. **全面覆盖**: 覆盖所有关键路径
2. **及时告警**: 问题发生时立即通知
3. **可操作性**: 告警信息包含足够上下文
4. **避免噪音**: 减少误报和重复告警
5. **持续优化**: 根据反馈调整阈值

### 7.2 故障响应流程

\`\`\`
1. 告警触发
   ↓
2. 值班人员确认
   ↓
3. 初步诊断
   ↓
4. 升级或处理
   ↓
5. 问题解决
   ↓
6. 事后复盘
\`\`\`

---

**监控支持**: monitoring@yyc3.com  
**文档版本**: v1.0.0  
**更新日期**: 2025-01-07
