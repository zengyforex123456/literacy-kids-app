# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: matching.spec.ts >> MatchingGame >> loads and shows cards
- Location: e2e\matching.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/配对/)
Expected: visible
Error: strict mode violation: getByText(/配对/) resolved to 2 elements:
    1) <div>配对闯关</div> aka getByText('配对闯关')
    2) <small>汉字配配对</small> aka getByText('汉字配配对')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/配对/)

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
  - generic [ref=e18] [cursor=pointer]:
    - generic [ref=e19]: 🎁
    - generic [ref=e20]: 点击打开今日宝箱!
  - generic [ref=e21]:
    - heading "魔法森林" [level=1] [ref=e22]
    - generic [ref=e23]:
      - generic [ref=e24]: ⭐ 0
      - generic [ref=e25]: 🐻
  - generic [ref=e26]:
    - generic [ref=e27]:
      - heading "欢迎回来, 小探险家!" [level=2] [ref=e28]
      - paragraph [ref=e29]: 继续你的魔法学习之旅吧...
      - generic [ref=e30]:
        - generic [ref=e31]: Book 0/200
        - generic [ref=e32]: Fire 1 days
    - generic [ref=e33]: ⭐
  - generic [ref=e35]:
    - generic [ref=e36]: 今日进度
    - generic [ref=e37]: 0/5
  - heading "今日游戏" [level=3] [ref=e40]
  - generic [ref=e41]:
    - generic [ref=e42] [cursor=pointer]:
      - generic [ref=e43]: 🌳
      - generic [ref=e44]: 汉字森林
      - generic [ref=e45]: 探索字族树
    - generic [ref=e46] [cursor=pointer]:
      - generic [ref=e47]: 🫧
      - generic [ref=e48]: 泡泡大战
      - generic [ref=e49]: 听音戳泡泡
    - generic [ref=e50] [cursor=pointer]:
      - generic [ref=e51]: 🎯
      - generic [ref=e52]: 配对闯关
      - generic [ref=e53]: 汉字配配对
    - generic [ref=e54] [cursor=pointer]:
      - generic [ref=e55]: ✍️
      - generic [ref=e56]: 书写描红
      - generic [ref=e57]: 练习写汉字
    - generic [ref=e58] [cursor=pointer]:
      - generic [ref=e59]: 🧠
      - generic [ref=e60]: 小测验
      - generic [ref=e61]: 测试掌握的字
  - generic [ref=e62]:
    - generic [ref=e63] [cursor=pointer]:
      - generic [ref=e64]: 首页
      - text: 首页
    - generic [ref=e65] [cursor=pointer]:
      - generic [ref=e66]: 🎒
      - text: 贴纸
    - generic [ref=e67] [cursor=pointer]:
      - generic [ref=e68]: 🏆
      - text: 成就
    - generic [ref=e69] [cursor=pointer]:
      - generic [ref=e70]: 👨‍👩‍👧
      - text: 家长
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('MatchingGame', () => {
  4  |   test('loads and shows cards', async ({ page }) => {
  5  |     await page.goto('/game/matching')
> 6  |     await expect(page.getByText(/配对/)).toBeVisible()
     |                                        ^ Error: expect(locator).toBeVisible() failed
  7  |     await expect(page.getByText('←')).toBeVisible()
  8  |   })
  9  | 
  10 |   test('cards are clickable', async ({ page }) => {
  11 |     await page.goto('/game/matching')
  12 |     await expect(page.getByText('←')).toBeVisible()
  13 |   })
  14 | })
  15 | 
```