import { formatDate, getRelativeTimeString } from "@/app/utils/format-date"

describe("formatDate", () => {
  it("should format valid ISO date string", () => {
    const isoDate = "2025-05-17T14:30:00.000Z"
    const result = formatDate(isoDate)
    expect(result).toContain("2025")
    expect(result).toContain("5")
    expect(result).toContain("17")
  })

  it("should return fallback for undefined date", () => {
    const result = formatDate(undefined)
    expect(result).toBe("未知日期")
  })

  it("should return error message for invalid date", () => {
    const result = formatDate("invalid-date-string")
    expect(result).toBe("日期格式无效")
  })

  it("should format date with custom locale", () => {
    const isoDate = "2025-05-17T14:30:00.000Z"
    const result = formatDate(isoDate, "en-US")
    expect(result).toContain("2025")
  })
})

describe("getRelativeTimeString", () => {
  it("should return relative time for recent date", () => {
    const now = new Date()
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString()
    const result = getRelativeTimeString(fiveMinutesAgo)
    expect(result).toContain("分钟前")
  })

  it("should return fallback for undefined date", () => {
    const result = getRelativeTimeString(undefined)
    expect(result).toBe("未知时间")
  })

  it("should handle hours ago", () => {
    const now = new Date()
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
    const result = getRelativeTimeString(twoHoursAgo)
    expect(result).toContain("小时前")
  })

  it("should handle days ago", () => {
    const now = new Date()
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
    const result = getRelativeTimeString(threeDaysAgo)
    expect(result).toContain("天前")
  })
})
