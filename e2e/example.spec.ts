import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("should load successfully", async ({ page }) => {
    await page.goto("/")

    // Check if the page title is correct
    await expect(page).toHaveTitle(/YanYuCloud³ DeekStack Platform/i)
  })

  test("should display hero section", async ({ page }) => {
    await page.goto("/")

    // Check for hero content
    const hero = page.locator("h1").first()
    await expect(hero).toBeVisible()
  })

  test("should navigate to integrations page", async ({ page }) => {
    await page.goto("/")

    // Click on integrations link
    await page.click("text=集成市场")

    // Verify navigation
    await expect(page).toHaveURL(/\/integrations/)
  })
})

test.describe("Integrations Page", () => {
  test("should display integration cards", async ({ page }) => {
    await page.goto("/integrations")

    // Wait for cards to load
    await page.waitForSelector('[data-testid="integration-card"]', {
      timeout: 5000,
    })

    // Check if cards are visible
    const cards = page.locator('[data-testid="integration-card"]')
    await expect(cards.first()).toBeVisible()
  })

  test("should filter by category", async ({ page }) => {
    await page.goto("/integrations")

    // Click on a category
    await page.click("text=数据分析")

    // Verify filtered results
    const cards = page.locator('[data-testid="integration-card"]')
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test("should search integrations", async ({ page }) => {
    await page.goto("/integrations")

    // Type in search box
    const searchInput = page.locator('input[type="search"]')
    await searchInput.fill("analytics")

    // Wait for search results
    await page.waitForTimeout(500)

    // Verify search results
    const cards = page.locator('[data-testid="integration-card"]')
    expect(await cards.count()).toBeGreaterThan(0)
  })
})

test.describe("Responsive Design", () => {
  test("should work on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")

    // Check mobile menu
    const mobileMenu = page.locator('[aria-label="Mobile menu"]')
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click()
    }

    // Verify page is responsive
    await expect(page.locator("body")).toBeVisible()
  })

  test("should work on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto("/")

    // Verify page is responsive
    await expect(page.locator("body")).toBeVisible()
  })
})
