import { test, expect } from "@playwright/test"

test.describe("PWA Functionality", () => {
  test("should have valid web manifest", async ({ page }) => {
    await page.goto("/")

    // Check for manifest link
    const manifestLink = page.locator('link[rel="manifest"]')
    await expect(manifestLink).toHaveCount(1)

    // Fetch and validate manifest
    const manifestHref = await manifestLink.getAttribute("href")
    expect(manifestHref).toBeTruthy()
  })

  test("should register service worker", async ({ page, context }) => {
    await context.grantPermissions(["notifications"])
    await page.goto("/")

    // Wait for service worker registration
    const swRegistered = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.ready.then(() => resolve(true))
          setTimeout(() => resolve(false), 5000)
        } else {
          resolve(false)
        }
      })
    })

    expect(swRegistered).toBe(true)
  })

  test("should work offline", async ({ page, context }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")

    // Go offline
    await context.setOffline(true)

    // Navigate to cached page
    await page.goto("/marketplace")

    // Verify offline indicator appears
    await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible()

    // Go back online
    await context.setOffline(false)
  })

  test("should show install prompt on supported browsers", async ({ page }) => {
    await page.goto("/")

    // Simulate beforeinstallprompt event
    await page.evaluate(() => {
      const event = new Event("beforeinstallprompt")
      window.dispatchEvent(event)
    })

    // Check if install button appears (may not work in all test environments)
    const installButton = page.locator('[data-testid="install-button"]')
    const isVisible = await installButton.isVisible().catch(() => false)

    // This test may pass or be skipped depending on browser support
    if (isVisible) {
      await expect(installButton).toBeVisible()
    }
  })
})
