# 代码质量规范

## 概述

本文档定义了 YanYuCloud³ DeekStack Platform 的代码质量标准和最佳实践。

## 类型安全

### TypeScript 使用规范

1. **禁止使用 `any` 类型**
   \`\`\`typescript
   // ❌ 错误
   function processData(data: any) {
     return data.value
   }

   // ✅ 正确
   interface DataType {
     value: string
   }
   function processData(data: DataType) {
     return data.value
   }
   \`\`\`

2. **使用严格的类型检查**
   \`\`\`json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true,
       "strictFunctionTypes": true
     }
   }
   \`\`\`

3. **定义明确的接口和类型**
   - 所有公共 API 必须有明确的类型定义
   - 使用 `interface` 定义对象结构
   - 使用 `type` 定义联合类型和工具类型

## 代码组织

### 文件结构

\`\`\`
app/
├── types/           # 全局类型定义
├── services/        # 业务逻辑服务
├── components/      # React 组件
├── hooks/           # 自定义 Hooks
├── utils/           # 工具函数
└── context/         # React Context
\`\`\`

### 命名规范

1. **文件命名**
   - 组件文件：`PascalCase.tsx`
   - 工具文件：`kebab-case.ts`
   - 类型文件：`index.ts` 或 `types.ts`

2. **变量命名**
   - 常量：`UPPER_SNAKE_CASE`
   - 变量：`camelCase`
   - 组件：`PascalCase`
   - 类型/接口：`PascalCase`

3. **函数命名**
   - 事件处理：`handle + 动作` (handleClick)
   - 布尔值：`is/has/should + 形容词` (isLoading)
   - 获取数据：`get/fetch + 名词` (getUserData)

## 错误处理

### 统一错误处理模式

\`\`\`typescript
// 定义错误类型
interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
  status: number
}

// 错误处理函数
function handleError(error: unknown, context: string): ApiError {
  const errorMessage = error instanceof Error ? error.message : "未知错误"
  console.error(`${context}:`, errorMessage)
  
  return {
    code: "ERROR",
    message: errorMessage,
    status: 500,
    details: { context, timestamp: new Date().toISOString() }
  }
}

// 使用示例
try {
  await riskyOperation()
} catch (error) {
  const apiError = handleError(error, "riskyOperation")
  toast({
    title: "操作失败",
    description: apiError.message,
    variant: "destructive"
  })
}
\`\`\`

### 异步错误处理

\`\`\`typescript
// 使用 async/await 和 try/catch
async function fetchData() {
  try {
    const response = await fetch("/api/data")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    return handleError(error, "fetchData")
  }
}
\`\`\`

## 性能优化

### React 性能优化

1. **使用 React.memo**
   \`\`\`typescript
   export const ExpensiveComponent = React.memo(({ data }) => {
     return <div>{/* 渲染逻辑 */}</div>
   })
   \`\`\`

2. **使用 useMemo 和 useCallback**
   \`\`\`typescript
   const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
   const memoizedCallback = useCallback(() => doSomething(a, b), [a, b])
   \`\`\`

3. **懒加载组件**
   \`\`\`typescript
   const HeavyComponent = lazy(() => import("./HeavyComponent"))
   \`\`\`

### 代码分割

\`\`\`typescript
// 路由级别的代码分割
const Dashboard = lazy(() => import("./pages/Dashboard"))
const Settings = lazy(() => import("./pages/Settings"))
\`\`\`

## 安全性

### 数据加密

1. **密码存储**
   - 使用 SHA-256 或更强的哈希算法
   - 添加盐值增强安全性
   - 永远不要明文存储密码

2. **敏感数据加密**
   - 使用 Web Crypto API
   - 实现端到端加密
   - 密钥不要硬编码

### 输入验证

\`\`\`typescript
// 验证用户输入
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 清理用户输入
function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "")
}
\`\`\`

## 测试

### 单元测试

\`\`\`typescript
describe("UserService", () => {
  it("should create a new user", async () => {
    const user = await createUser({ name: "Test", email: "test@example.com" })
    expect(user).toBeDefined()
    expect(user.email).toBe("test@example.com")
  })
})
\`\`\`

### 集成测试

\`\`\`typescript
describe("Login Flow", () => {
  it("should login successfully with valid credentials", async () => {
    const result = await login("user@example.com", "password123")
    expect(result.success).toBe(true)
  })
})
\`\`\`

## 代码审查清单

- [ ] 没有使用 `any` 类型
- [ ] 所有函数都有明确的返回类型
- [ ] 错误处理完整
- [ ] 没有硬编码的敏感信息
- [ ] 组件使用了适当的性能优化
- [ ] 代码有适当的注释
- [ ] 遵循命名规范
- [ ] 通过了所有测试
- [ ] 没有 console.log 调试代码（生产环境）
- [ ] 代码格式化正确（Prettier）

## 持续改进

1. **定期代码审查**
   - 每周进行代码审查会议
   - 使用 GitHub Pull Request 进行代码审查

2. **自动化检查**
   - 使用 ESLint 进行代码质量检查
   - 使用 TypeScript 进行类型检查
   - 使用 Prettier 进行代码格式化

3. **性能监控**
   - 使用 Lighthouse 进行性能审计
   - 监控 Core Web Vitals
   - 定期进行性能优化

## 参考资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [React 最佳实践](https://react.dev/learn)
- [Next.js 文档](https://nextjs.org/docs)
- [Web 安全最佳实践](https://owasp.org/)
