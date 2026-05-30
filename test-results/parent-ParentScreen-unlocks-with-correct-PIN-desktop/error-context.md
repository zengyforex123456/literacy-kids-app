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

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - button "←" [ref=e5] [cursor=pointer]
    - heading "👨‍👩‍👧 家长中心" [level=1] [ref=e6]
  - generic [ref=e7]:
    - generic [ref=e8]:
      - generic [ref=e9]: 已学汉字
      - generic [ref=e10]: 24/500
    - generic [ref=e11]:
      - generic [ref=e12]: 已学英文
      - generic [ref=e13]: 18/500
    - generic [ref=e14]:
      - generic [ref=e15]: 游戏次数
      - generic [ref=e16]: 37 次
    - generic [ref=e17]:
      - generic [ref=e18]: 正确率
      - generic [ref=e19]: 92%
  - heading "⚙️ 设置" [level=3] [ref=e20]
  - generic [ref=e21]:
    - generic [ref=e22]:
      - generic [ref=e23]: 📊 每日时长
      - strong [ref=e24]: 30 分钟
    - generic [ref=e25]:
      - generic [ref=e26]: 📈 难度等级
      - strong [ref=e27]: ⭐ 简单
    - generic [ref=e29]: 👁️ 护眼模式
    - generic [ref=e33]: 🔔 学习提醒
    - generic [ref=e37]: 🎵 背景音乐
  - button "📊 查看学习报告" [ref=e40] [cursor=pointer]
```