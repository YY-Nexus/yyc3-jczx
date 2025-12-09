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
\`\`\`

#### 1.2 组件级代码分割

\`\`\`typescript
import dynamic from 'next/dynamic'

// 动态导入重型组件
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false // 禁用服务端渲染
})

// 条件加载
const AdminPanel = dynamic(() => import('./AdminPanel'), {
  loading: () => <Loading />,
  ssr: false
})

function Dashboard() {
  const { user } = useAuth()
  
  return (
    <div>
      {user.isAdmin && <AdminPanel />}
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
  priority // 优先加载
  placeholder="blur" // 模糊占位符
  blurDataURL="data:image/..." // 自定义占位符
  quality={85} // 图片质量
  sizes="(max-width: 768px) 100vw, 50vw" // 响应式尺寸
/>

// 远程图片
<Image
  src="https://example.com/image.jpg"
  alt="Remote"
  width={800}
  height={400}
  loader={({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`
  }}
/>
\`\`\`

#### 2.2 图片格式选择

\`\`\`typescript
// 优先级：WebP > AVIF > JPEG/PNG
<picture>
  <source srcSet="/image.avif" type="image/avif" />
  <source srcSet="/image.webp" type="image/webp" />
  <img src="/image.jpg" alt="Fallback" />
</picture>
\`\`\`

#### 2.3 懒加载

\`\`\`typescript
// 使用 loading="lazy"
<img
  src="/image.jpg"
  alt="Lazy"
  loading="lazy"
  decoding="async"
/>

// 使用 Intersection Observer
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '50px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : '/placeholder.jpg'}
      alt={alt}
    />
  )
}
\`\`\`

### 3. 字体优化

#### 3.1 Next.js 字体优化

\`\`\`typescript
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // 字体交换策略
  preload: true,
  variable: '--font-inter'
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono'
})

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
\`\`\`

#### 3.2 字体子集化

\`\`\`typescript
// 只加载需要的字符
const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  preload: true
})
\`\`\`

### 4. JavaScript 优化

#### 4.1 防抖和节流

\`\`\`typescript
import { useCallback } from 'react'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

// 防抖：搜索输入
function SearchBar() {
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      // 执行搜索
    }, 300),
    []
  )

  return (
    <input
      onChange={(e) => debouncedSearch(e.target.value)}
      placeholder="搜索..."
    />
  )
}

// 节流：滚动事件
function ScrollHandler() {
  const throttledScroll = useCallback(
    throttle(() => {
      // 处理滚动
    }, 100),
    []
  )

  useEffect(() => {
    window.addEventListener('scroll', throttledScroll)
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [throttledScroll])

  return <div>...</div>
}
\`\`\`

#### 4.2 虚拟滚动

\`\`\`typescript
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }: { items: any[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5
  })

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative'
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  )
}
\`\`\`

#### 4.3 Web Workers

\`\`\`typescript
// worker.ts
self.addEventListener('message', (e) => {
  const result = heavyComputation(e.data)
  self.postMessage(result)
})

// 使用 Worker
function HeavyComponent() {
  const [result, setResult] = useState(null)

  useEffect(() => {
    const worker = new Worker(new URL('./worker.ts', import.meta.url))
    
    worker.postMessage(data)
    
    worker.onmessage = (e) => {
      setResult(e.data)
    }

    return () => worker.terminate()
  }, [])

  return <div>{result}</div>
}
\`\`\`

### 5. CSS 优化

#### 5.1 Critical CSS

\`\`\`typescript
// next.config.mjs
export default {
  experimental: {
    optimizeCss: true
  }
}
\`\`\`

#### 5.2 CSS-in-JS 优化

\`\`\`typescript
// ✅ 使用 Tailwind CSS（零运行时）
<div className="bg-primary text-white p-4 rounded-lg">
  内容
</div>

// ❌ 避免运行时 CSS-in-JS
const StyledDiv = styled.div`
  background: ${props => props.theme.primary};
  color: white;
  padding: 1rem;
`
\`\`\`

---

## 后端优化

### 1. 缓存策略

#### 1.1 HTTP 缓存

\`\`\`typescript
// next.config.mjs
export default {
  async headers() {
    return [
      {
        source: '/api/integrations',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=120'
          }
        ]
      }
    ]
  }
}
\`\`\`

#### 1.2 数据缓存

\`\`\`typescript
// 使用 SWR 缓存
import useSWR from 'swr'

function IntegrationList() {
  const { data, error } = useSWR(
    '/api/integrations',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 60 seconds
      refreshInterval: 300000 // 5 minutes
    }
  )

  return <List data={data} />
}
\`\`\`

#### 1.3 静态生成

\`\`\`typescript
// 静态生成页面
export const revalidate = 3600 // 1 hour

export async function generateStaticParams() {
  const integrations = await getIntegrations()
  
  return integrations.map((integration) => ({
    id: integration.id
  }))
}

export default async function IntegrationPage({ params }) {
  const integration = await getIntegration(params.id)
  return <IntegrationDetail integration={integration} />
}
\`\`\`

### 2. API 优化

#### 2.1 数据预取

\`\`\`typescript
// 预取相关数据
export async function getIntegration(id: string) {
  const [integration, reviews, relatedIntegrations] = await Promise.all([
    fetchIntegration(id),
    fetchReviews(id),
    fetchRelatedIntegrations(id)
  ])

  return {
    integration,
    reviews,
    relatedIntegrations
  }
}
\`\`\`

#### 2.2 分页

\`\`\`typescript
// API 分页
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(search
