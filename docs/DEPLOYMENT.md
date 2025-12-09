# 部署指南

本文档介绍如何将 YanYuCloud³ 集成中心系统部署到不同的环境。

---

## 部署方式

### 1. Vercel 部署（推荐）

Vercel 是 Next.js 的官方部署平台，提供最佳的性能和开发体验。

#### 1.1 前置条件

- GitHub/GitLab/Bitbucket 账号
- Vercel 账号

#### 1.2 部署步骤

**方式一：通过 Vercel Dashboard**

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 导入 GitHub 仓库
4. 配置项目设置：
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
5. 配置环境变量（见下文）
6. 点击 "Deploy"

**方式二：通过 Vercel CLI**

\`\`\`bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 生产部署
vercel --prod
\`\`\`

#### 1.3 环境变量配置

在 Vercel Dashboard 的 Settings → Environment Variables 中配置：

\`\`\`env
# AI 服务
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_AI_MODEL=gpt-4

# 认证
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key

# 数据库（如果使用）
DATABASE_URL=postgresql://...

# 其他
NEXT_PUBLIC_APP_URL=https://your-domain.com
\`\`\`

#### 1.4 自定义域名

1. 在 Vercel Dashboard 进入项目设置
2. 点击 "Domains"
3. 添加自定义域名
4. 按照提示配置 DNS 记录

---

### 2. Docker 部署

#### 2.1 构建镜像

\`\`\`bash
# 构建镜像
docker build -t yanyu-cloud:latest .

# 查看镜像
docker images
\`\`\`

#### 2.2 运行容器

\`\`\`bash
# 运行容器
docker run -d \
  --name yanyu-cloud \
  -p 3000:3000 \
  -e OPENAI_API_KEY=sk-... \
  -e NEXTAUTH_SECRET=your-secret \
  yanyu-cloud:latest

# 查看日志
docker logs -f yanyu-cloud

# 停止容器
docker stop yanyu-cloud

# 删除容器
docker rm yanyu-cloud
\`\`\`

#### 2.3 Docker Compose

创建 `docker-compose.yml`：

\`\`\`yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - DATABASE_URL=${DATABASE_URL}
    restart: unless-stopped
    networks:
      - yanyu-network

networks:
  yanyu-network:
    driver: bridge
\`\`\`

运行：

\`\`\`bash
# 启动
docker-compose up -d

# 停止
docker-compose down

# 查看日志
docker-compose logs -f
\`\`\`

---

### 3. 传统服务器部署

#### 3.1 前置条件

- Node.js >= 18.0.0
- npm >= 9.0.0
- PM2（进程管理器）

#### 3.2 部署步骤

\`\`\`bash
# 1. 克隆代码
git clone https://github.com/YY-Nexus/NetTrack.git
cd NetTrack

# 2. 安装依赖
npm install

# 3. 构建项目
npm run build

# 4. 安装 PM2
npm install -g pm2

# 5. 启动应用
pm2 start npm --name "yanyu-cloud" -- start

# 6. 设置开机自启
pm2 startup
pm2 save

# 7. 查看状态
pm2 status

# 8. 查看日志
pm2 logs yanyu-cloud
\`\`\`

#### 3.3 Nginx 配置

创建 `/etc/nginx/sites-available/yanyu-cloud`：

\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
\`\`\`

启用配置：

\`\`\`bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/yanyu-cloud /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
\`\`\`

#### 3.4 SSL 证书（Let's Encrypt）

\`\`\`bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
\`\`\`

---

### 4. Kubernetes 部署

#### 4.1 创建 Deployment

创建 `k8s/deployment.yaml`：

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: yanyu-cloud
  labels:
    app: yanyu-cloud
spec:
  replicas: 3
  selector:
    matchLabels:
      app: yanyu-cloud
  template:
    metadata:
      labels:
        app: yanyu-cloud
    spec:
      containers:
      - name: yanyu-cloud
        image: yanyu-cloud:latest
        ports:
        - containerPort: 3000
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: yanyu-cloud-secrets
              key: openai-api-key
        - name: NEXTAUTH_SECRET
          valueFrom:
            secretKeyRef:
              name: yanyu-cloud-secrets
              key: nextauth-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
\`\`\`

#### 4.2 创建 Service

创建 `k8s/service.yaml`：

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: yanyu-cloud-service
spec:
  selector:
    app: yanyu-cloud
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
\`\`\`

#### 4.3 创建 Secret

\`\`\`bash
kubectl create secret generic yanyu-cloud-secrets \
  --from-literal=openai-api-key=sk-... \
  --from-literal=nextauth-secret=your-secret
\`\`\`

#### 4.4 部署

\`\`\`bash
# 应用配置
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# 查看状态
kubectl get pods
kubectl get services

# 查看日志
kubectl logs -f deployment/yanyu-cloud
\`\`\`

---

## 环境变量

### 必需变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `OPENAI_API_KEY` | OpenAI API 密钥 | `sk-...` |
| `NEXTAUTH_SECRET` | NextAuth 密钥 | `your-secret-key` |
| `NEXTAUTH_URL` | 应用 URL | `https://your-domain.com` |

### 可选变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_AI_MODEL` | AI 模型 | `gpt-4` |
| `DATABASE_URL` | 数据库连接 | - |
| `REDIS_URL` | Redis 连接 | - |
| `LOG_LEVEL` | 日志级别 | `info` |

---

## 性能优化

### 1. CDN 配置

使用 Vercel 自动配置全球 CDN，或手动配置：

\`\`\`nginx
# Nginx CDN 缓存
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
\`\`\`

### 2. 缓存策略

\`\`\`typescript
// next.config.mjs
export default {
  async headers() {
    return [
      {
        source: '/api/:path*',
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

### 3. 压缩

\`\`\`nginx
# Nginx Gzip 压缩
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
\`\`\`

---

## 监控与日志

### 1. Vercel Analytics

\`\`\`typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
\`\`\`

### 2. 日志收集

\`\`\`bash
# PM2 日志
pm2 logs yanyu-cloud

# Docker 日志
docker logs -f yanyu-cloud

# Kubernetes 日志
kubectl logs -f deployment/yanyu-cloud
\`\`\`

### 3. 健康检查

\`\`\`typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
}
\`\`\`

---

## 故障排查

### 常见问题

**1. 构建失败**

\`\`\`bash
# 清理缓存
rm -rf .next node_modules
npm install
npm run build
\`\`\`

**2. 端口占用**

\`\`\`bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>
\`\`\`

**3. 环境变量未生效**

\`\`\`bash
# 检查环境变量
printenv | grep OPENAI

# 重启应用
pm2 restart yanyu-cloud
\`\`\`

---

## 回滚策略

### Vercel 回滚

1. 访问 Vercel Dashboard
2. 进入 Deployments
3. 选择之前的部署
4. 点击 "Promote to Production"

### Docker 回滚

\`\`\`bash
# 拉取之前的镜像
docker pull yanyu-cloud:v0.1.0

# 停止当前容器
docker stop yanyu-cloud

# 启动旧版本
docker run -d --name yanyu-cloud yanyu-cloud:v0.1.0
\`\`\`

### Kubernetes 回滚

\`\`\`bash
# 查看历史
kubectl rollout history deployment/yanyu-cloud

# 回滚到上一版本
kubectl rollout undo deployment/yanyu-cloud

# 回滚到指定版本
kubectl rollout undo deployment/yanyu-cloud --to-revision=2
\`\`\`

---

<div align="center">

**部署指南 v1.0 | YanYu Cloud³ Team**

</div>
