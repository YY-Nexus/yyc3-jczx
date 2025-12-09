import { renderHook, act, waitFor } from "@testing-library/react"
import { useChat } from "@/app/hooks/use-chat"
import jest from "jest"

// Mock fetch
global.fetch = jest.fn()

describe("useChat hook", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should initialize with empty messages", () => {
    const { result } = renderHook(() => useChat({ api: "/api/chat" }))

    expect(result.current.messages).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeUndefined()
  })

  it("should send message and update state", async () => {
    const mockResponse = {
      ok: true,
      body: {
        getReader: () => ({
          read: jest
            .fn()
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode('data: {"content": "Hello"}\n\n'),
            })
            .mockResolvedValueOnce({ done: true }),
        }),
      },
    }
    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useChat({ api: "/api/chat" }))

    await act(async () => {
      await result.current.append({ role: "user", content: "Hi" })
    })

    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(0)
    })
  })

  it("should handle fetch errors", async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"))

    const { result } = renderHook(() => useChat({ api: "/api/chat" }))

    await act(async () => {
      await result.current.append({ role: "user", content: "Hi" })
    })

    await waitFor(() => {
      expect(result.current.error).toBeDefined()
      expect(result.current.error?.message).toContain("Network error")
    })
  })

  it("should reload conversation", async () => {
    const { result } = renderHook(() => useChat({ api: "/api/chat" }))

    await act(async () => {
      await result.current.append({ role: "user", content: "First message" })
    })

    act(() => {
      result.current.reload()
    })

    expect(result.current.messages).toEqual([])
  })
})
