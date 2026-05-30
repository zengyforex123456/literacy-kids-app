# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: report.spec.ts >> ReportScreen >> shows review suggestions
- Location: e2e\report.spec.ts:15:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/elephant/)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/elephant/)

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
  3  | test.describe('ReportScreen', () => {
  4  |   test('shows weekly summary', async ({ page }) => {
  5  |     await page.goto('/report')
  6  |     await expect(page.getByText(/本周学习总结/)).toBeVisible()
  7  |   })
  8  | 
  9  |   test('shows weak areas', async ({ page }) => {
  10 |     await page.goto('/report')
  11 |     await expect(page.getByText('动物')).toBeVisible()
  12 |     await expect(page.getByText('水果')).toBeVisible()
  13 |   })
  14 | 
  15 |   test('shows review suggestions', async ({ page }) => {
  16 |     await page.goto('/report')
> 17 |     await expect(page.getByText(/elephant/)).toBeVisible()
     |                                              ^ Error: expect(locator).toBeVisible() failed
  18 |     await expect(page.getByText(/lion/)).toBeVisible()
  19 |   })
  20 | })
  21 | 
```