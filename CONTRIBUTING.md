# 贡献指南

感谢您对 YanYuCloud³ 集成中心系统的关注！我们欢迎所有形式的贡献，包括但不限于：

- 报告 Bug
- 提出新功能建议
- 提交代码改进
- 完善文档
- 分享使用经验

---

## 行为准则

### 我们的承诺

为了营造一个开放和友好的环境，我们承诺：

- 尊重不同的观点和经验
- 接受建设性的批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

### 不可接受的行为

- 使用性化的语言或图像
- 人身攻击或侮辱性评论
- 公开或私下骚扰
- 未经许可发布他人的私人信息
- 其他不道德或不专业的行为

---

## 如何贡献

### 报告 Bug

如果您发现了 Bug，请通过 GitHub Issues 报告，并提供以下信息:

1. **Bug 描述** - 清晰简洁地描述问题
2. **复现步骤** - 详细的复现步骤
3. **预期行为** - 您期望发生什么
4. **实际行为** - 实际发生了什么
5. **环境信息** - 操作系统、浏览器、Node.js 版本等
6. **截图** - 如果适用，添加截图帮助说明问题
7. **额外信息** - 任何其他有助于解决问题的信息

**Bug 报告模板：**

\`\`\`markdown
## Bug 描述
[清晰简洁地描述 Bug]

## 复现步骤
1. 访问 '...'
2. 点击 '...'
3. 滚动到 '...'
4. 看到错误

## 预期行为
[描述您期望发生什么]

## 实际行为
[描述实际发生了什么]

## 截图
[如果适用，添加截图]

## 环境信息
- 操作系统: [例如 macOS 13.0]
- 浏览器: [例如 Chrome 120]
- Node.js 版本: [例如 18.17.0]
- 项目版本: [例如 0.1.0]

## 额外信息
[添加任何其他有关问题的信息]
\`\`\`

### 提出新功能

如果您有新功能的想法，请通过 GitHub Issues 提出，并提供以下信息：

1. **功能描述** - 清晰描述您想要的功能
2. **使用场景** - 说明为什么需要这个功能
3. **解决方案** - 您认为应该如何实现
4. **替代方案** - 您考虑过的其他解决方案
5. **额外信息** - 任何其他相关信息

**功能请求模板：**

\`\`\`markdown
## 功能描述
[清晰简洁地描述您想要的功能]

## 使用场景
[说明为什么需要这个功能，它解决了什么问题]

## 建议的解决方案
[描述您认为应该如何实现这个功能]

## 替代方案
[描述您考虑过的其他解决方案]

## 额外信息
[添加任何其他有关功能请求的信息]
\`\`\`

### 提交代码

#### 开发环境设置

1. **Fork 仓库**

\`\`\`bash
# 在 GitHub 上 Fork 仓库
# 然后克隆到本地
git clone https://github.com/YOUR_USERNAME/yanyu-cloud-integration-center.git
cd yanyu-cloud-integration-center
\`\`\`

2. **安装依赖**

\`\`\`bash
npm install
# 或
pnpm install
\`\`\`

3. **创建分支**

\`\`\`bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
\`\`\`

4. **开发与测试**

\`\`\`bash
# 启动开发服务器
npm run dev

# 运行代码检查
npm run lint

# 运行类型检查
npm run type-check
\`\`\`

#### 代码规范

##### 命名约定

- **文件名**: 使用 kebab-case（例如：`user-profile.tsx`）
- **组件名**: 使用 PascalCase（例如：`UserProfile`）
- **函数名**: 使用 camelCase（例如：`getUserData`）
- **常量名**: 使用 UPPER_SNAKE_CASE（例如：`MAX_RETRY_COUNT`）
- **类型/接口**: 使用 PascalCase（例如：`UserData`）

##### TypeScript 规范

\`\`\`typescript
// ✅ 推荐
interface UserProfile {
  id: string
  name: string
  email: string
}

function getUserProfile(userId: string): Promise<UserProfile> {
  // 实现
}

// ❌ 不推荐
interface user_profile {
  id: any
  name: any
}

function get_user_profile(user_id: any) {
  // 实现
}
\`\`\`

##### React 组件规范

\`\`\`typescript
// ✅ 推荐 - 函数组件 + TypeScript
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  )
}

// ❌ 不推荐 - 缺少类型定义
export function Button({ label, onClick, variant }) {
  return <button onClick={onClick}>{label}</button>
}
\`\`\`

##### CSS/Tailwind 规范

\`\`\`typescript
// ✅ 推荐 - 使用语义化 Tailwind 类
<div className="bg-background text-foreground rounded-lg p-4">
  <h2 className="text-xl font-semibold mb-2">标题</h2>
  <p className="text-muted-foreground">内容</p>
</div>

// ❌ 不推荐 - 硬编码颜色
<div className="bg-white text-black rounded-lg p-4">
  <h2 className="text-xl font-semibold mb-2">标题</h2>
  <p className="text-gray-500">内容</p>
</div>
\`\`\`

##### 注释规范

\`\`\`typescript
/**
 * 获取用户资料
 * @param userId - 用户 ID
 * @returns 用户资料对象
 * @throws {Error} 当用户不存在时抛出错误
 */
async function getUserProfile(userId: string): Promise<UserProfile> {
  // 实现逻辑
}

// 单行注释使用 // 
// 多行注释使用 /* */
\`\`\`

#### 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

**Type 类型：**

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链相关
- `ci`: CI/CD 相关

**示例：**

\`\`\`bash
# 新功能
git commit -m "feat(ai-assistant): add conversation history feature"

# Bug 修复
git commit -m "fix(auth): resolve login redirect issue"

# 文档更新
git commit -m "docs(readme): update installation instructions"

# 性能优化
git commit -m "perf(integrations): optimize search algorithm"
\`\`\`

#### Pull Request 流程

1. **确保代码质量**

\`\`\`bash
# 运行代码检查
npm run lint

# 修复自动可修复的问题
npm run lint:fix

# 运行类型检查
npm run type-check
\`\`\`

2. **推送到您的 Fork**

\`\`\`bash
git push origin feature/your-feature-name
\`\`\`

3. **创建 Pull Request**

- 访问 GitHub 仓库
- 点击 "New Pull Request"
- 选择您的分支
- 填写 PR 描述

**PR 描述模板：**

\`\`\`markdown
## 变更类型
- [ ] 新功能
- [ ] Bug 修复
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化
- [ ] 其他

## 变更描述
[清晰描述您的变更]

## 相关 Issue
Closes #[issue number]

## 测试
- [ ] 本地测试通过
- [ ] 代码检查通过
- [ ] 类型检查通过

## 截图
[如果适用，添加截图]

## 检查清单
- [ ] 代码遵循项目规范
- [ ] 已添加必要的注释
- [ ] 已更新相关文档
- [ ] 变更不会引入破坏性更新
- [ ] 已测试所有变更
\`\`\`

4. **代码审查**

- 维护者会审查您的代码
- 根据反馈进行修改
- 审查通过后会合并

---

## 开发指南

### 项目结构

\`\`\`
app/
├── api/              # API 路由
├── components/       # 业务组件
├── context/          # React Context
├── services/         # 业务服务
├── integrations/     # 集成市场
└── globals.css       # 全局样式
\`\`\`

### 添加新组件

1. 在 `app/components/` 下创建组件文件
2. 使用 TypeScript 定义 Props 类型
3. 添加必要的注释
4. 导出组件

\`\`\`typescript
// app/components/example/example-component.tsx
interface ExampleComponentProps {
  title: string
  description?: string
}

/**
 * 示例组件
 * @param title - 标题
 * @param description - 描述（可选）
 */
export function ExampleComponent({ title, description }: ExampleComponentProps) {
  return (
    <div className="bg-card rounded-lg p-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  )
}
\`\`\`

### 添加新页面

1. 在 `app/` 下创建路由文件夹
2. 创建 `page.tsx` 文件
3. 可选：添加 `loading.tsx`、`error.tsx`

\`\`\`typescript
// app/example/page.tsx
export default function ExamplePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">示例页面</h1>
      {/* 页面内容 */}
    </div>
  )
}
\`\`\`

### 添加 API 路由

1. 在 `app/api/` 下创建路由文件
2. 导出 HTTP 方法处理函数

\`\`\`typescript
// app/api/example/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const data = { message: 'Hello World' }
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // 处理逻辑
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Bad Request' },
      { status: 400 }
    )
  }
}
\`\`\`

---

## 文档贡献

### 文档结构

\`\`\`
docs/
├── ARCHITECTURE.md           # 架构设计
├── API.md                    # API 文档
├── DEPLOYMENT.md             # 部署指南
├── DEVELOPMENT.md            # 开发指南
├── SECURITY.md               # 安全规范
├── PERFORMANCE.md            # 性能优化
├── ROADMAP.md                # 迭代计划
└── PRE_LAUNCH_CHECKLIST.md   # 上线检查清单
\`\`\`

### 文档规范

- 使用 Markdown 格式
- 保持结构清晰
- 添加代码示例
- 及时更新

---

## 社区

### 获取帮助

- **GitHub Issues** - 报告问题和提出建议
- **GitHub Discussions** - 讨论和交流
- **邮件** - support@yanyucloud.com

### 保持联系

- **官网** - https://yy.0379.pro
- **GitHub** - https://github.com/YY-Nexus/NetTrack

---

## 致谢

感谢所有为本项目做出贡献的开发者！

---

<div align="center">

**Made with ❤️ by YanYu Cloud³ Community**

</div>
