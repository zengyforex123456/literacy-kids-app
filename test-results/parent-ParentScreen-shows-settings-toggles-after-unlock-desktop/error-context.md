# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: parent.spec.ts >> ParentScreen >> shows settings toggles after unlock
- Location: e2e\parent.spec.ts:18:3

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: page.goto: Test timeout of 15000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/parent", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('ParentScreen', () => {
  4  |   test('shows PIN gate on entry', async ({ page }) => {
  5  |     await page.goto('/parent')
  6  |     await expect(page.getByText('请输入家长密码')).toBeVisible()
  7  |   })
  8  | 
  9  |   test('unlocks with correct PIN', async ({ page }) => {
  10 |     await page.goto('/parent')
  11 |     await page.locator('button:has-text("1")').click()
  12 |     await page.locator('button:has-text("2")').click()
  13 |     await page.locator('button:has-text("3")').click()
  14 |     await page.locator('button:has-text("4")').click()
  15 |     await expect(page.getByText('家长中心')).toBeVisible()
  16 |   })
  17 | 
  18 |   test('shows settings toggles after unlock', async ({ page }) => {
> 19 |     await page.goto('/parent')
     |                ^ Error: page.goto: Test timeout of 15000ms exceeded.
  20 |     for (const d of ['1','2','3','4']) {
  21 |       await page.locator('button:has-text("' + d + '")').click()
  22 |     }
  23 |     await expect(page.getByText('护眼模式')).toBeVisible()
  24 |     await expect(page.getByText('学习提醒')).toBeVisible()
  25 |   })
  26 | })
  27 | 
```