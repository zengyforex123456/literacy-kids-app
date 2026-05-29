import { test, expect } from '@playwright/test'

test.describe('RewardsScreen', () => {
  test('shows achievements section', async ({ page }) => {
    await page.goto('/rewards')
    await expect(page.getByText('初学者')).toBeVisible()
    await expect(page.getByText('进阶者')).toBeVisible()
    await expect(page.getByText('大师')).toBeVisible()
  })

  test('shows sticker collection', async ({ page }) => {
    await page.goto('/rewards')
    await expect(page.getByText('初识汉字')).toBeVisible()
    await expect(page.getByText('动物专家')).toBeVisible()
  })

  test('shows streak info', async ({ page }) => {
    await page.goto('/rewards')
    await expect(page.getByText(/连续打卡/)).toBeVisible()
  })
})
