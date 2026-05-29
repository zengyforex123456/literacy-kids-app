# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: matching.spec.ts >> MatchingGame >> cards are clickable
- Location: e2e\matching.spec.ts:10:3

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: page.goto: Test timeout of 15000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/game/matching", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('MatchingGame', () => {
  4  |   test('loads and shows cards', async ({ page }) => {
  5  |     await page.goto('/game/matching')
  6  |     await expect(page.getByText(/配对闯关/)).toBeVisible()
  7  |     await expect(page.getByText('←')).toBeVisible()
  8  |   })
  9  | 
  10 |   test('cards are clickable', async ({ page }) => {
> 11 |     await page.goto('/game/matching')
     |                ^ Error: page.goto: Test timeout of 15000ms exceeded.
  12 |     const cards = page.locator('[style*="aspect-ratio"]')
  13 |     const count = await cards.count()
  14 |     expect(count).toBeGreaterThanOrEqual(6)
  15 |   })
  16 | })
  17 | 
```