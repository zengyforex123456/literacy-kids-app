# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> HomeScreen >> loads and shows game cards
- Location: e2e\home.spec.ts:4:3

# Error details

```
Test timeout of 15000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - heading "🌳 识字乐园" [level=1] [ref=e5]
    - generic [ref=e6]:
      - generic [ref=e7]: ⭐ 0
      - generic [ref=e8]: 🐻
  - generic [ref=e9]:
    - heading "今天学了新词了吗？" [level=2] [ref=e10]
    - paragraph [ref=e11]: 继续加油，小探险家！🗺️
    - generic [ref=e12]:
      - generic [ref=e13]: 📚 已学 0/500
      - generic [ref=e14]: 🔥 连续 1 天
    - generic [ref=e15]: 🌳🌸🦋
  - generic [ref=e17]:
    - generic [ref=e18]: 学习进度
    - generic [ref=e19]: 0/500
  - heading "🎮 今日游戏" [level=3] [ref=e21]
  - generic [ref=e22]:
    - generic [ref=e23] [cursor=pointer]:
      - generic [ref=e24]: 🌳
      - generic [ref=e25]: 汉字森林
      - generic [ref=e26]: 探索字族树
    - generic [ref=e27] [cursor=pointer]:
      - generic [ref=e28]: 🫧
      - generic [ref=e29]: 泡泡大战
      - generic [ref=e30]: 听音戳泡泡
    - generic [ref=e31] [cursor=pointer]:
      - generic [ref=e32]: 🎯
      - generic [ref=e33]: 配对闯关
      - generic [ref=e34]: 图文连连看
    - generic [ref=e35] [cursor=pointer]:
      - generic [ref=e36]: ✍️
      - generic [ref=e37]: 书写描红
      - generic [ref=e38]: 练习写汉字
  - generic [ref=e39]:
    - generic [ref=e40] [cursor=pointer]:
      - generic [ref=e41]: 🏠
      - text: 首页
    - generic [ref=e42] [cursor=pointer]:
      - generic [ref=e43]: 🎒
      - text: 贴纸
    - generic [ref=e44] [cursor=pointer]:
      - generic [ref=e45]: 🏆
      - text: 成就
    - generic [ref=e46] [cursor=pointer]:
      - generic [ref=e47]: 👨‍👩‍👧
      - text: 家长
```