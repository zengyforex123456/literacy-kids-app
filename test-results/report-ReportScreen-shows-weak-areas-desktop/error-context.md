# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: report.spec.ts >> ReportScreen >> shows weak areas
- Location: e2e\report.spec.ts:9:3

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: page.goto: Test timeout of 15000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/report", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('ReportScreen', () => {
  4  |   test('shows weekly summary', async ({ page }) => {
  5  |     await page.goto('/report')
  6  |     await expect(page.getByText(/本周学习总结/)).toBeVisible()
  7  |   })
  8  | 
  9  |   test('shows weak areas', async ({ page }) => {
> 10 |     await page.goto('/report')
     |                ^ Error: page.goto: Test timeout of 15000ms exceeded.
  11 |     await expect(page.getByText('动物')).toBeVisible()
  12 |     await expect(page.getByText('水果')).toBeVisible()
  13 |   })
  14 | 
  15 |   test('shows review suggestions', async ({ page }) => {
  16 |     await page.goto('/report')
  17 |     await expect(page.getByText(/elephant/)).toBeVisible()
  18 |     await expect(page.getByText(/lion/)).toBeVisible()
  19 |   })
  20 | })
  21 | 
```