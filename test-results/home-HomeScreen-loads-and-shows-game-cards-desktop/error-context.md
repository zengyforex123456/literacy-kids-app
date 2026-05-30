# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> HomeScreen >> loads and shows game cards
- Location: e2e\home.spec.ts:4:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h1')
Expected pattern: /识字乐园/
Received string:  "魔法森林"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('h1')
    14 × locator resolved to <h1 class="gradient-text">魔法森林</h1>
       - unexpected value "魔法森林"

```

```yaml
- heading "魔法森林" [level=1]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('HomeScreen', () => {
  4  |   test('loads and shows game cards', async ({ page }) => {
  5  |     await page.goto('/')
> 6  |     await expect(page.locator('h1')).toContainText(/识字乐园/)
     |                                      ^ Error: expect(locator).toContainText(expected) failed
  7  |     await expect(page.getByText('汉字森林')).toBeVisible()
  8  |     await expect(page.getByText('泡泡大战')).toBeVisible()
  9  |     await expect(page.getByText('配对闯关')).toBeVisible()
  10 |     await expect(page.getByText('书写描红')).toBeVisible()
  11 |   })
  12 | 
  13 |   test('navigates to bubble pop game', async ({ page }) => {
  14 |     await page.goto('/')
  15 |     await page.getByText('泡泡大战').click()
  16 |     await expect(page.getByText(/请找到/)).toBeVisible()
  17 |   })
  18 | 
  19 |   test('shows coin and streak in header', async ({ page }) => {
  20 |     await page.goto('/')
  21 |     await expect(page.getByText(/⭐/).first()).toBeVisible()
  22 |     await expect(page.getByText(/连续/)).toBeVisible()
  23 |   })
  24 | })
  25 | 
```