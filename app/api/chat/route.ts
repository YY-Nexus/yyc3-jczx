import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { integrations, categories } from "@/app/data/integrations"

// 允许流式响应最多30秒
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // 获取集成应用信息用于上下文
  const integrationsInfo = integrations
    .slice(0, 20)
    .map((i) => `${i.name}: ${i.description.substring(0, 100)}...`)
    .join("\n")
  const categoriesInfo = categories.join(", ")

  // 使用AI SDK的streamText函数生成响应
  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
    system: `你是言语云³集成中心的智能助手，可以帮助用户了解各种集成应用、解决集成问题，并提供相关建议。
    
    平台上有以下集成应用类别: ${categoriesInfo}
    
    部分热门集成应用信息:
    ${integrationsInfo}
    
    请使用友好、专业的中文回答用户问题。回答应简洁明了，如果用户询问特定集成应用，可以推荐相关的应用。
    
    如果用户询问如何添加集成，请告诉他们可以在集成中心浏览并选择需要的集成，然后按照向导完成配置。
    
    你可以使用Markdown格式来美化回复，但请保持简洁。`,
  })

  return result.toDataStreamResponse()
}
