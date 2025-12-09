# YanYuCloud³ 集成中心系统

<div align="center">

**万象归元于云枢 | 深栈智启新纪元**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

</div>

---

## 项目简介

YanYuCloud³ 集成中心系统是一个现代化的企业级集成平台，旨在帮助企业快速连接、管理和优化各类第三方应用与服务。平台提供 1000+ 集成应用，覆盖 30+ 业务分类，支持智能推荐、自动化配置、实时监控等核心功能。

### 核心特性

- **🚀 快速集成** - 一键连接各类应用，无需复杂配置
- **🛡️ 安全可靠** - 企业级安全保障，数据传输加密处理
- **🌍 全球连接** - 支持全球各地区服务，无缝跨境协作
- **💾 数据同步** - 实时数据同步，确保信息一致性
- **🤖 AI 助手** - 智能推荐集成方案，自动化配置流程
- **📊 可视化分析** - 实时监控集成状态，数据可视化展示
- **🎨 现代化 UI** - 流畅的动画交互，响应式设计
- **🔐 数据加密** - 端到端加密，保护敏感信息

---

## 技术栈

### 前端框架
- **Next.js 16** - React 全栈框架，支持 SSR/SSG
- **React 19.2** - 最新 React 特性（useEffectEvent、Activity 组件）
- **TypeScript 5** - 类型安全的 JavaScript 超集

### UI 设计
- **Tailwind CSS v4** - 原子化 CSS 框架
- **shadcn/ui** - 高质量 React 组件库
- **Framer Motion** - 流畅的动画库
- **Lucide React** - 现代化图标库

### AI 能力
- **Vercel AI SDK** - AI 应用开发工具包
- **OpenAI GPT** - 智能对话与推荐

### 状态管理
- **React Context** - 全局状态管理
- **SWR** - 数据获取与缓存

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化

---

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 pnpm >= 8.0.0

### 安装依赖

\`\`\`bash
# 使用 npm
npm install

# 或使用 pnpm（推荐）
pnpm install
\`\`\`

### 开发环境

\`\`\`bash
npm run dev
\`\`\`

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 生产构建

\`\`\`bash
npm run build
npm run start
\`\`\`

### 代码检查

\`\`\`bash
npm run lint
\`\`\`

---

## 项目结构

\`\`\`
yanyu-cloud-integration-center/
├── app/                          # Next.js App Router
│   ├── api/                      # API 路由
│   │   ├── chat/                 # AI 对话接口
│   │   ├── ai-assistant/         # AI 助手接口
│   │   └── recommend/            # 推荐接口
│   ├── components/               # 业务组件
│   │   ├── ai-assistant/         # AI 助手组件
│   │   ├── auth/                 # 认证组件
│   │   ├── encryption/           # 加密组件
│   │   ├── favorites/            # 收藏组件
│   │   └── ui/                   # UI 组件
│   ├── context/                  # React Context
│   │   ├── auth-context.tsx      # 认证上下文
│   │   ├── encryption-context.tsx # 加密上下文
│   │   └── favorites-context.tsx # 收藏上下文
│   ├── services/                 # 业务服务
│   │   ├── ai-assistant/         # AI 助手服务
│   │   ├── encryption.ts         # 加密服务
│   │   └── cloud-sync.ts         # 云同步服务
│   ├── integrations/             # 集成市场
│   ├── marketplace/              # 应用市场
│   ├── favorites/                # 收藏页面
│   ├── admin/                    # 管理后台
│   └── globals.css               # 全局样式
├── components/                   # shadcn/ui 组件
│   └── ui/                       # UI 基础组件
├── docs/                         # 项目文档
│   ├── ARCHITECTURE.md           # 架构设计
│   ├── API.md                    # API 文档
│   ├── DEPLOYMENT.md             # 部署指南
│   ├── DEVELOPMENT.md            # 开发指南
│   ├── SECURITY.md               # 安全规范
│   ├── PERFORMANCE.md            # 性能优化
│   ├── ROADMAP.md                # 迭代计划
│   └── PRE_LAUNCH_CHECKLIST.md   # 上线检查清单
├── public/                       # 静态资源
├── .github/                      # GitHub 配置
│   └── workflows/                # CI/CD 工作流
├── package.json                  # 项目配置
├── tsconfig.json                 # TypeScript 配置
├── tailwind.config.ts            # Tailwind 配置
├── next.config.mjs               # Next.js 配置
├── README.md                     # 项目说明
├── CONTRIBUTING.md               # 贡献指南
├── CHANGELOG.md                  # 变更日志
└── LICENSE                       # 开源协议
\`\`\`

---

## 核心功能

### 1. 集成市场

- **1000+ 集成应用** - 覆盖数据分析、营销推广、效率工具等 30+ 分类
- **智能搜索** - 支持关键词、分类、标签多维度搜索
- **高级筛选** - 按价格、评分、安装量、更新时间等筛选
- **详情展示** - 完整的应用信息、评价、安装指南

### 2. AI 智能助手

- **智能推荐** - 基于业务需求推荐最佳集成方案
- **自动配置** - AI 辅助完成集成配置流程
- **对话交互** - 自然语言交互，快速解决问题
- **使用统计** - 实时监控 AI 使用情况

### 3. 用户系统

- **认证授权** - 支持邮箱登录、第三方登录
- **权限管理** - 基于角色的访问控制（RBAC）
- **数据加密** - 端到端加密，保护用户隐私
- **云端同步** - 跨设备数据同步

### 4. 收藏与订阅

- **收藏管理** - 收藏感兴趣的集成应用
- **分类订阅** - 订阅关注的业务分类
- **热度追踪** - 实时追踪分类热度变化
- **智能推送** - 基于订阅推送相关更新

### 5. 管理后台

- **环境检查** - 系统环境变量检查
- **数据统计** - 用户、集成、使用情况统计
- **日志管理** - 系统日志查看与分析
- **配置管理** - 系统配置动态调整

---

## 设计理念

### 五高原则

1. **高质量** - 代码规范、测试覆盖、文档完善
2. **高性能** - 优化加载、缓存策略、懒加载
3. **高可用** - 容错处理、监控告警、降级方案
4. **高安全** - 数据加密、权限控制、安全审计
5. **高体验** - 交互流畅、响应迅速、视觉美观

### 五标准化

1. **标准化** - 代码规范、命名约定、目录结构
2. **规范化** - 文档完整、流程清晰、接口统一
3. **模块化** - 组件解耦、可复用、易维护
4. **自动化** - CI/CD、测试自动化、部署自动化
5. **智能化** - AI 辅助、智能推荐、自动配置

---

## 部署指南

详见 [部署文档](./docs/DEPLOYMENT.md)

### Vercel 部署（推荐）

1. Fork 本仓库
2. 在 Vercel 导入项目
3. 配置环境变量
4. 点击部署

### Docker 部署

\`\`\`bash
docker build -t yanyu-cloud .
docker run -p 3000:3000 yanyu-cloud
\`\`\`

---

## 贡献指南

欢迎贡献代码、报告问题、提出建议！详见 [贡献指南](./CONTRIBUTING.md)

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 文档导航

- [架构设计](./docs/ARCHITECTURE.md) - 系统架构与技术选型
- [API 文档](./docs/API.md) - 接口定义与使用说明
- [开发指南](./docs/DEVELOPMENT.md) - 开发规范与最佳实践
- [安全规范](./docs/SECURITY.md) - 安全策略与加密方案
- [性能优化](./docs/PERFORMANCE.md) - 性能优化策略
- [迭代计划](./docs/ROADMAP.md) - 未来功能规划
- [上线检查清单](./docs/PRE_LAUNCH_CHECKLIST.md) - 上线前检查项

---

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](./LICENSE) 文件

---

## 联系我们

- **官网**: https://yy.0379.pro
- **邮箱**: support@yanyucloud.com
- **GitHub**: https://github.com/YY-Nexus/NetTrack

---

<div align="center">

**Made with ❤️ by YanYu Cloud³ Team**

</div>
