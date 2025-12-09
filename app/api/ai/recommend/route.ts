import { type NextRequest, NextResponse } from "next/server"
import { recommendationEngine } from "@/app/services/ai/recommendation-engine"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userProfile, context, limit, excludeIds } = body

    if (!userProfile || !userProfile.userId) {
      return NextResponse.json({ error: "Invalid user profile" }, { status: 400 })
    }

    const recommendations = await recommendationEngine.getRecommendations({
      userProfile,
      context,
      limit,
      excludeIds,
    })

    return NextResponse.json({
      recommendations,
      count: recommendations.length,
    })
  } catch (error) {
    console.error("[v0] AI recommendation error:", error)
    return NextResponse.json({ error: "Recommendation failed" }, { status: 500 })
  }
}
