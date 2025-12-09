# 🧪 测试指南

## 测试策略

基于"五高"原则中的**高质量**要求,我们采用全面的测试策略。

---

## 📋 测试金字塔

\`\`\`
        /\
       /  \      E2E Tests (10%)
      /____\     
     /      \    Integration Tests (20%)
    /________\   
   /          \  Unit Tests (70%)
  /__________  \
\`\`\`

---

## 🔬 单元测试

### 测试框架
- **Jest**: 测试运行器
- **React Testing Library**: 组件测试
- **@testing-library/jest-dom**: DOM 断言

### 运行测试
\`\`\`bash
# 运行所有测试
npm test

# 监听模式
npm test -- --watch

# 生成覆盖率报告
npm test -- --coverage

# 运行特定测试文件
npm test -- path/to/test.test.ts
\`\`\`

### 测试示例

#### 组件测试
\`\`\`typescript
import { render, screen } from '@testing-library/react'
import { IntegrationCard } from '@/app/components/IntegrationCard'

describe('IntegrationCard', () => {
  const mockIntegration = {
    id: '1',
    name: 'Test Integration',
    description: 'Test description',
    category: 'test',
    icon: '🧪',
    verified: true,
    rating: 4.5,
    downloads: 1000
  }

  it('renders integration name', () => {
    render(<IntegrationCard integration={mockIntegration} />)
    expect(screen.getByText('Test Integration')).toBeInTheDocument()
  })

  it('displays verified badge for verified integrations', () => {
    render(<IntegrationCard integration={mockIntegration} />)
    expect(screen.getByLabelText('Verified')).toBeInTheDocument()
  })
})
\`\`\`

#### Hook 测试
\`\`\`typescript
import { renderHook, act } from '@testing-library/react'
import { useFavorites } from '@/app/hooks/useFavorites'

describe('useFavorites', () => {
  it('adds integration to favorites', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.addFavorite('integration-1')
    })

    expect(result.current.favorites).toContain('integration-1')
  })
})
\`\`\`

#### 工具函数测试
\`\`\`typescript
import { formatNumber } from '@/app/utils/format'

describe('formatNumber', () => {
  it('formats numbers with K suffix', () => {
    expect(formatNumber(1500)).toBe('1.5K')
  })

  it('formats numbers with M suffix', () => {
    expect(formatNumber(1500000)).toBe('1.5M')
  })
})
\`\`\`

---

## 🔗 集成测试

### 测试 API 路由
\`\`\`typescript
import { GET } from '@/app/api/integrations/route'

describe('GET /api/integrations', () => {
  it('returns list of integrations', async () => {
    const request = new Request('http://localhost:3000/api/integrations')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
  })
})
\`\`\`

### 测试数据库操作
\`\`\`typescript
import { DatabaseService } from '@/app/services/database'

describe('DatabaseService', () => {
  let db: DatabaseService

  beforeEach(() => {
    db = new DatabaseService()
  })

  it('saves and retrieves favorites', async () => {
    await db.saveFavorites(['integration-1', 'integration-2'])
    const favorites = await db.getFavorites()

    expect(favorites).toEqual(['integration-1', 'integration-2'])
  })
})
\`\`\`

---

## 🎭 E2E 测试

### 测试框架
- **Playwright**: E2E 测试框架

### 运行 E2E 测试
\`\`\`bash
# 安装 Playwright
npx playwright install

# 运行所有 E2E 测试
npm run test:e2e

# 运行特定浏览器
npm run test:e2e -- --project=chromium

# 调试模式
npm run test:e2e -- --debug

# UI 模式
npm run test:e2e -- --ui
\`\`\`

### E2E 测试示例

#### 页面导航测试
\`\`\`typescript
import { test, expect } from '@playwright/test'

test('navigate to integration details', async ({ page }) => {
  await page.goto('http://localhost:3000')
  
  // 点击第一个集成卡片
  await page.click('[data-testid="integration-card"]:first-child')
  
  // 验证导航到详情页
  await expect(page).toHaveURL(/\/integrations\/.*/)
  await expect(page.locator('h1')).toBeVisible()
})
\`\`\`

#### 搜索功能测试
\`\`\`typescript
test('search integrations', async ({ page }) => {
  await page.goto('http://localhost:3000/integrations')
  
  // 输入搜索关键词
  await page.fill('[data-testid="search-input"]', 'analytics')
  
  // 等待搜索结果
  await page.waitForSelector('[data-testid="integration-card"]')
  
  // 验证搜索结果
  const cards = await page.locator('[data-testid="integration-card"]').count()
  expect(cards).toBeGreaterThan(0)
})
\`\`\`

#### 收藏功能测试
\`\`\`typescript
test('add to favorites', async ({ page }) => {
  await page.goto('http://localhost:3000/integrations')
  
  // 点击收藏按钮
  await page.click('[data-testid="favorite-button"]:first-child')
  
  // 验证收藏状态
  await expect(page.locator('[data-testid="favorite-button"]:first-child')).toHaveAttribute('data-favorited', 'true')
})
\`\`\`

---

## 📊 测试覆盖率

### 覆盖率目标
- **整体覆盖率**: > 80%
- **关键业务逻辑**: > 90%
- **工具函数**: > 95%

### 查看覆盖率报告
\`\`\`bash
# 生成覆盖率报告
npm test -- --coverage

# 在浏览器中查看详细报告
open coverage/lcov-report/index.html
\`\`\`

---

## 🎯 测试最佳实践

### 1. 测试命名
\`\`\`typescript
// ✅ 好的命名
describe('IntegrationCard', () => {
  it('displays verified badge for verified integrations', () => {})
  it('shows rating stars based on rating value', () => {})
})

// ❌ 不好的命名
describe('IntegrationCard', () => {
  it('test1', () => {})
  it('works', () => {})
})
\`\`\`

### 2. 测试隔离
\`\`\`typescript
// ✅ 每个测试独立
describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('test 1', () => {})
  it('test 2', () => {})
})
\`\`\`

### 3. 使用 data-testid
\`\`\`typescript
// ✅ 使用 data-testid
<button data-testid="favorite-button">Favorite</button>

// 测试中
screen.getByTestId('favorite-button')
\`\`\`

### 4. 避免实现细节测试
\`\`\`typescript
// ❌ 测试实现细节
expect(component.state.count).toBe(1)

// ✅ 测试用户行为
expect(screen.getByText('Count: 1')).toBeInTheDocument()
\`\`\`

### 5. Mock 外部依赖
\`\`\`typescript
// Mock API 调用
jest.mock('@/app/services/api', () => ({
  fetchIntegrations: jest.fn(() => Promise.resolve([]))
}))
\`\`\`

---

## 🔄 持续集成

### GitHub Actions
所有测试在 CI 中自动运行:
- ✅ 代码提交时运行单元测试
- ✅ PR 创建时运行集成测试
- ✅ 合并前运行 E2E 测试
- ✅ 生成覆盖率报告

### 测试失败处理
1. 查看 CI 日志
2. 本地复现问题
3. 修复并重新提交
4. 确保所有测试通过

---

## 📝 测试清单

### 新功能开发
- [ ] 编写单元测试
- [ ] 编写集成测试
- [ ] 编写 E2E 测试
- [ ] 测试覆盖率达标
- [ ] 所有测试通过

### Bug 修复
- [ ] 编写复现测试
- [ ] 修复 Bug
- [ ] 验证测试通过
- [ ] 添加回归测试

---

**最后更新**: 2025-01-04
**维护者**: YanYu Cloud³ Team
