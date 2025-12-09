// Health check endpoint for monitoring and load balancers
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

interface HealthStatus {
  status: "healthy" | "unhealthy"
  timestamp: string
  uptime: number
  version: string
  environment: string
  checks: {
    database: "ok" | "error"
    memory: "ok" | "warning" | "error"
    disk: "ok" | "warning" | "error"
  }
}

export async function GET() {
  try {
    const startTime = Date.now()

    // Check memory usage
    const memoryUsage = process.memoryUsage()
    const memoryUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024)
    const memoryTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024)
    const memoryPercentage = (memoryUsedMB / memoryTotalMB) * 100

    // Determine memory status
    let memoryStatus: "ok" | "warning" | "error" = "ok"
    if (memoryPercentage > 90) {
      memoryStatus = "error"
    } else if (memoryPercentage > 75) {
      memoryStatus = "warning"
    }

    // Check database (mock check - replace with actual database check)
    const databaseStatus: "ok" | "error" = "ok"

    // Check disk (simplified check)
    const diskStatus: "ok" | "warning" | "error" = "ok"

    // Calculate uptime
    const uptime = process.uptime()

    // Determine overall health
    const isHealthy = memoryStatus !== "error" && databaseStatus === "ok"

    const healthStatus: HealthStatus = {
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: Math.round(uptime),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      checks: {
        database: databaseStatus,
        memory: memoryStatus,
        disk: diskStatus,
      },
    }

    const responseTime = Date.now() - startTime

    return NextResponse.json(
      {
        ...healthStatus,
        responseTime: `${responseTime}ms`,
        memory: {
          used: `${memoryUsedMB}MB`,
          total: `${memoryTotalMB}MB`,
          percentage: `${memoryPercentage.toFixed(2)}%`,
        },
      },
      {
        status: isHealthy ? 200 : 503,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Content-Type": "application/json",
        },
      },
    )
  }
}
