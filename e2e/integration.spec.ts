import { test, expect } from "@playwright/test"

test.describe("Integration Page Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should complete full integration discovery flow", async ({ page }) => {
    // Navigate to marketplace
    await page.click('a[href="/marketplace"]')
    await expect(page).toHaveURL(/\/marketplace/)

    // Verify integration cards are loaded
    const integrationCards = page.locator('[data-testid="integration-card"]')
    await expect(integrationCards.first()).toBeVisible()

    // Click on first integration
    await integrationCards.first().click()

    // Verify integration detail page
    await expect(page.locator("h1")).toBeVisible()
    await expect(page.locator('[data-testid="integration-description"]')).toBeVisible()
  })

  test("should filter integrations by category", async ({ page }) => {
    await page.goto("/marketplace")

    // Click category filter
    await page.click('[data-testid="category-filter"]')
    await page.click("text=数据分析")

    // Verify filtered results
    const results = page.locator('[data-testid="integration-card"]')
    await expect(results.first()).toBeVisible()
  })

  test("should add integration to favorites", async ({ page }) => {
    await page.goto("/marketplace")

    // Click favorite button on first integration
    const favoriteButton = page.locator('[data-testid="favorite-button"]').first()
    await favoriteButton.click()

    // Navigate to favorites page
    await page.click('a[href="/favorites"]')
    await expect(page).toHaveURL(/\/favorites/)

    // Verify integration appears in favorites
    const favoritedItems = page.locator('[data-testid="favorite-item"]')
    await expect(favoritedItems.first()).toBeVisible()
  })
})

test.describe("Search Functionality", () => {
  test("should search integrations and display results", async ({ page }) => {
    await page.goto("/marketplace/search")

    // Enter search query
    const searchInput = page.locator('[data-testid="search-input"]')
    await searchInput.fill("数据")
    await page.keyboard.press("Enter")

    // Verify search results
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible()
    const results = page.locator('[data-testid="integration-card"]')
    await expect(results.first()).toBeVisible()
  })

  test("should handle empty search results", async ({ page }) => {
    await page.goto("/marketplace/search")

    const searchInput = page.locator('[data-testid="search-input"]')
    await searchInput.fill("xyz123nonexistent")
    await page.keyboard.press("Enter")

    await expect(page.locator("text=未找到相关集成")).toBeVisible()
  })
})

test.describe("Authentication Flow", () => {
  test("should show login form", async ({ page }) => {
    await page.goto("/")

    // Click login button
    await page.click('[data-testid="login-button"]')

    // Verify login form appears
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })
})
