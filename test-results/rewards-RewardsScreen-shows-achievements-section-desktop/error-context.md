# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rewards.spec.ts >> RewardsScreen >> shows achievements section
- Location: e2e\rewards.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('初学者')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('初学者')

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
  3  | test.describe('RewardsScreen', () => {
  4  |   test('shows achievements section', async ({ page }) => {
  5  |     await page.goto('/rewards')
> 6  |     await expect(page.getByText('初学者')).toBeVisible()
     |                                         ^ Error: expect(locator).toBeVisible() failed
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
  19 |     await expect(page.getByText(/连续打卡/)).toBeVisible()
  20 |   })
  21 | })
  22 | 
```