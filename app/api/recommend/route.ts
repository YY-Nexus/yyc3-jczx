import { integrations } from "@/app/data/integrations"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // 使用AI分析对话内容，提取关键词和需求
    const { text: analysis } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `分析以下对话内容，提取用户可能需要的集成应用类型和关键词。
      对话内容:
      ${messages}
      
      请提取5个关键词，每个关键词用逗号分隔。关键词应该与集成应用类型、功能需求或行业相关。
      只返回关键词，不要有其他内容。例如: "数据分析,营销,自动化,电子邮件,客户管理"`,
    })

    // 提取关键词
    const keywords = analysis.split(",").map((keyword) => keyword.trim().toLowerCase())

    // 基于关键词匹配集成应用
    const scoredIntegrations = integrations.map((integration) => {
      let score = 0

      // 计算每个集成应用与关键词的匹配度
      keywords.forEach((keyword) => {
        // 检查名称匹配
        if (integration.name.toLowerCase().includes(keyword)) {
          score += 3
        }

        // 检查描述匹配
        if (integration.description.toLowerCase().includes(keyword)) {
          score += 2
        }

        // 检查类别匹配
        if (integration.category.toLowerCase().includes(keyword)) {
          score += 2
        }
      })

      return { integration, score }
    })

    // 按匹配度排序并选择前5个
    const topRecommendations = scoredIntegrations
      .filter((item) => item.score > 0) // 只选择有匹配的
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item) => item.integration)

    // 如果没有匹配的推荐，返回一些随机的热门集成
    const recommendations =
      topRecommendations.length > 0
        ? topRecommendations
        : integrations
            .sort(() => 0.5 - Math.random()) // 随机排序
            .slice(0, 5)

    return Response.json({ recommendations })
  } catch (error) {
    console.error("推荐生成失败:", error)
    return Response.json({ recommendations: [] }, { status: 500 })
  }
}
