# 性能优化文档

本文档描述 YanYuCloud³ 集成中心系统的性能优化策略和最佳实践。

---

## 性能指标

### 核心 Web Vitals

| 指标 | 目标值 | 说明 |
|------|--------|------|
| LCP (Largest Contentful Paint) | < 2.5s | 最大内容绘制时间 |
| FID (First Input Delay) | < 100ms | 首次输入延迟 |
| CLS (Cumulative Layout Shift) | < 0.1 | 累积布局偏移 |
| TTFB (Time to First Byte) | < 600ms | 首字节时间 |
| FCP (First Contentful Paint) | < 1.8s | 首次内容绘制 |
| TTI (Time to Interactive) | < 3.8s | 可交互时间 |
| INP (Interaction to Next Paint) | < 200ms | 下一次绘制交互时间 |

### 业务指标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 页面加载时间 | < 3s | 完整页面加载 |
| API 响应时间 | < 500ms | 95% 的 API 请求 |
| 首屏渲染时间 | < 1.5s | 首屏内容可见 |
| 搜索响应时间 | < 300ms | 搜索操作响应 |

---

## 前端优化

### 1. 代码分割

#### 1.1 路由级代码分割

\`\`\`typescript
// Next.js 自动进行路由级代码分割
app/
├── integrations/page.tsx    # 独立 chunk
├── marketplace/page.tsx     # 独立 chunk
└── admin/page.tsx           # 独立 chunk

// 手动代码分割配置
// next.config.mjs
export default {
  experimental: {
    granularChunks: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}
\`\`\`

#### 1.2 组件级代码分割

\`\`\`typescript
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// 动态导入重型组件
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false // 禁用服务端渲染
})

// 条件加载管理面板
const AdminPanel = dynamic(() => import('./AdminPanel'), {
  loading: () => <PanelSkeleton />,
  ssr: false
})

// 延迟加载第三方组件
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  loading: () => <CodeEditorSkeleton />,
  ssr: false
})

function Dashboard() {
  const { user } = useAuth()
  
  return (
    <div>
      <Suspense fallback={<div>加载图表...</div>}>
        <HeavyChart />
      </Suspense>
      
      {user.isAdmin && (
        <Suspense fallback={<div>加载管理面板...</div>}>
          <AdminPanel />
        </Suspense>
      )}
    </div>
  )
}
\`\`\`

#### 1.3 第三方库优化

\`\`\`typescript
// ❌ 导入整个库
import _ from 'lodash'

// ✅ 只导入需要的函数
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

// ✅ 使用 tree-shaking 友好的库
import { debounce } from 'lodash-es'

// ✅ 按需导入日期库
import { format, parseISO } from 'date-fns'

// ✅ 使用轻量级替代方案
import { clsx } from 'clsx' // 替代 classnames
import { z } from 'zod' // 替代 Joi/Yup
\`\`\`

### 2. 图片优化

#### 2.1 Next.js Image 组件

\`\`\`typescript
import Image from 'next/image'

// ✅ 优化的图片加载
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // 优先加载 - 用于首屏图片
  placeholder="blur" // 模糊占位符
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R"
  quality={85} // 图片质量
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // 响应式尺寸
  className="rounded-lg"
/>

// 远程图片优化
<Image
  src="https://example.com/image.jpg"
  alt="Remote"
  width={800}
  height={400}
  loader={({ src, width, quality }) => {
    return `https://images.weserv.nl/?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`
  }}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
\`\`\`

#### 2.2 图片格式选择

\`\`\`typescript
// 优先级：WebP > AVIF > JPEG/PNG
function OptimizedImage({ src, alt, width, height }: ImageProps) {
  return (
    <picture>
      <source 
        srcSet={`${src}?format=avif&width=${width}`} 
        type="image/avif" 
      />
      <source 
        srcSet={`${src}?format=webp&width=${width}`} 
        type="image/webp" 
      />
      <img 
        src={`${src}?width=${width}`} 
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="rounded-lg"
      />
    </picture>
  )
}
\`\`\`

#### 2.3 懒加载和占位符

\`\`\`typescript
import { useState, useRef, useEffect } from 'react'

function LazyImage({ src, alt, width, height }: ImageProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { 
        rootMargin: '100px', // 提前100px加载
        threshold: 0.1 
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div 
      ref={imgRef}
      className="relative bg-gray-100 rounded-lg"
      style={{ width, height }}
    >
      {isVisible && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } rounded-lg`}
        />
      )}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 rounded-lg w-full h-full" />
        </div>
      )}
    </div>
  )
}
\`\`\`

### 3. 字体优化

#### 3.1 Next.js 字体优化

\`\`\`typescript
// app/layout.tsx
import { Inter, Roboto_Mono, Noto_Sans_SC } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // 字体交换策略
  preload: true,
  variable: '--font-inter',
  adjustFontFallback: false,
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
  preload: false, // 非主要字体不预加载
})

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-sc',
  preload: true,
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${robotoMono.variable} ${notoSansSC.variable}`}>
      <head>
        {/* 预加载关键字体 */}
        <link
          rel="preload"
          href="/fonts/custom.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
\`\`\`

#### 3.2 CSS 字体声明优化

\`\`\`css
/* 使用 CSS 变量和字体回退 */
:root {
  --font-inter: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-roboto-mono: 'Roboto Mono', 'Courier New', monospace;
  --font-noto-sans-sc: 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
}

body {
  font-family: var(--font-inter);
  font-display: swap;
}

.code-block {
  font-family: var(--font-roboto-mono);
}

.chinese-text {
  font-family: var(--font-noto-sans-sc);
}

/* 优化字体加载行为 */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;
  font-weight: 400;
  font-style: normal;
}
\`\`\`

### 4. JavaScript 优化

#### 4.1 防抖和节流

\`\`\`typescript
import { useCallback, useRef } from 'react'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

// 防抖：搜索输入
function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query)
    }, 300),
    [onSearch]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    debouncedSearch(query)
  }

  return (
    <input
      onChange={handleChange}
      placeholder="搜索集成、API..."
      className="w-full p-2 border rounded-lg"
    />
  )
}

// 节流：滚动事件和调整大小
function ScrollHandler() {
  const throttledScroll = useCallback(
    throttle(() => {
      // 处理滚动逻辑
      const scrollY = window.scrollY
      // 虚拟滚动、懒加载等
    }, 100, { leading: true, trailing: true }),
    []
  )

  const throttledResize = useCallback(
    throttle(() => {
      // 处理调整大小逻辑
      const width = window.innerWidth
      // 响应式布局调整
    }, 250),
    []
  )

  useEffect(() => {
    window.addEventListener('scroll', throttledScroll, { passive: true })
    window.addEventListener('resize', throttledResize, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', throttledScroll)
      window.removeEventListener('resize', throttledResize)
      throttledScroll.cancel()
      throttledResize.cancel()
    }
  }, [throttledScroll, throttledResize])

  return <div>滚动和调整大小处理组件</div>
}
\`\`\`

#### 4.2 虚拟滚动

\`\`\`typescript
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useMemo } from 'react'

function VirtualizedIntegrationList({ integrations }: { integrations: any[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  // 虚拟化配置
  const virtualizer = useVirtualizer({
    count: integrations.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72, // 每项估计高度
    overscan: 10, // 上下预渲染项数
    gap: 8, // 项间距
  })

  const virtualItems = virtualizer.getVirtualItems()

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto border rounded-lg"
      style={{
        contain: 'strict', // 优化渲染性能
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => {
          const integration = integrations[virtualItem.index]
          
          return (
            <div
              key={integration.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className="px-4 border-b"
            >
              <div className="flex items-center py-3">
                <img
                  src={integration.logo}
                  alt={integration.name}
                  className="w-10 h-10 rounded-lg mr-4"
                />
                <div>
                  <h3 className="font-medium">{integration.name}</h3>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
\`\`\`

#### 4.3 Web Workers 处理重型计算

\`\`\`typescript
// workers/data-processor.ts
self.addEventListener('message', (e) => {
  const { data, type } = e.data
  
  switch (type) {
    case 'PROCESS_LARGE_DATASET':
      const result = processLargeDataset(data)
      self.postMessage({ type: 'DATASET_PROCESSED', result })
      break
      
    case 'FILTER_DATA':
      const filtered = filterData(data)
      self.postMessage({ type: 'DATA_FILTERED', filtered })
      break
      
    case 'CALCULATE_METRICS':
      const metrics = calculateMetrics(data)
      self.postMessage({ type: 'METRICS_CALCULATED', metrics })
      break
      
    default:
      console.warn('Unknown worker message type:', type)
  }
})

function processLargeDataset(data: any[]) {
  // 模拟重型数据处理
  return data.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }))
}

function filterData(data: any[]) {
  return data.filter(item => item.active)
}

function calculateMetrics(data: any[]) {
  return {
    total: data.length,
    active: data.filter(item => item.active).length,
    average: data.reduce((acc, item) => acc + item.value, 0) / data.length
  }
}
\`\`\`

\`\`\`typescript
// 使用 Worker 的组件
import { useState, useEffect, useRef } from 'react'

function DataProcessor({ data }: { data: any[] }) {
  const [processedData, setProcessedData] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const workerRef = useRef<Worker>()

  useEffect(() => {
    // 创建 Worker
    workerRef.current = new Worker(
      new URL('../workers/data-processor.ts', import.meta.url)
    )
    
    // 处理 Worker 消息
    workerRef.current.onmessage = (e) => {
      const { type, result, filtered, metrics } = e.data
      
      switch (type) {
        case 'DATASET_PROCESSED':
          setProcessedData(result)
          setIsProcessing(false)
          break
        case 'DATA_FILTERED':
          setProcessedData(filtered)
          break
        case 'METRICS_CALCULATED':
          console.log('Metrics:', metrics)
          break
      }
    }
    
    // 错误处理
    workerRef.current.onerror = (error) => {
      console.error('Worker error:', error)
      setIsProcessing(false)
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  const processData = () => {
    if (!workerRef.current) return
    
    setIsProcessing(true)
    workerRef.current.postMessage({
      type: 'PROCESS_LARGE_DATASET',
      data
    })
  }

  return (
    <div>
      <button 
        onClick={processData}
        disabled={isProcessing}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isProcessing ? '处理中...' : '处理数据'}
      </button>
      
      {isProcessing && (
        <div className="mt-4 text-sm text-gray-600">
          正在后台处理数据...
        </div>
      )}
      
      <div className="mt-4">
        {processedData.slice(0, 10).map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    </div>
  )
}
\`\`\`

### 5. CSS 和渲染优化

#### 5.1 Critical CSS 和内联样式

\`\`\`typescript
// next.config.mjs - 关键 CSS 配置
export default {
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
      ],
    },
  ],
}
\`\`\`

#### 5.2 优化 CSS-in-JS 使用

\`\`\`typescript
// ✅ 使用 Tailwind CSS（零运行时）
function OptimizedCard({ title, content }: CardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{content}</p>
    </div>
  )
}

// ✅ 使用 CSS Modules（编译时优化）
import styles from './IntegrationCard.module.css'

function IntegrationCard({ integration }: { integration: any }) {
  return (
    <div className={styles.card}>
      <img 
        src={integration.logo} 
        alt={integration.name}
        className={styles.logo}
      />
      <h3 className={styles.title}>{integration.name}</h3>
      <p className={styles.description}>{integration.description}</p>
    </div>
  )
}
\`\`\`

\`\`\`css
/* IntegrationCard.module.css */
.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: box-shadow 0.2s ease;
  contain: layout style; /* 优化渲染性能 */
}

.card:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.logo {
  width: 3rem;
  height: 3rem;
  border-radius: 0.375rem;
  object-fit: cover;
}

.title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0.5rem 0;
}

.description {
  color: #6b7280;
  line-height: 1.5;
}
\`\`\`

---

## 后端优化

### 1. 缓存策略

#### 1.1 HTTP 缓存头配置

\`\`\`typescript
// next.config.mjs - 缓存头配置
export default {
  async headers() {
    return [
      {
        source: '/api/integrations',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=120'
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, s-maxage=300'
          }
        ]
      },
      {
        source: '/api/integrations/:id',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=30, stale-while-revalidate=60'
          }
        ]
      },
      {
        source: '/api/search',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ]
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000'
          }
        ]
      }
    ]
  }
}
\`\`\`

#### 1.2 数据缓存策略

\`\`\`typescript
// lib/cache.ts - Redis 缓存实现
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export class CacheService {
  // 获取缓存数据
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  // 设置缓存数据
  async set(key: string, data: any, ttl: number = 300): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(data))
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  // 删除缓存
  async delete(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  }

  // 批量删除模式匹配的缓存
  async deletePattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } catch (error) {
      console.error('Cache delete pattern error:', error)
    }
  }
}

export const cache = new CacheService()
\`\`\`

\`\`\`typescript
// 使用 SWR 进行客户端数据缓存
import useSWR from 'swr'
import { useState, useEffect } from 'react'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('API request failed')
  }
  return res.json()
}

function IntegrationList() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/integrations',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 60秒内重复请求去重
      refreshInterval: 300000, // 5分钟自动刷新
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // 404错误不重试
        if (error.status === 404) return
        
        // 最多重试3次
        if (retryCount >= 3) return
        
        // 5秒后重试
        setTimeout(() => revalidate({ retryCount }), 5000)
      }
    }
  )

  // 手动重新验证
  const refreshData = () => {
    mutate()
  }

  if (error) return <div>加载失败</div>
  if (isLoading) return <IntegrationListSkeleton />

  return (
    <div>
      <button 
        onClick={refreshData}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        刷新数据
      </button>
      <IntegrationGrid data={data} />
    </div>
  )
}
\`\`\`

#### 1.3 静态生成和增量静态再生

\`\`\`typescript
// 静态生成页面
export const revalidate = 3600 // 1小时重新验证

export async function generateStaticParams() {
  const integrations = await getIntegrations()
  
  return integrations.map((integration) => ({
    id: integration.id.toString()
  }))
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const integration = await getIntegration(params.id)
  
  return {
    title: `${integration.name} - YanYuCloud³`,
    description: integration.description,
    openGraph: {
      title: integration.name,
      description: integration.description,
      images: [integration.logo],
    },
  }
}

export default async function IntegrationPage({ params }: { params: { id: string } }) {
  // 这会缓存1小时
  const integration = await getIntegration(params.id)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <IntegrationDetail integration={integration} />
    </div>
  )
}

// 获取集成数据的函数
async function getIntegration(id: string) {
  const cacheKey = `integration:${id}`
  
  // 尝试从缓存获取
  const cached = await cache.get(cacheKey)
  if (cached) {
    return cached
  }
  
  // 从数据库获取
  const integration = await db.integration.findUnique({
    where: { id },
    include: {
      reviews: true,
      categories: true,
      apiEndpoints: true,
    }
  })
  
  if (integration) {
    // 缓存1小时
    await cache.set(cacheKey, integration, 3600)
  }
  
  return integration
}
\`\`\`

### 2. API 优化

#### 2.1 数据预取和批量请求

\`\`\`typescript
// 预取相关数据
export async function getIntegrationData(id: string) {
  const [integration, reviews, relatedIntegrations, usageStats] = await Promise.all([
    fetchIntegration(id),
    fetchReviews(id),
    fetchRelatedIntegrations(id),
    fetchUsageStats(id)
  ])

  return {
    integration,
    reviews,
    relatedIntegrations,
    usageStats
  }
}

// API 路由处理
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await getIntegrationData(params.id)
    
    // 设置缓存头
    const headers = {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      'CDN-Cache-Control': 'public, s-maxage=300',
    }
    
    return NextResponse.json(data, { headers })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
\`\`\`

#### 2.2 分页和无限滚动

\`\`\`typescript
// API 分页实现
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''

  const skip = (page - 1) * limit

  // 构建查询条件
  const where: any = {}
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }
  
  if (category) {
    where.categories = {
      some: {
        slug: category
      }
    }
  }

  // 并行查询数据和总数
  const [integrations, totalCount] = await Promise.all([
    db.integration.findMany({
      where,
      skip,
      take: limit,
      include: {
        categories: true,
        _count: {
          select: {
            reviews: true,
            installations: true
          }
        }
      },
      orderBy: {
        popularity: 'desc'
      }
    }),
    db.integration.count({ where })
  ])

  const totalPages = Math.ceil(totalCount / limit)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  return NextResponse.json({
    data: integrations,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage,
      hasPrevPage,
    }
  })
}
\`\`\`

\`\`\`typescript
// 前端无限滚动实现
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'

function InfiniteIntegrationList() {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  })

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['integrations'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/integrations?page=${pageParam}&limit=20`)
      return res.json()
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage 
        ? lastPage.pagination.page + 1 
        : undefined
    },
    staleTime: 5 * 60 * 1000, // 5分钟
    cacheTime: 10 * 60 * 1000, // 10分钟
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  if (status === 'loading') {
    return <IntegrationListSkeleton />
  }

  if (status === 'error') {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      {data.pages.map((page, pageIndex) => (
        <div key={pageIndex} className="space-y-4">
          {page.data.map((integration: any) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>
      ))}
      
      {/* 加载更多触发元素 */}
      <div ref={ref} className="h-10 flex items-center justify-center">
        {isFetchingNextPage ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
        ) : hasNextPage ? (
          <div className="text-gray-500">加载更多...</div>
        ) : (
          <div className="text-gray-400">没有更多内容</div>
        )}
      </div>
    </div>
  )
}
\`\`\`

#### 2.3 数据库查询优化

\`\`\`typescript
// 优化的数据库查询
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

// 使用索引优化的查询
export async function getPopularIntegrations(limit: number = 10) {
  return await db.integration.findMany({
    where: {
      isActive: true,
      popularity: { gte: 80 } // 假设有 popularity 索引
    },
    take: limit,
    orderBy: [
      { popularity: 'desc' },
      { updatedAt: 'desc' }
    ],
    select: { // 只选择需要的字段
      id: true,
      name: true,
      description: true,
      logo: true,
      popularity: true,
      categories: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    }
  })
}

// 批量操作优化
export async function updateIntegrationStats(integrationIds: string[]) {
  // 使用事务确保数据一致性
  return await db.$transaction(async (tx) => {
    const stats = await tx.integration.findMany({
      where: {
        id: { in: integrationIds }
      },
      select: {
        id: true,
        _count: {
          select: {
            installations: true,
            reviews: true
          }
        }
      }
    })

    // 批量更新
    const updatePromises = stats.map(stat =>
      tx.integration.update({
        where: { id: stat.id },
        data: {
          installationCount: stat._count.installations,
          reviewCount: stat._count.reviews
        }
      })
    )

    return Promise.all(updatePromises)
  })
}
\`\`\`

### 3. 性能监控和分析

#### 3.1 性能监控集成

\`\`\`typescript
// lib/performance.ts - 性能监控工具
class PerformanceMonitor {
  private metrics: Map<string, number> = new Map()
  
  // 标记开始时间
  markStart(name: string) {
    this.metrics.set(`${name}_start`, performance.now())
  }
  
  // 标记结束时间并计算持续时间
  markEnd(name: string): number {
    const startTime = this.metrics.get(`${name}_start`)
    if (!startTime) return 0
    
    const endTime = performance.now()
    const duration = endTime - startTime
    
    // 发送到监控服务
    this.sendMetric(name, duration)
    
    return duration
  }
  
  // 发送指标到监控服务
  private sendMetric(name: string, duration: number) {
    if (process.env.NODE_ENV === 'production') {
      // 发送到监控平台
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          duration,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          path: window.location.pathname,
        }),
      }).catch(console.error)
    }
  }
  
  // 监控 Core Web Vitals
  monitorWebVitals() {
    import('web-vitals').then(({ onCLS, onFID, onLCP, onINP, onTTFB }) => {
      onCLS(console.log)
      onFID(console.log)
      onLCP(console.log)
      onINP(console.log)
      onTTFB(console.log)
    })
  }
}

export const perfMonitor = new PerformanceMonitor()
\`\`\`

\`\`\`typescript
// 在组件中使用性能监控
function OptimizedComponent() {
  useEffect(() => {
    perfMonitor.markStart('component_render')
    
    return () => {
      const duration = perfMonitor.markEnd('component_render')
      if (duration > 100) { // 如果渲染时间超过100ms
        console.warn(`组件渲染耗时: ${duration}ms`)
      }
    }
  }, [])
  
  return <div>优化组件</div>
}
\`\`\`

---

## 部署和基础设施优化

### 1. CDN 和边缘计算

\`\`\`typescript
// next.config.mjs - CDN 配置
export default {
  images: {
    domains: ['images.yanyucloud.com', 'assets.integration-platform.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600,
  },
  // 启用边缘运行时
  experimental: {
    runtime: 'edge',
  },
}
\`\`\`

### 2. 环境特定优化

\`\`\`typescript
// lib/config.ts - 环境配置
const config = {
  development: {
    cacheEnabled: false,
    analyticsEnabled: false,
    performanceMonitoring: true,
  },
  staging: {
    cacheEnabled: true,
    analyticsEnabled: true,
    performanceMonitoring: true,
  },
  production: {
    cacheEnabled: true,
    analyticsEnabled: true,
    performanceMonitoring: true,
  },
}

export const getConfig = () => {
  const env = process.env.NODE_ENV || 'development'
  return config[env as keyof typeof config]
}
\`\`\`

---

## 性能测试和监控

### 1. 自动化性能测试

\`\`\`typescript
// tests/performance.test.ts
import { test, expect } from '@playwright/test'

test.describe('性能测试', () => {
  test('首页加载性能', async ({ page }) => {
    // 开始跟踪性能
    await page.goto('/')
    
    // 检查 Core Web Vitals
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          resolve(entries[entries.length - 1].startTime)
        }).observe({ type: 'largest-contentful-paint', buffered: true })
      })
    })
    
    expect(lcp).toBeLessThan(2500) // LCP 应小于 2.5 秒
    
    // 检查首屏加载时间
    const fcp = await page.evaluate(() => {
      return performance.getEntriesByName('first-contentful-paint')[0].startTime
    })
    
    expect(fcp).toBeLessThan(1800) // FCP 应小于 1.8 秒
  })
  
  test('API 响应时间', async ({ request }) => {
    const startTime = Date.now()
    const response = await request.get('/api/integrations')
    const responseTime = Date.now() - startTime
    
    expect(responseTime).toBeLessThan(500) // API 响应应小于 500ms
    expect(response.status()).toBe(200)
  })
})
\`\`\`

### 2. 实时性能监控

\`\`\`typescript
// components/PerformanceMonitor.tsx
import { useEffect } from 'react'
import { useReportWebVitals } from 'next/web-vitals'

export function PerformanceMonitor() {
  useReportWebVitals((metric) => {
    // 发送指标到分析服务
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metric),
    }).catch(console.error)
  })

  return null
}
\`\`\`

---

## 总结

本文档提供了 YanYuCloud³ 集成中心系统的完整性能优化策略，涵盖：

1. **前端优化**：代码分割、图片优化、字体优化、JavaScript 优化
2. **后端优化**：缓存策略、API 优化、数据库查询优化
3. **性能监控**：实时监控、自动化测试、Core Web Vitals 跟踪
4. **部署优化**：CDN 配置、环境特定优化

通过实施这些优化策略，可以显著提升用户体验，确保系统在各种条件下都能提供快速、稳定的服务。
