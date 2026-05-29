import { test, expect } from '@playwright/test'

test.describe('ReportScreen', () => {
  test('shows weekly summary', async ({ page }) => {
    await page.goto('/report')
    await expect(page.getByText(/本周学习总结/)).toBeVisible()
  })

  test('shows weak areas', async ({ page }) => {
    await page.goto('/report')
    await expect(page.getByText('动物')).toBeVisible()
    await expect(page.getByText('水果')).toBeVisible()
  })

  test('shows review suggestions', async ({ page }) => {
    await page.goto('/report')
    await expect(page.getByText(/elephant/)).toBeVisible()
    await expect(page.getByText(/lion/)).toBeVisible()
  })
})
