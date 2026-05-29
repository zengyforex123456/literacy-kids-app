# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rewards.spec.ts >> RewardsScreen >> shows streak info
- Location: e2e\rewards.spec.ts:17:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/连续打卡/)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/连续打卡/)

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('RewardsScreen', () => {
  4  |   test('shows achievements section', async ({ page }) => {
  5  |     await page.goto('/rewards')
  6  |     await expect(page.getByText('初学者')).toBeVisible()
  7  |     await expect(page.getByText('进阶者')).toBeVisible()
  8  |     await expect(page.getByText('大师')).toBeVisible()
  9  |   })
  10 | 
  11 |   test('shows sticker collection', async ({ page }) => {
  12 |     await page.goto('/rewards')
  13 |     await expect(page.getByText('初识汉字')).toBeVisible()
  14 |     await expect(page.getByText('动物专家')).toBeVisible()
  15 |   })
  16 | 
  17 |   test('shows streak info', async ({ page }) => {
  18 |     await page.goto('/rewards')
> 19 |     await expect(page.getByText(/连续打卡/)).toBeVisible()
     |                                          ^ Error: expect(locator).toBeVisible() failed
  20 |   })
  21 | })
  22 | 
```