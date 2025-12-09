# 测试指南

## 测试策略

本项目采用多层次测试策略，确保代码质量和功能稳定性。

### 1. 单元测试

使用 Jest 和 React Testing Library 进行单元测试。

#### 运行单元测试

\`\`\`bash
# 运行所有测试
npm run test

# 运行特定测试文件
npm run test -- format-date.test.ts

# 查看测试覆盖率
npm run test:coverage
\`\`\`

#### 测试覆盖率目标

- 分支覆盖率: 70%
- 函数覆盖率: 70%
- 行覆盖率: 80%
- 语句覆盖率: 80%

#### 单元测试示例

已实现的单元测试：
- `app/__tests__/utils/format-date.test.ts` - 日期格式化工具测试
- `app/__tests__/services/database.test.ts` - 数据库服务测试
- `app/__tests__/hooks/use-chat.test.ts` - 自定义 Hook 测试

### 2. 集成测试

集成测试验证多个模块协同工作的能力。

#### 集成测试文件

- `e2e/integration.spec.ts` - 集成流程测试
  - 完整的集成发现流程
  - 分类筛选功能
  - 收藏功能
  - 搜索功能
  - 认证流程

#### 运行集成测试

\`\`\`bash
npm run test:e2e
\`\`\`

### 3. E2E 测试

使用 Playwright 进行端到端测试。

#### E2E 测试覆盖

- **首页测试** (`e2e/example.spec.ts`)
  - 页面加载
  - Hero section 显示
  - 导航功能

- **集成页面测试** (`e2e/integration.spec.ts`)
  - 集成卡片显示
  - 详情页跳转
  - 分类筛选
  - 收藏功能

- **响应式设计测试** (`e2e/example.spec.ts`)
  - 移动端适配
  - 平板端适配

- **PWA 功能测试** (`e2e/pwa.spec.ts`)
  - Web Manifest 验证
  - Service Worker 注册
  - 离线功能
  - 安装提示

#### 运行 E2E 测试

\`\`\`bash
# 运行所有 E2E 测试
npm run test:e2e

# 在 UI 模式下运行
npm run test:e2e:ui

# 运行特定浏览器
npm run test:e2e -- --project=chromium
\`\`\`

## 测试最佳实践

### 1. 测试命名

\`\`\`typescript
describe("ComponentName", () => {
  it("should perform expected behavior", () => {
    // 测试逻辑
  })
})
\`\`\`

### 2. AAA 模式

- **Arrange**: 准备测试数据和环境
- **Act**: 执行被测试的操作
- **Assert**: 验证结果

\`\`\`typescript
it("should format date correctly", () => {
  // Arrange
  const isoDate = "2025-05-17T14:30:00.000Z"
  
  // Act
  const result = formatDate(isoDate)
  
  // Assert
  expect(result).toContain("2025")
})
\`\`\`

### 3. Mock 使用

\`\`\`typescript
// Mock fetch
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ data: "test" }),
})
\`\`\`

### 4. 异步测试

\`\`\`typescript
it("should handle async operations", async () => {
  const result = await asyncFunction()
  expect(result).toBeDefined()
})
\`\`\`

## CI/CD 集成

测试在 CI/CD 流程中自动运行：

\`\`\`yaml
# .github/workflows/ci.yml
- name: Run tests
  run: |
    npm run test:coverage
    npm run test:e2e
\`\`\`

## 问题排查

### 测试失败

1. 检查测试日志
2. 运行单个测试进行隔离
3. 检查 mock 配置
4. 验证测试环境

### 覆盖率不足

1. 识别未覆盖的代码
2. 添加针对性测试
3. 重构复杂逻辑
4. 移除无用代码

## 持续改进

- 定期审查测试覆盖率
- 更新测试用例
- 优化测试性能
- 改进测试文档
