# 生产环境部署指南

## 一、部署前准备

### 1.1 环境要求

**服务器要求**:
- CPU: 2核心以上
- 内存: 4GB以上
- 磁盘: 20GB以上
- 操作系统: Linux (Ubuntu 20.04+ / CentOS 8+)

**软件要求**:
- Node.js: 18.0.0+
- npm: 9.0.0+
- Docker: 20.10+ (可选)
- Docker Compose: 2.0+ (可选)

### 1.2 环境变量配置

创建 `.env.production` 文件:

\`\`\`bash
# 应用配置
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# AI配置
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key

# 数据库配置（如果使用）
DATABASE_URL=your_database_url

# Redis配置（如果使用）
REDIS_URL=redis://localhost:6379

# 安全配置
ENCRYPTION_KEY=your_32_character_encryption_key
JWT_SECRET=your_jwt_secret_key

# 监控配置
SENTRY_DSN=your_sentry_dsn
ANALYTICS_ID=your_analytics_id
\`\`\`

---

## 二、部署方式

### 2.1 Docker部署（推荐）

#### 步骤1: 构建镜像

\`\`\`bash
# 克隆代码
git clone https://github.com/your-org/yyc3-integration-center.git
cd yyc3-integration-center

# 构建Docker镜像
docker build -t yyc3-integration-center:latest .
\`\`\`

#### 步骤2: 启动服务

\`\`\`bash
# 使用docker-compose启动
docker-compose up -d

# 查看日志
docker-compose logs -f app

# 检查健康状态
curl http://localhost:3000/api/health
\`\`\`

#### 步骤3: 配置反向代理

**Nginx配置示例**:

\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;

    # 重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL证书配置
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # 代理配置
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

    # 健康检查
    location /api/health {
        proxy_pass http://localhost:3000/api/health;
        access_log off;
    }
}
\`\`\`

### 2.2 传统部署

#### 步骤1: 安装依赖

\`\`\`bash
npm ci --only=production
\`\`\`

#### 步骤2: 构建应用

\`\`\`bash
npm run build
\`\`\`

#### 步骤3: 启动应用

\`\`\`bash
# 使用PM2管理进程
npm install -g pm2

# 启动应用
pm2 start npm --name "yyc3-integration-center" -- start

# 保存PM2配置
pm2 save

# 设置开机自启
pm2 startup
\`\`\`

---

## 三、监控与维护

### 3.1 健康检查

\`\`\`bash
# 检查应用健康状态
curl http://localhost:3000/api/health

# 预期响应
{
  "status": "healthy",
  "timestamp": "2025-01-07T10:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "database": "ok",
    "memory": "ok",
    "disk": "ok"
  }
}
\`\`\`

### 3.2 日志管理

\`\`\`bash
# Docker日志
docker-compose logs -f app

# PM2日志
pm2 logs yyc3-integration-center

# 查看错误日志
pm2 logs yyc3-integration-center --err
\`\`\`

### 3.3 性能监控

**推荐工具**:
- **Sentry**: 错误追踪
- **New Relic**: 性能监控
- **Datadog**: 全栈监控
- **Prometheus + Grafana**: 自建监控

### 3.4 备份策略

\`\`\`bash
# 数据备份脚本
#!/bin/bash
BACKUP_DIR="/backup/yyc3"
DATE=$(date +%Y%m%d_%H%M%S)

# 备份数据库
docker exec yyc3-postgres pg_dump -U postgres yyc3_db > $BACKUP_DIR/db_$DATE.sql

# 备份用户数据
tar -czf $BACKUP_DIR/data_$DATE.tar.gz /app/data

# 保留最近7天的备份
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
\`\`\`

---

## 四、故障排查

### 4.1 常见问题

**问题1: 应用无法启动**
\`\`\`bash
# 检查端口占用
lsof -i :3000

# 检查环境变量
docker-compose config

# 查看详细日志
docker-compose logs --tail=100 app
\`\`\`

**问题2: 内存不足**
\`\`\`bash
# 检查内存使用
docker stats

# 增加Node.js内存限制
NODE_OPTIONS="--max-old-space-size=4096" npm start
\`\`\`

**问题3: 数据库连接失败**
\`\`\`bash
# 测试数据库连接
docker exec -it yyc3-postgres psql -U postgres

# 检查网络连接
docker network inspect yyc3-network
\`\`\`

### 4.2 回滚策略

\`\`\`bash
# 停止当前版本
docker-compose down

# 切换到上一个版本
git checkout v1.0.0

# 重新构建和启动
docker-compose up -d --build
\`\`\`

---

## 五、安全加固

### 5.1 防火墙配置

\`\`\`bash
# 只开放必要端口
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
\`\`\`

### 5.2 SSL/TLS配置

\`\`\`bash
# 使用Let's Encrypt获取免费证书
certbot --nginx -d your-domain.com
\`\`\`

### 5.3 定期更新

\`\`\`bash
# 更新系统包
apt update && apt upgrade -y

# 更新Docker镜像
docker-compose pull
docker-compose up -d
\`\`\`

---

## 六、性能优化

### 6.1 CDN配置

- 使用Cloudflare或AWS CloudFront
- 缓存静态资源
- 启用Brotli压缩

### 6.2 数据库优化

- 添加适当的索引
- 定期清理过期数据
- 使用连接池

### 6.3 缓存策略

- Redis缓存热点数据
- 浏览器缓存静态资源
- API响应缓存

---

## 七、扩展部署

### 7.1 负载均衡

\`\`\`nginx
upstream yyc3_backend {
    least_conn;
    server app1:3000;
    server app2:3000;
    server app3:3000;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    location / {
        proxy_pass http://yyc3_backend;
    }
}
\`\`\`

### 7.2 多区域部署

- 使用DNS负载均衡
- 配置CDN加速
- 数据库主从复制

---

## 八、部署检查清单

### 上线前检查

- [ ] 环境变量配置完整
- [ ] SSL证书配置正确
- [ ] 数据库连接正常
- [ ] 健康检查端点可访问
- [ ] 日志系统正常工作
- [ ] 监控告警配置完成
- [ ] 备份策略已实施
- [ ] 防火墙规则配置
- [ ] 性能测试通过
- [ ] 安全审计完成

### 上线后验证

- [ ] 应用正常访问
- [ ] API响应正常
- [ ] 数据库读写正常
- [ ] 缓存工作正常
- [ ] 监控数据正常
- [ ] 日志记录正常
- [ ] 备份任务执行
- [ ] 告警通知正常

---

**部署支持**: support@yyc3.com  
**紧急联系**: +86-xxx-xxxx-xxxx  
**文档版本**: v1.0.0  
**更新日期**: 2025-01-07
