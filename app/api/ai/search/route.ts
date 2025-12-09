import { type NextRequest, NextResponse } from "next/server"
import { intelligentSearch } from "@/app/services/ai/intelligent-search"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, filters, limit, useSemanticSearch } = body

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 })
    }

    const results = await intelligentSearch.search({
      query,
      filters,
      limit,
      useSemanticSearch: useSemanticSearch || false,
    })

    return NextResponse.json({
      results,
      count: results.length,
      query,
    })
  } catch (error) {
    console.error("[v0] AI search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
