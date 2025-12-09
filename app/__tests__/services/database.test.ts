import { handleDbError, isDatabaseAvailable, safeDbOperation } from "@/app/services/database"
import { jest } from "@jest/globals"

describe("Database Service", () => {
  describe("handleDbError", () => {
    it("should format error with message", () => {
      const error = new Error("Connection failed")
      const result = handleDbError(error, "testOperation")

      expect(result.code).toBe("DB_ERROR")
      expect(result.message).toContain("Connection failed")
      expect(result.status).toBe(500)
      expect(result.details?.operation).toBe("testOperation")
    })

    it("should handle unknown error types", () => {
      const result = handleDbError("string error", "testOperation")

      expect(result.message).toContain("未知错误")
      expect(result.status).toBe(500)
    })

    it("should include error code when available", () => {
      const errorWithCode = Object.assign(new Error("Test error"), { code: "CUSTOM_CODE" })
      const result = handleDbError(errorWithCode, "testOperation")

      expect(result.code).toBe("CUSTOM_CODE")
    })
  })

  describe("isDatabaseAvailable", () => {
    it("should return false for mock database", () => {
      expect(isDatabaseAvailable()).toBe(false)
    })
  })

  describe("safeDbOperation", () => {
    it("should return success for successful operation", async () => {
      const mockCallback = jest.fn().mockResolvedValue({ id: 1, name: "test" })
      const result = await safeDbOperation("testOp", mockCallback)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({ id: 1, name: "test" })
      }
    })

    it("should return error for failed operation", async () => {
      const mockCallback = jest.fn().mockRejectedValue(new Error("Operation failed"))
      const result = await safeDbOperation("testOp", mockCallback)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.message).toContain("Operation failed")
      }
    })

    it("should call callback function", async () => {
      const mockCallback = jest.fn().mockResolvedValue("data")
      await safeDbOperation("testOp", mockCallback)

      expect(mockCallback).toHaveBeenCalledTimes(1)
    })
  })
})
