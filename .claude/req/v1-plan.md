# V1.0 实施计划 — 平衡版

**工时**: ~35h | **周期**: 5天 | **选择**: 方案B

## 保留清单

| ID | 来源 | 任务 | 工时 | 文件 |
|----|------|------|------|------|
| F01 | BE/FE | PaywallModal + purchaseStore | 3h | `shared/components/PaywallModal.tsx` |
| F02 | BE | Supabase表+RLS创建 | 2h | Supabase SQL |
| F03 | BE | verify-purchase Edge Function | 3h | Supabase Edge Function |
| F04 | BE | 微信/支付宝H5支付对接 | 4h | 支付回调 |
| F05 | FE | 家长Dashboard+学习简报 | 4h | `ParentScreen.tsx` |
| F06 | FE | 打印字卡 | 2h | `parent/PrintCards.tsx` |
| F07 | ART | 家长端温暖化 | 3h | `ParentScreen.tsx` |
| F08 | CP | 分享卡片生成 | 3h | `shared/components/ShareCard.tsx` |
| F09 | CP | 开场故事化 | 2h | `HomeScreen.tsx`+各游戏 |
| F10 | CP | 每日签到宝箱 | 3h | `shared/components/DailyBox.tsx` |
| F11 | CP/ART | 反馈增强(<300ms+星星) | 2h | 各游戏组件 |
| F12 | UT | 按钮≥64px+长按家长入口 | 2h | `HomeScreen.tsx` |
| F13 | CP | 15分钟强制休息 | 1h | `useEyeCare.ts` |
| F14 | FE | 字族数据集成(29组) | 2h | `TreasureHuntGame/data.ts` |
| F15 | QA | 付费流程E2E | 2h | `e2e/payment.spec.ts` |
| F16 | Ops | 隐私政策+Cloudflare部署 | 3h | 部署配置 |

## 延后V2

- IP角色系统 (6h)
- 故事模式 (8h)
- 多孩Profile (3h)
- 森林寻宝手绘装饰 (3h)

## 开发顺序
Day 1-2: F01-F04 付费系统
Day 3:   F05-F08 家长端
Day 4:   F09-F13 游戏优化
Day 5:   F14-F16 字族集成+QA+部署
