# API 文档

本文档描述了 YanYuCloud³ 集成中心系统的所有 API 接口。

---

## 基础信息

### Base URL

\`\`\`
开发环境: http://localhost:3000/api
生产环境: https://your-domain.com/api
\`\`\`

### 认证方式

\`\`\`http
Authorization: Bearer <token>
\`\`\`

### 响应格式

所有 API 响应均为 JSON 格式：

\`\`\`json
{
  "success": true,
  "data": {},
  "error": null,
  "timestamp": "2025-01-15T10:00:00Z"
}
\`\`\`

### 错误响应

\`\`\`json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": {}
  },
  "timestamp": "2025-01-15T10:00:00Z"
}
\`\`\`

### HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## AI 助手 API

### 1. 创建对话

创建新的 AI 对话会话。

**请求**

\`\`\`http
POST /api/ai-assistant/conversations
Content-Type: application/json

{
  "title": "集成推荐咨询",
  "context": {
    "industry": "金融服务",
    "companySize": "中型企业"
  }
}
\`\`\`

**响应**

\`\`\`json
{
  "success": true,
  "data": {
    "id": "conv_123456",
    "title": "集成推荐咨询",
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  }
}
\`\`\`

### 2. 发送消息

向对话发送消息并获取 AI 回复。

**请求**

\`\`\`http
POST /api/ai-assistant/conversations/{conversationId}/messages
Content-Type: application/json

{
  "content": "我需要一个数据分析工具",
  "role": "user"
}
\`\`\`

**响应（流式）**

\`\`\`
data: {"type":"token","content":"我"}
data: {"type":"token","content":"推荐"}
data: {"type":"token","content":"您"}
data: {"type":"done"}
\`\`\`

### 3. 获取对话历史

获取指定对话的消息历史。

**请求**

\`\`\`http
GET /api/ai-assistant/conversations/{conversationId}/messages
\`\`\`

**响应**

\`\`\`json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_123",
        "role": "user",
        "content": "我需要一个数据分析工具",
        "timestamp": "2025-01-15T10:00:00Z"
      },
      {
        "id": "msg_124",
        "role": "assistant",
        "content": "我推荐您使用...",
        "timestamp": "2025-01-15T10:00:05Z"
      }
    ],
    "total": 2
  }
}
\`\`\`

### 4. 获取对话列表

获取用户的所有对话。

**请求**

\`\`\`http
GET /api/ai-assistant/conversations?page=1&limit=20
\`\`\`

**响应**

\`\`\`json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "conv_123",
        "title": "集成推荐咨询",
        "lastMessage": "我推荐您使用...",
        "updatedAt": "2025-01-15T10:00:00Z"
      }
    ],
    "total": 10,
    "page": 1,
    "limit": 20
  }
}
\`\`\`

### 5. 删除对话

删除指定对话。

**请求**

\`\`\`http
DELETE /api/ai-assistant/conversations/{conversationId}
\`\`\`

**响应**

\`\`\`json
{
  "success": true,
  "data": {
    "message": "对话已删除"
  }
}
\`\`\`

### 6. 获取 AI 模型列表

获取可用的 AI 模型。

**请求**

\`\`\`http
GET /api/ai-assistant/models
\`\`\`

**响应**

\`\`\`json
{
  "success": true,
  "data": {
    "models": [
      {
        "id": "gpt-4",
        "name": "GPT-4",
        "provider": "OpenAI",
        "capabilities": ["chat", "analysis"],
        "maxTokens": 8192
      }
    ]
  }
}
\`\`\`

### 7. 获取使用统计

获取 AI 助手使用统计。

**请求**

\`\`\`http
GET /api/ai-assistant/usage?startDate=2025-01-01&endDate=2025-01-31
\`\`\`

**响应**

\`\`\`json
{
  "success": true,
  "data": {
    "totalConversations": 100,
    "totalMessages": 500,
    "totalTokens": 50000,
    "averageResponseTime": 2.5,
    "byModel": {
      "gpt-4": {
        "conversations": 80,
        "messages": 400,
        "tokens": 40000
      }
    }
  }
}
\`\`\`

---

## 集成推荐 API

### 1. 获取推荐

根据用户需求获取集成推荐。

**请求**

\`\`\`http
POST /api/recommend
Content-Type: application/json

{
  "query": "数据分析工具",
  "context": {
    "industry": "金融服务",
    "companySize": "中型企业",
    "budget": "paid"
  },
  "limit": 5
}
\`\`\`

**响应**

\`\`\`json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": "1",
        "name": "数据同步1",
        "score": 0.95,
        "reason": "最适合金融服务行业的数据分析工具",
        "category": "数据分析",
        "price": {
          "type": "paid",
          "value": 99
        }
      }
    ],
    "total": 5
  }
}
\`\`\`

---

## 版本检查 API

### 1. 检查更新

检查系统是否有新版本。

**请求**

\`\`\`http
GET /api/version/check
\`\`\`

**响应**

\`\`\`json
{
  "success": true,
  "data": {
    "currentVersion": "0.1.0",
    "latestVersion": "0.2.0",
    "hasUpdate": true,
    "releaseNotes": "新增功能...",
    "releaseDate": "2025-01-20T00:00:00Z"
  }
}
\`\`\`

---

## 错误码

| 错误码 | 说明 |
|--------|------|
| `INVALID_REQUEST` | 请求参数无效 |
| `UNAUTHORIZED` | 未授权访问 |
| `FORBIDDEN` | 禁止访问 |
| `NOT_FOUND` | 资源不存在 |
| `RATE_LIMIT_EXCEEDED` | 请求频率超限 |
| `INTERNAL_ERROR` | 服务器内部错误 |
| `AI_SERVICE_ERROR` | AI 服务错误 |
| `DATABASE_ERROR` | 数据库错误 |

---

## 请求限制

### 频率限制

| 端点 | 限制 |
|------|------|
| AI 对话 | 60 次/分钟 |
| 推荐接口 | 30 次/分钟 |
| 其他接口 | 100 次/分钟 |

### 响应头

\`\`\`http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1642248000
\`\`\`

---

## 示例代码

### JavaScript/TypeScript

\`\`\`typescript
// 创建对话
async function createConversation() {
  const response = await fetch('/api/ai-assistant/conversations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: '集成推荐咨询'
    })
  })
  
  const data = await response.json()
  return data
}

// 发送消息（流式）
async function sendMessage(conversationId: string, content: string) {
  const response = await fetch(
    `/api/ai-assistant/conversations/${conversationId}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        content,
        role: 'user'
      })
    }
  )

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader!.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6))
        console.log(data)
      }
    }
  }
}
\`\`\`

### cURL

\`\`\`bash
# 创建对话
curl -X POST https://your-domain.com/api/ai-assistant/conversations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"集成推荐咨询"}'

# 获取对话列表
curl -X GET https://your-domain.com/api/ai-assistant/conversations \
  -H "Authorization: Bearer YOUR_TOKEN"

# 发送消息
curl -X POST https://your-domain.com/api/ai-assistant/conversations/conv_123/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"content":"我需要一个数据分析工具","role":"user"}'
\`\`\`

---

## Webhook

### 配置 Webhook

\`\`\`http
POST /api/webhooks
Content-Type: application/json

{
  "url": "https://your-domain.com/webhook",
  "events": ["conversation.created", "message.sent"],
  "secret": "your_webhook_secret"
}
\`\`\`

### Webhook 事件

\`\`\`json
{
  "event": "conversation.created",
  "data": {
    "id": "conv_123",
    "title": "集成推荐咨询",
    "createdAt": "2025-01-15T10:00:00Z"
  },
  "timestamp": "2025-01-15T10:00:00Z"
}
\`\`\`

---

<div align="center">

**API 文档 v1.0 | YanYu Cloud³ Team**

</div>
