import { test, expect } from '@playwright/test'

test.describe('HomeScreen', () => {
  test('loads and shows game cards', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText(/识字乐园/)
    await expect(page.getByText('汉字森林')).toBeVisible()
    await expect(page.getByText('泡泡大战')).toBeVisible()
    await expect(page.getByText('配对闯关')).toBeVisible()
    await expect(page.getByText('书写描红')).toBeVisible()
  })

  test('navigates to bubble pop game', async ({ page }) => {
    await page.goto('/')
    await page.getByText('泡泡大战').click()
    await expect(page.getByText(/请找到/)).toBeVisible()
  })

  test('shows coin and streak in header', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/⭐/).first()).toBeVisible()
    await expect(page.getByText(/连续/)).toBeVisible()
  })
})
