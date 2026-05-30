# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> HomeScreen >> shows coin and streak in header
- Location: e2e\home.spec.ts:19:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/连续/)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/连续/)

```

```yaml
- text: Great job! Keep going! ⭐ 😊 0/5
- button "Feed"
- button "Evolve"
- heading "魔法森林" [level=1]
- text: ⭐ 0 🐻
- heading "欢迎回来, 小探险家!" [level=2]
- paragraph: 继续你的魔法学习之旅吧...
- text: Book 0/200 Fire 1 days ⭐ 今日进度 0/5
- heading "今日游戏" [level=3]
- text: 🌳 汉字森林 探索字族树 🫧 泡泡大战 听音戳泡泡 🎯 配对闯关 汉字配配对 ✍️ 书写描红 练习写汉字 🧠 小测验 测试掌握的字 首页 首页 🎒 贴纸 🏆 成就 👨‍👩‍👧 家长
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('HomeScreen', () => {
  4  |   test('loads and shows game cards', async ({ page }) => {
  5  |     await page.goto('/')
  6  |     await expect(page.locator('h1')).toContainText(/识字乐园/)
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
> 22 |     await expect(page.getByText(/连续/)).toBeVisible()
     |                                        ^ Error: expect(locator).toBeVisible() failed
  23 |   })
  24 | })
  25 | 
```