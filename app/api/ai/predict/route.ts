import { type NextRequest, NextResponse } from "next/server"
import { predictiveAnalytics } from "@/app/services/ai/predictive-analytics"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, userId, category } = body

    let prediction

    switch (type) {
      case "next_action":
        if (!userId) {
          return NextResponse.json({ error: "userId required" }, { status: 400 })
        }
        prediction = await predictiveAnalytics.predictNextAction(userId)
        break

      case "churn_risk":
        if (!userId) {
          return NextResponse.json({ error: "userId required" }, { status: 400 })
        }
        prediction = await predictiveAnalytics.predictChurnRisk(userId)
        break

      case "popular_integrations":
        prediction = await predictiveAnalytics.predictPopularIntegrations(category)
        break

      case "anomalies":
        if (!userId) {
          return NextResponse.json({ error: "userId required" }, { status: 400 })
        }
        prediction = await predictiveAnalytics.detectAnomalies(userId)
        break

      case "insights":
        const insights = await predictiveAnalytics.generateInsights(userId)
        return NextResponse.json({ insights })

      default:
        return NextResponse.json({ error: "Invalid prediction type" }, { status: 400 })
    }

    return NextResponse.json({ prediction })
  } catch (error) {
    console.error("[v0] AI prediction error:", error)
    return NextResponse.json({ error: "Prediction failed" }, { status: 500 })
  }
}
