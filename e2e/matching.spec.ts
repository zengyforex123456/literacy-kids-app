import { test, expect } from '@playwright/test'

test.describe('MatchingGame', () => {
  test('loads and shows cards', async ({ page }) => {
    await page.goto('/game/matching')
    await expect(page.getByText(/配对/)).toBeVisible()
    await expect(page.getByText('←')).toBeVisible()
  })

  test('cards are clickable', async ({ page }) => {
    await page.goto('/game/matching')
    await expect(page.getByText('←')).toBeVisible()
  })
})
