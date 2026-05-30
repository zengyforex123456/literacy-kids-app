---
name: test-org
description: Multi-role testing organization — QA/Auto/Perf/Security/UX/Beta/TestDev. Trigger: "测试组织" "测试方案" "质量门禁" "测试报告" "bug分析"
---

# Testing Organization

## Trigger
`/test-org <action>` or "测试组织" "测试方案" "质量门禁" "测试报告" "bug分析" "安全扫描" "性能测试"

## 7 Testing Roles

| Role | Focus | Frequency | Output |
|------|-------|-----------|--------|
| **QA** 功能测试 | 用例设计、回归、边界 | 每次提交 | 测试用例 + 场景覆盖 |
| **Auto** 自动化 | UI/API自动化、框架维护 | 每日 | 自动化脚本 + 通过率 |
| **Perf** 性能 | 并发/负载/内存CPU | 每里程碑 | 性能基线报告 |
| **Sec** 安全 | 支付破解/数据泄露/注入 | 每月+发布前 | 安全扫描 + 渗透报告 |
| **UX** 体验 | 易用性/无障碍/认知负荷 | 每迭代 | 可用性问题清单 |
| **Beta** 众测 | 内测招募/反馈收集/Bug分级 | 发布前 | 用户反馈汇总 |
| **TD** 测试开发 | Mock服务/测试数据/环境 | 持续 | 测试基础设施 |

## Quality Gates (发布前5关)

```
关卡1 QA:     P0用例通过率=100%, 无P1级未修复Bug
关卡2 Auto:   E2E≥95%, 性能无劣化>10%
关卡3 Sec:    无高危漏洞, 支付渗透通过
关卡4 UX:     核心流程完成时间<预期, 无障碍通过
关卡5 Beta:   内测NPS≥0, P0/P1反馈清零

→ Go/No-Go 决策
```

## Quick Commands

| Command | Action |
|---------|--------|
| `/test-org review <code>` | 多角色代码审查 |
| `/test-org security <api>` | 安全渗透分析 |
| `/test-org perf <scenario>` | 性能测试设计 |
| `/test-org ux <feature>` | 儿童体验评估 |
| `/test-org beta <version>` | 内测方案 |
| `/test-org report` | 质量仪表盘 |
| `/test-org bug <id>` | 多角色根因分析 |
| `/test-org gate` | 发布质量门禁检查 |

## Per-Role Templates

### QA Engineer
```
### 测试用例
| ID | Given | When | Then | Priority |

### 场景覆盖
✅ 已覆盖 | ⚠️ 部分 | ❌ 未覆盖

### 可测试性
阻塞: [Mock/环境/数据缺失]
```

### Security Engineer
```
### 威胁模型(STRIDE)
| 类型 | 风险 | 影响 | 缓解 |

### 攻击测试
- 认证绕过: [method]
- 支付破解: [method]
- 数据泄露: [method]
```

### UX Tester (Children)
```
### 易用性
| 用户(年龄) | 任务 | 困难点 |

### WCAG 2.1
对比度: ✅/❌ | 字体缩放: ✅/❌ | 屏幕阅读器: ✅/❌
```
