# 安全规范文档

本文档描述 YanYuCloud³ 集成中心系统的安全策略和最佳实践。

---

## 安全架构

### 1. 多层防护体系

\`\`\`
┌─────────────────────────────────────────┐
│          用户层（客户端）                │
│  - HTTPS 加密传输                        │
│  - CSP 内容安全策略                      │
│  - XSS 防护                              │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│          应用层（Next.js）               │
│  - 认证与授权                            │
│  - 输入验证                              │
│  - CSRF 防护                             │
│  - 速率限制                              │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│          数据层                          │
│  - 数据加密                              │
│  - 访问控制                              │
│  - 审计日志                              │
└─────────────────────────────────────────┘
\`\`\`

---

## 认证与授权

### 1. 用户认证

#### 1.1 密码策略

\`\`\`typescript
// 密码强度要求
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true
}

function validatePassword(password: string): boolean {
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  return (
    password.length >= PASSWORD_REQUIREMENTS.minLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumbers &&
    hasSpecialChars
  )
}
\`\`\`

#### 1.2 密码加密

\`\`\`typescript
import bcrypt from 'bcrypt'

// 加密密码
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

// 验证密码
async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}
\`\`\`

#### 1.3 会话管理

\`\`\`typescript
// 会话配置
const SESSION_CONFIG = {
  maxAge: 24 * 60 * 60, // 24 hours
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'strict'
}

// 创建会话
function createSession(userId: string) {
  return {
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_CONFIG.maxAge * 1000
  }
}
\`\`\`

### 2. 权限控制

#### 2.1 RBAC（基于角色的访问控制）

\`\`\`typescript
// 角色定义
enum Role {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

// 权限定义
enum Permission {
  READ_INTEGRATIONS = 'read:integrations',
  WRITE_INTEGRATIONS = 'write:integrations',
  DELETE_INTEGRATIONS = 'delete:integrations',
  MANAGE_USERS = 'manage:users'
}

// 角色权限映射
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    Permission.READ_INTEGRATIONS,
    Permission.WRITE_INTEGRATIONS,
    Permission.DELETE_INTEGRATIONS,
    Permission.MANAGE_USERS
  ],
  [Role.USER]: [
    Permission.READ_INTEGRATIONS,
    Permission.WRITE_INTEGRATIONS
  ],
  [Role.GUEST]: [
    Permission.READ_INTEGRATIONS
  ]
}

// 权限检查
function hasPermission(
  user: User,
  permission: Permission
): boolean {
  const permissions = ROLE_PERMISSIONS[user.role]
  return permissions.includes(permission)
}
\`\`\`

#### 2.2 中间件保护

\`\`\`typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')
  
  // 检查认证
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // 验证 token
  try {
    const user = verifyToken(token.value)
    
    // 检查权限
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (user.role !== Role.ADMIN) {
        return NextResponse.redirect(new URL('/403', request.url))
      }
    }
    
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
}
\`\`\`

---

## 数据安全

### 1. 数据加密

#### 1.1 端到端加密

\`\`\`typescript
import crypto from 'crypto'

class EncryptionService {
  private algorithm = 'aes-256-gcm'
  private keyLength = 32
  private ivLength = 16
  private tagLength = 16

  /**
   * 加密数据
   */
  encrypt(data: string, key: string): string {
    const iv = crypto.randomBytes(this.ivLength)
    const derivedKey = this.deriveKey(key)
    
    const cipher = crypto.createCipheriv(
      this.algorithm,
      derivedKey,
      iv
    )
    
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const tag = cipher.getAuthTag()
    
    return JSON.stringify({
      iv: iv.toString('hex'),
      encrypted,
      tag: tag.toString('hex')
    })
  }

  /**
   * 解密数据
   */
  decrypt(encryptedData: string, key: string): string {
    const { iv, encrypted, tag } = JSON.parse(encryptedData)
    const derivedKey = this.deriveKey(key)
    
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      derivedKey,
      Buffer.from(iv, 'hex')
    )
    
    decipher.setAuthTag(Buffer.from(tag, 'hex'))
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }

  /**
   * 派生密钥
   */
  private deriveKey(password: string): Buffer {
    return crypto.pbkdf2Sync(
      password,
      'salt', // 实际应用中应使用随机 salt
      100000,
      this.keyLength,
      'sha256'
    )
  }
}
\`\`\`

#### 1.2 敏感数据处理

\`\`\`typescript
// 敏感字段加密
interface User {
  id: string
  email: string
  encryptedData: string // 加密的敏感数据
}

// 加密敏感数据
function encryptSensitiveData(data: any, key: string): string {
  const encryption = new EncryptionService()
  return encryption.encrypt(JSON.stringify(data), key)
}

// 解密敏感数据
function decryptSensitiveData(encrypted: string, key: string): any {
  const encryption = new EncryptionService()
  const decrypted = encryption.decrypt(encrypted, key)
  return JSON.parse(decrypted)
}
\`\`\`

### 2. 数据脱敏

\`\`\`typescript
// 邮箱脱敏
function maskEmail(email: string): string {
  const [username, domain] = email.split('@')
  const maskedUsername = username.slice(0, 2) + '***'
  return `${maskedUsername}@${domain}`
}

// 手机号脱敏
function maskPhone(phone: string): string {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 身份证脱敏
function maskIdCard(idCard: string): string {
  return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
}
\`\`\`

---

## 输入验证

### 1. 服务端验证

\`\`\`typescript
// 输入验证中间件
function validateInput(schema: any) {
  return async (request: NextRequest) => {
    try {
      const body = await request.json()
      const validated = schema.parse(body)
      return validated
    } catch (error) {
      throw new ValidationError('Invalid input')
    }
  }
}

// 使用 Zod 进行验证
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(50)
})

// API 路由中使用
export async function POST(request: NextRequest) {
  try {
    const data = await validateInput(userSchema)(request)
    // 处理验证后的数据
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid input' },
      { status: 400 }
    )
  }
}
\`\`\`

### 2. XSS 防护

\`\`\`typescript
// 自动转义（React 默认行为）
<div>{userInput}</div>

// 手动清理 HTML
import DOMPurify from 'dompurify'

function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  })
}

// 使用
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userHtml) }} />
\`\`\`

### 3. SQL 注入防护

\`\`\`typescript
// ✅ 使用参数化查询
const user = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
)

// ❌ 避免字符串拼接
const user = await db.query(
  `SELECT * FROM users WHERE email = '${email}'`
)
\`\`\`

---

## CSRF 防护

### 1. CSRF Token

\`\`\`typescript
// 生成 CSRF Token
function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// 验证 CSRF Token
function verifyCsrfToken(token: string, sessionToken: string): boolean {
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(sessionToken)
  )
}

// 中间件
export function csrfProtection(request: NextRequest) {
  if (request.method !== 'GET') {
    const token = request.headers.get('x-csrf-token')
    const sessionToken = request.cookies.get('csrf-token')?.value
    
    if (!token || !sessionToken || !verifyCsrfToken(token, sessionToken)) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }
  }
  
  return NextResponse.next()
}
\`\`\`

---

## 速率限制

### 1. API 速率限制

\`\`\`typescript
// 简单的内存速率限制器
class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private limit: number
  private window: number

  constructor(limit: number, window: number) {
    this.limit = limit
    this.window = window
  }

  check(key: string): boolean {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    
    // 清理过期请求
    const validRequests = requests.filter(
      time => now - time < this.window
    )
    
    if (validRequests.length >= this.limit) {
      return false
    }
    
    validRequests.push(now)
    this.requests.set(key, validRequests)
    
    return true
  }
}

// 使用
const limiter = new RateLimiter(60, 60000) // 60 requests per minute

export function rateLimitMiddleware(request: NextRequest) {
  const ip = request.ip || 'unknown'
  
  if (!limiter.check(ip)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }
  
  return NextResponse.next()
}
\`\`\`

---

## 安全头部

### 1. HTTP 安全头部

\`\`\`typescript
// next.config.mjs
export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  }
}
\`\`\`

### 2. Content Security Policy

\`\`\`typescript
// CSP 配置
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`

export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ]
  }
}
\`\`\`

---

## 日志与审计

### 1. 安全日志

\`\`\`typescript
// 安全事件日志
interface SecurityEvent {
  type: 'login' | 'logout' | 'failed_login' | 'permission_denied'
  userId?: string
  ip: string
  userAgent: string
  timestamp: Date
  details?: any
}

class SecurityLogger {
  log(event: SecurityEvent) {
    console.log('[SECURITY]', JSON.stringify(event))
    
    // 发送到日志服务
    // await sendToLogService(event)
  }

  logLogin(userId: string, ip: string, userAgent: string) {
    this.log({
      type: 'login',
      userId,
      ip,
      userAgent,
      timestamp: new Date()
    })
  }

  logFailedLogin(email: string, ip: string, userAgent: string) {
    this.log({
      type: 'failed_login',
      ip,
      userAgent,
      timestamp: new Date(),
      details: { email }
    })
  }
}
\`\`\`

### 2. 审计追踪

\`\`\`typescript
// 审计日志
interface AuditLog {
  action: string
  userId: string
  resourceType: string
  resourceId: string
  changes?: any
  timestamp: Date
}

class AuditLogger {
  async log(log: AuditLog) {
    // 保存到数据库
    await db.auditLogs.create(log)
  }

  async logCreate(
    userId: string,
    resourceType: string,
    resourceId: string,
    data: any
  ) {
    await this.log({
      action: 'create',
      userId,
      resourceType,
      resourceId,
      changes: data,
      timestamp: new Date()
    })
  }

  async logUpdate(
    userId: string,
    resourceType: string,
    resourceId: string,
    before: any,
    after: any
  ) {
    await this.log({
      action: 'update',
      userId,
      resourceType,
      resourceId,
      changes: { before, after },
      timestamp: new Date()
    })
  }
}
\`\`\`

---

## 安全检查清单

### 上线前检查

- [ ] 所有密码已加密存储
- [ ] 启用 HTTPS
- [ ] 配置安全头部
- [ ] 实施 CSRF 防护
- [ ] 实施 XSS 防护
- [ ] 实施 SQL 注入防护
- [ ] 配置速率限制
- [ ] 实施输入验证
- [ ] 配置 CORS 策略
- [ ] 敏感数据已加密
- [ ] 实施审计日志
- [ ] 配置错误处理
- [ ] 移除调试信息
- [ ] 更新依赖包
- [ ] 进行安全扫描

---

## 漏洞响应

### 1. 报告漏洞

如果您发现安全漏洞，请发送邮件至：security@yanyucloud.com

请包含以下信息：
- 漏洞描述
- 复现步骤
- 影响范围
- 建议修复方案

### 2. 响应流程

1. **接收报告** - 24 小时内确认收到
2. **评估影响** - 48 小时内评估严重程度
3. **修复漏洞** - 根据严重程度制定修复计划
4. **发布补丁** - 测试并发布安全补丁
5. **公开披露** - 修复后 30 天公开披露

---

<div align="center">

**安全规范 v1.0 | YanYu Cloud³ Team**

</div>
