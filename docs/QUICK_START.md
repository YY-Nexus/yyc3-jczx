# ⚡ 快速开始指南

5 分钟快速上手 YanYuCloud³ DeekStack Platform！

---

## 🎯 前置要求

确保你的开发环境满足以下要求：

- ✅ Node.js >= 18.0.0
- ✅ npm >= 9.0.0 或 yarn >= 1.22.0
- ✅ Git

---

## 📦 安装步骤

### 1. 克隆项目

\`\`\`bash
git clone https://github.com/your-org/deekstack-platform.git
cd deekstack-platform
\`\`\`

### 2. 安装依赖

\`\`\`bash
npm install
# 或
yarn install
\`\`\`

### 3. 配置环境变量

\`\`\`bash
cp .env.example .env.local
\`\`\`

编辑 `.env.local` 文件，配置必要的环境变量。

### 4. 启动开发服务器

\`\`\`bash
npm run dev
# 或
yarn dev
\`\`\`

### 5. 访问应用

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

---

## 🎨 项目结构

\`\`\`
deekstack-platform/
├── app/                    # Next.js App Router
│   ├── components/         # React 组件
│   ├── data/              # 数据文件
│   ├── services/          # 业务逻辑
│   ├── utils/             # 工具函数
│   └── page.tsx           # 首页
├── docs/                  # 文档
├── public/                # 静态资源
├── e2e/                   # E2E 测试
└── package.json           # 项目配置
\`\`\`

---

## 🚀 常用命令

\`\`\`bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run start            # 启动生产服务器

# 代码质量
npm run lint             # 运行 ESLint
npm run format           # 格式化代码
npm run type-check       # TypeScript 类型检查

# 测试
npm test                 # 运行单元测试
npm run test:e2e         # 运行 E2E 测试
npm run test:coverage    # 生成测试覆盖率报告
\`\`\`

---

## 📚 下一步

- 📖 阅读 [完整文档](./DOCUMENTATION_INDEX.md)
- 🏗️ 了解 [系统架构](./ARCHITECTURE.md)
- 🤝 查看 [贡献指南](../CONTRIBUTING.md)
- 🗺️ 查看 [产品路线图](./ROADMAP.md)

---

## 💡 提示

- 使用 `npm run validate` 在提交前验证代码
- 查看 [开发指南](./DEVELOPMENT.md) 了解更多开发技巧
- 遇到问题？查看 [FAQ](../README.md#常见问题) 或提交 Issue

---

**祝你开发愉快！** 🎉
