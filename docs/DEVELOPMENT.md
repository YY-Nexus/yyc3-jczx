# 开发指南

本文档提供 YanYuCloud³ 集成中心系统的开发规范和最佳实践。

---

## 开发环境设置

### 1. 系统要求

- **操作系统**: macOS, Linux, Windows (WSL2)
- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 或 pnpm >= 8.0.0
- **Git**: >= 2.30.0
- **编辑器**: VS Code (推荐)

### 2. 安装依赖

\`\`\`bash
# 克隆仓库
git clone https://github.com/YY-Nexus/NetTrack.git
cd NetTrack

# 安装依赖
npm install
# 或使用 pnpm（推荐）
pnpm install
\`\`\`

### 3. 配置环境变量

创建 `.env.local` 文件：

\`\`\`env
# AI 服务
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_AI_MODEL=gpt-4

# 开发环境
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 4. 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

访问 [http://localhost:3000](http://localhost:3000)

---

## 项目结构

\`\`\`
yanyu-cloud-integration-center/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # 路由组：营销页面
│   ├── api/                      # API 路由
│   ├── components/               # 业务组件
│   ├── context/                  # React Context
│   ├── services/                 # 业务服务
│   ├── integrations/             # 集成市场
│   ├── marketplace/              # 应用市场
│   ├── favorites/                # 收藏页面
│   ├── admin/                    # 管理后台
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 首页
│   └── globals.css               # 全局样式
├── components/                   # shadcn/ui 组件
│   └── ui/                       # UI 基础组件
├── docs/                         # 项目文档
├── public/                       # 静态资源
├── .github/                      # GitHub 配置
├── package.json                  # 项目配置
├── tsconfig.json                 # TypeScript 配置
├── tailwind.config.ts            # Tailwind 配置
└── next.config.mjs               # Next.js 配置
\`\`\`

---

## 开发规范

### 1. 代码风格

#### 1.1 命名约定

\`\`\`typescript
// ✅ 文件名：kebab-case
user-profile.tsx
integration-card.tsx

// ✅ 组件名：PascalCase
export function UserProfile() {}
export function IntegrationCard() {}

// ✅ 函数名：camelCase
function getUserData() {}
function handleClick() {}

// ✅ 常量名：UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3
const API_BASE_URL = 'https://api.example.com'

// ✅ 类型/接口：PascalCase
interface UserData {}
type IntegrationConfig = {}
\`\`\`

#### 1.2 TypeScript 规范

\`\`\`typescript
// ✅ 推荐：明确的类型定义
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export function Button({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false 
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  )
}

// ❌ 不推荐：缺少类型定义
export function Button({ label, onClick, variant }) {
  return <button onClick={onClick}>{label}</button>
}
\`\`\`

#### 1.3 React 组件规范

\`\`\`typescript
// ✅ 推荐：函数组件 + TypeScript + 解构
interface CardProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function Card({ title, description, children }: CardProps) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {children}
    </div>
  )
}

// ❌ 不推荐：类组件
class Card extends React.Component {
  render() {
    return <div>{this.props.title}</div>
  }
}
\`\`\`

### 2. 组件开发

#### 2.1 组件结构

\`\`\`typescript
// 1. 导入
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// 2. 类型定义
interface ComponentProps {
  // props 定义
}

// 3. 组件实现
export function Component({ ...props }: ComponentProps) {
  // 3.1 Hooks
  const [state, setState] = useState()
  
  // 3.2 副作用
  useEffect(() => {
    // 副作用逻辑
  }, [])
  
  // 3.3 事件处理
  const handleClick = () => {
    // 处理逻辑
  }
  
  // 3.4 渲染
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
\`\`\`

#### 2.2 组件拆分

\`\`\`typescript
// ❌ 不推荐：单一大组件
export function IntegrationPage() {
  return (
    <div>
      {/* 搜索栏 */}
      <div>...</div>
      {/* 筛选器 */}
      <div>...</div>
      {/* 列表 */}
      <div>...</div>
      {/* 分页 */}
      <div>...</div>
    </div>
  )
}

// ✅ 推荐：拆分为多个组件
export function IntegrationPage() {
  return (
    <div>
      <SearchBar />
      <FilterPanel />
      <IntegrationList />
      <Pagination />
    </div>
  )
}
\`\`\`

### 3. 样式规范

#### 3.1 Tailwind CSS

\`\`\`typescript
// ✅ 推荐：使用语义化设计 token
<div className="bg-background text-foreground">
  <h1 className="text-primary">标题</h1>
  <p className="text-muted-foreground">描述</p>
</div>

// ❌ 不推荐：硬编码颜色
<div className="bg-white text-black">
  <h1 className="text-blue-600">标题</h1>
  <p className="text-gray-500">描述</p>
</div>
\`\`\`

#### 3.2 条件样式

\`\`\`typescript
// ✅ 推荐：使用 cn 工具函数
import { cn } from '@/lib/utils'

<button
  className={cn(
    "btn",
    variant === 'primary' && "btn-primary",
    variant === 'secondary' && "btn-secondary",
    disabled && "opacity-50 cursor-not-allowed"
  )}
>
  按钮
</button>

// ❌ 不推荐：字符串拼接
<button
  className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} ${disabled ? 'opacity-50' : ''}`}
>
  按钮
</button>
\`\`\`

### 4. 状态管理

#### 4.1 本地状态

\`\`\`typescript
// ✅ 简单状态使用 useState
const [count, setCount] = useState(0)

// ✅ 复杂状态使用 useReducer
const [state, dispatch] = useReducer(reducer, initialState)
\`\`\`

#### 4.2 全局状态

\`\`\`typescript
// ✅ 使用 Context
const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
\`\`\`

#### 4.3 服务端状态

\`\`\`typescript
// ✅ 使用 SWR
import useSWR from 'swr'

function IntegrationList() {
  const { data, error, isLoading } = useSWR(
    '/api/integrations',
    fetcher
  )
  
  if (isLoading) return <Loading />
  if (error) return <Error />
  
  return <List data={data} />
}
\`\`\`

### 5. API 开发

#### 5.1 路由处理器

\`\`\`typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    // 业务逻辑
    const data = await fetchData(id)
    
    // 返回响应
    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const body = await request.json()
    
    // 验证数据
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }
    
    // 业务逻辑
    const result = await createData(body)
    
    return NextResponse.json({
      success: true,
      data: result
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
\`\`\`

#### 5.2 错误处理

\`\`\`typescript
// app/api/middleware/error-handler.ts
export function handleApiError(error: unknown) {
  if (error instanceof ValidationError) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
  
  if (error instanceof AuthError) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  console.error('API Error:', error)
  return NextResponse.json(
    { error: 'Internal Server Error' },
    { status: 500 }
  )
}
\`\`\`

### 6. 测试

#### 6.1 单元测试

\`\`\`typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  it('can be disabled', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDisabled()
  })
})
\`\`\`

#### 6.2 集成测试

\`\`\`typescript
// __tests__/api/integrations.test.ts
import { GET } from '@/app/api/integrations/route'

describe('/api/integrations', () => {
  it('returns integrations list', async () => {
    const request = new Request('http://localhost:3000/api/integrations')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })
})
\`\`\`

---

## 最佳实践

### 1. 性能优化

#### 1.1 代码分割

\`\`\`typescript
// ✅ 动态导入
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false
})
\`\`\`

#### 1.2 图片优化

\`\`\`typescript
// ✅ 使用 Next.js Image 组件
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={50}
  priority
  placeholder="blur"
/>
\`\`\`

#### 1.3 缓存策略

\`\`\`typescript
// ✅ SWR 缓存配置
const { data } = useSWR('/api/data', fetcher, {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 60000
})
\`\`\`

### 2. 安全实践

#### 2.1 输入验证

\`\`\`typescript
// ✅ 验证用户输入
function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// ✅ 清理 HTML
import DOMPurify from 'dompurify'
const clean = DOMPurify.sanitize(dirty)
\`\`\`

#### 2.2 环境变量

\`\`\`typescript
// ✅ 服务端环境变量
const apiKey = process.env.OPENAI_API_KEY

// ✅ 客户端环境变量（必须以 NEXT_PUBLIC_ 开头）
const appUrl = process.env.NEXT_PUBLIC_APP_URL
\`\`\`

### 3. 可访问性

\`\`\`typescript
// ✅ 语义化 HTML
<button aria-label="关闭对话框" onClick={handleClose}>
  <X className="h-4 w-4" />
</button>

// ✅ 键盘导航
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
  可点击元素
</div>
\`\`\`

---

## 调试技巧

### 1. 浏览器调试

\`\`\`typescript
// 使用 console.log
console.log('[v0] User data:', userData)

// 使用 debugger
function handleClick() {
  debugger // 断点
  // 代码逻辑
}
\`\`\`

### 2. React DevTools

- 安装 React DevTools 浏览器扩展
- 检查组件树
- 查看 Props 和 State
- 分析性能

### 3. Network 调试

- 打开浏览器开发者工具
- 切换到 Network 标签
- 查看 API 请求和响应
- 检查请求头和响应头

---

## Git 工作流

### 1. 分支策略

\`\`\`
main          # 生产分支
├── develop   # 开发分支
├── feature/* # 功能分支
├── fix/*     # 修复分支
└── hotfix/*  # 热修复分支
\`\`\`

### 2. 提交规范

\`\`\`bash
# 功能开发
git checkout -b feature/user-authentication
git commit -m "feat(auth): add user login functionality"

# Bug 修复
git checkout -b fix/login-redirect
git commit -m "fix(auth): resolve login redirect issue"

# 文档更新
git commit -m "docs(readme): update installation instructions"
\`\`\`

### 3. Pull Request

1. 创建功能分支
2. 完成开发和测试
3. 推送到远程仓库
4. 创建 Pull Request
5. 代码审查
6. 合并到主分支

---

## 常见问题

### 1. 端口占用

\`\`\`bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>

# 或使用不同端口
PORT=3001 npm run dev
\`\`\`

### 2. 依赖问题

\`\`\`bash
# 清理缓存
rm -rf node_modules .next
npm install

# 或使用 pnpm
pnpm install --force
\`\`\`

### 3. 类型错误

\`\`\`bash
# 运行类型检查
npm run type-check

# 查看详细错误
tsc --noEmit
\`\`\`

---

<div align="center">

**开发指南 v1.0 | YanYu Cloud³ Team**

</div>
