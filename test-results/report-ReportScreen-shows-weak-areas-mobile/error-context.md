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

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - button "←" [ref=e5] [cursor=pointer]
    - heading "📊 学习报告" [level=1] [ref=e6]
  - generic [ref=e7]:
    - heading "本周学习总结" [level=2] [ref=e8]
    - generic [ref=e9]:
      - generic [ref=e10]:
        - generic [ref=e11]: 新学词汇
        - generic [ref=e12]: 21 个
      - generic [ref=e13]:
        - generic [ref=e14]: 游戏次数
        - generic [ref=e15]: 15 次
      - generic [ref=e16]:
        - generic [ref=e17]: 正确率
        - generic [ref=e18]: 92%
      - generic [ref=e19]:
        - generic [ref=e20]: 学习时长
        - generic [ref=e21]: 2.5 小时
  - heading "🔍 需要加强" [level=3] [ref=e22]
  - generic [ref=e24]:
    - generic [ref=e25]: 动物
    - generic [ref=e26]: 12/30
  - generic [ref=e30]:
    - generic [ref=e31]: 水果
    - generic [ref=e32]: 8/20
  - generic [ref=e36]:
    - generic [ref=e37]: 身体部位
    - generic [ref=e38]: 4/15
  - heading "💡 建议复习" [level=3] [ref=e41]
  - generic [ref=e42]:
    - generic [ref=e43]: 🐘 elephant 大象
    - generic [ref=e44]: 🦁 lion 狮子
    - generic [ref=e45]: 🐟 fish 鱼
```