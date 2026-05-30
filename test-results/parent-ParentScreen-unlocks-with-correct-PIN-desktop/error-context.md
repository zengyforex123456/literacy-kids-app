# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: parent.spec.ts >> ParentScreen >> unlocks with correct PIN
- Location: e2e\parent.spec.ts:9:3

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: locator.click: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('button:has-text("1")')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]: Great job! Keep going!
    - generic [ref=e7] [cursor=pointer]: ⭐
    - generic [ref=e9]:
      - generic [ref=e10]: 😊
      - generic [ref=e11]: 0/5
    - generic [ref=e13]:
      - button "Feed" [ref=e14] [cursor=pointer]
      - button "Evolve" [ref=e15] [cursor=pointer]
  - generic [ref=e16]:
    - heading "魔法森林" [level=1] [ref=e17]
    - generic [ref=e18]:
      - generic [ref=e19]: ⭐ 0
      - generic [ref=e20]: 🐻
  - generic [ref=e21]:
    - generic [ref=e22]:
      - heading "欢迎回来, 小探险家!" [level=2] [ref=e23]
      - paragraph [ref=e24]: 继续你的魔法学习之旅吧...
      - generic [ref=e25]:
        - generic [ref=e26]: Book 0/200
        - generic [ref=e27]: Fire 1 days
    - generic [ref=e28]: ⭐
  - generic [ref=e30]:
    - generic [ref=e31]: 今日进度
    - generic [ref=e32]: 0/5
  - heading "今日游戏" [level=3] [ref=e35]
  - generic [ref=e36]:
    - generic [ref=e37] [cursor=pointer]:
      - generic [ref=e38]: 🌳
      - generic [ref=e39]: 汉字森林
      - generic [ref=e40]: 探索字族树
    - generic [ref=e41] [cursor=pointer]:
      - generic [ref=e42]: 🫧
      - generic [ref=e43]: 泡泡大战
      - generic [ref=e44]: 听音戳泡泡
    - generic [ref=e45] [cursor=pointer]:
      - generic [ref=e46]: 🎯
      - generic [ref=e47]: 配对闯关
      - generic [ref=e48]: 汉字配配对
    - generic [ref=e49] [cursor=pointer]:
      - generic [ref=e50]: ✍️
      - generic [ref=e51]: 书写描红
      - generic [ref=e52]: 练习写汉字
    - generic [ref=e53] [cursor=pointer]:
      - generic [ref=e54]: 🧠
      - generic [ref=e55]: 小测验
      - generic [ref=e56]: 测试掌握的字
  - generic [ref=e57]:
    - generic [ref=e58] [cursor=pointer]:
      - generic [ref=e59]: 首页
      - text: 首页
    - generic [ref=e60] [cursor=pointer]:
      - generic [ref=e61]: 🎒
      - text: 贴纸
    - generic [ref=e62] [cursor=pointer]:
      - generic [ref=e63]: 🏆
      - text: 成就
    - generic [ref=e64] [cursor=pointer]:
      - generic [ref=e65]: 👨‍👩‍👧
      - text: 家长
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
> 11 |     await page.locator('button:has-text("1")').click()
     |                                                ^ Error: locator.click: Test timeout of 15000ms exceeded.
  12 |     await page.locator('button:has-text("2")').click()
  13 |     await page.locator('button:has-text("3")').click()
  14 |     await page.locator('button:has-text("4")').click()
  15 |     await expect(page.getByText('家长中心')).toBeVisible()
  16 |   })
  17 | 
  18 |   test('shows settings toggles after unlock', async ({ page }) => {
  19 |     await page.goto('/parent')
  20 |     for (const d of ['1','2','3','4']) {
  21 |       await page.locator('button:has-text("' + d + '")').click()
  22 |     }
  23 |     await expect(page.getByText('护眼模式')).toBeVisible()
  24 |     await expect(page.getByText('学习提醒')).toBeVisible()
  25 |   })
  26 | })
  27 | 
```