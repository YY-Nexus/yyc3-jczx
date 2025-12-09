# PWA 实施指南

## 概述

本项目已实现完整的 Progressive Web App (PWA) 功能，提供原生应用般的用户体验。

## 核心功能

### 1. Web App Manifest

配置文件位置：`public/manifest.json`

**功能特性**：
- 应用名称和图标
- 启动 URL 和显示模式
- 主题颜色
- 应用快捷方式
- 分享目标
- 屏幕截图

### 2. Service Worker

文件位置：`public/sw.js`

**缓存策略**：
- **静态资源**: Cache First（优先使用缓存）
- **API 请求**: Network Only（仅使用网络）
- **动态内容**: Network First with Cache Fallback

**支持功能**：
- 离线访问
- 后台同步
- 推送通知
- 资源预缓存

### 3. 安装提示

组件：`app/components/pwa/install-prompt.tsx`

**功能**：
- 检测安装能力
- 显示安装提示卡片
- 处理用户安装意图
- 记住用户选择

### 4. 离线指示器

组件：`app/components/pwa/offline-indicator.tsx`

**功能**：
- 实时监测网络状态
- 显示在线/离线提示
- 自动消失的通知

### 5. 更新提示

组件：`app/components/pwa/pwa-update-prompt.tsx`

**功能**：
- 检测新版本
- 提示用户更新
- 自动刷新应用

### 6. 离线页面

页面：`app/offline/page.tsx`

**功能**：
- 友好的离线提示
- 重新加载按钮
- 离线可用功能说明

## 技术实现

### Service Worker 生命周期

\`\`\`javascript
// 安装阶段 - 缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE_URLS)
    })
  )
})

// 激活阶段 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
})

// 拦截请求 - 实施缓存策略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
\`\`\`

### 注册 Service Worker

\`\`\`typescript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration.scope)
      })
      .catch((error) => {
        console.log('SW registration failed:', error)
      })
  })
}
\`\`\`

## 用户体验优化

### 1. 快速启动

- 预缓存关键资源
- App Shell 架构
- 骨架屏加载

### 2. 离线功能

- 缓存重要页面
- 提供离线提示
- 显示缓存内容

### 3. 后台同步

\`\`\`javascript
// 注册后台同步
navigator.serviceWorker.ready.then((registration) => {
  return registration.sync.register('sync-favorites')
})

// Service Worker 处理同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites())
  }
})
\`\`\`

### 4. 推送通知

\`\`\`javascript
// 订阅推送
navigator.serviceWorker.ready.then((registration) => {
  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: PUBLIC_KEY
  })
})

// 接收推送
self.addEventListener('push', (event) => {
  const data = event.data.json()
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon
  })
})
\`\`\`

## 测试

### PWA 功能测试

文件：`e2e/pwa.spec.ts`

**测试覆盖**：
- Manifest 验证
- Service Worker 注册
- 离线功能
- 安装提示

### 运行测试

\`\`\`bash
npm run test:e2e -- pwa.spec.ts
\`\`\`

## 部署清单

- [ ] 配置 HTTPS（PWA 必需）
- [ ] 验证 manifest.json
- [ ] 测试 Service Worker
- [ ] 准备应用图标（192x192, 512x512）
- [ ] 准备屏幕截图
- [ ] 配置缓存策略
- [ ] 测试离线功能
- [ ] 验证安装流程
- [ ] 测试推送通知
- [ ] 配置后台同步

## 性能指标

### Lighthouse 目标

- **Performance**: > 90
- **Accessibility**: > 90
- **Best Practices**: > 90
- **SEO**: > 90
- **PWA**: 100

### 关键指标

- **First Contentful Paint**: < 1.8s
- **Time to Interactive**: < 3.8s
- **Speed Index**: < 3.4s
- **Total Blocking Time**: < 200ms
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 浏览器兼容性

| 功能 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Web Manifest | ✅ | ✅ | ✅ | ✅ |
| Install Prompt | ✅ | ❌ | ❌ | ✅ |
| Push Notifications | ✅ | ✅ | ⚠️ | ✅ |
| Background Sync | ✅ | ❌ | ❌ | ✅ |

## 故障排查

### Service Worker 未注册

1. 检查 HTTPS 连接
2. 验证 sw.js 路径
3. 检查浏览器控制台错误

### 缓存未更新

1. 增加 CACHE_VERSION
2. 清除浏览器缓存
3. 强制刷新页面

### 离线功能异常

1. 检查缓存列表
2. 验证 fetch 事件处理
3. 测试网络连接

## 最佳实践

1. **渐进增强**: 确保基本功能在所有浏览器中可用
2. **缓存管理**: 定期清理旧缓存
3. **版本控制**: 使用版本号管理缓存
4. **错误处理**: 提供友好的错误提示
5. **性能监控**: 跟踪 PWA 性能指标
6. **用户体验**: 提供清晰的状态反馈

## 未来改进

- [ ] 添加更多缓存策略选项
- [ ] 实现智能预缓存
- [ ] 优化资源加载
- [ ] 增强离线体验
- [ ] 添加更多推送通知场景
- [ ] 实现增量更新
