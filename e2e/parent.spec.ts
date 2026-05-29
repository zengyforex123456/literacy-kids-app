import { test, expect } from '@playwright/test'

test.describe('ParentScreen', () => {
  test('shows PIN gate on entry', async ({ page }) => {
    await page.goto('/parent')
    await expect(page.getByText('请输入家长密码')).toBeVisible()
  })

  test('unlocks with correct PIN', async ({ page }) => {
    await page.goto('/parent')
    await page.locator('button:has-text("1")').click()
    await page.locator('button:has-text("2")').click()
    await page.locator('button:has-text("3")').click()
    await page.locator('button:has-text("4")').click()
    await expect(page.getByText('家长中心')).toBeVisible()
  })

  test('shows settings toggles after unlock', async ({ page }) => {
    await page.goto('/parent')
    for (const d of ['1','2','3','4']) {
      await page.locator('button:has-text("' + d + '")').click()
    }
    await expect(page.getByText('护眼模式')).toBeVisible()
    await expect(page.getByText('学习提醒')).toBeVisible()
  })
})
