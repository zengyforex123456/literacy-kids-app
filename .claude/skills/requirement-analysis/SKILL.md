---
name: requirement-analysis
description: Multi-role iterative requirements engineering — 6 roles, 5 phases, outputs PRD+UserStories+AcceptanceMatrix. Trigger: "需求分析", "梳理需求", "多角色评估", "需求文档", "帮我分析需求", "PRD"
---

# Multi-Role Requirements Engineering

Triggers on phrases: "需求分析", "梳理需求", "多角色评估", "需求文档", "帮我分析需求", "PRD", "需求规格"

## Overview

```
Phase 1: User Profile    → Who is the user? What is their pain? Will they pay?
Phase 2: Role Warmup     → Customize the 6 roles, confirm scope
Phase 3: Deep Interview  → Each role analyzes, questions, refines
Phase 4: Conflict Resolve→ Detect cross-role conflicts, propose tradeoffs  
Phase 5: Document Output → PRD + User Stories + Acceptance Matrix + MoSCoW
Phase 6: Quality Check   → Verify against INVEST principles
```

---

## Phase 1: User Profile & Problem Discovery

**Before any role analysis, understand the human context:**

### 1.1 User Persona
```
| 维度 | 问题 |
|------|------|
| 身份 | 年龄段/职业/技术背景/家庭角色 |
| 场景 | 什么时候用？在哪里用？用什么设备？ |
| 频率 | 每天几次？每次多久？ |
| 动机 | 为什么要用？解决什么痛点？ |
```

### 1.2 Pain Points
```
当前困境:
- 现在怎么做这件事？
- 过程中最痛苦的是什么？
- 试过哪些替代方案？为什么不满意？
```

### 1.3 Payment / Value
```
| 问题 | 判断 |
|------|------|
| 这个问题痛到愿意付费吗？ | 是/否/不确定 |
| 之前为类似产品付过费吗？ | 是(多少)/否 |
| 如果有免费替代品会选择吗？ | 是/否 |
| 付费意愿级别 | 高(立即)/中(考虑)/低(不愿) |
```

**Output**: `.claude/req/user-profile.md`

---

## Phase 2: Role Warmup

### 2.1 Present Analysis Framework

```
"我将扮演以下 6 个角色分析你的需求。请确认:
- 是否有角色需要增加或移除？
- 是否有特定领域的合规要求？
- 需求的时间紧急程度(1-5)？"
```

### 2.2 6 Roles

| Role | Focus | Key Questions |
|------|-------|---------------|
| **PM** 产品经理 | User value, market fit | 谁用？为什么？指标？优先级？ |
| **TL** 技术负责人 | Feasibility, architecture | 可行吗？架构影响？技术选型？ |
| **QA** 测试工程师 | Testability, edge cases | 怎么测？边界条件？异常场景？ |
| **SRE** 运维工程师 | Observability, deploy | 监控？日志？SLA？灾备？ |
| **SEC** 安全工程师 | Threat model, compliance | 威胁？数据合规？攻击面？ |
| **UX** 体验设计师 | Mental model, interaction | 心智模型？交互流程？无障碍？ |

**Output**: Role matrix with customization notes

---

## Phase 3: Deep Interview (Per Role)

Execute one role at a time. Confirm before proceeding.

### Role Template (repeat for each role)

```markdown
### [Role Name] — [角色中文名]

#### 理解确认
"我理解的需求是: ... 这样理解对吗？"

#### 核心关切 (3-5 items)
1. [关切1]
2. [关切2]

#### 澄清问题 (3 questions for user)
- Q1: ?
- Q2: ?
- Q3: ?

#### 需求提炼
| ID | 需求描述 | 优先级 | 来源角色 |
|----|---------|--------|---------|
| R-XX | <描述> | P0/P1/P2 | [Role] |
```

### PM Role — Product Manager

```
追问: 用户价值？成功量化指标？MVP范围？
输出: 用户故事 + 验收标准 + 优先级矩阵
```

### TL Role — Tech Lead

```
追问: 技术可行性？架构影响？技术选型？
输出: 技术方案 + 风险点 + 工作量(t-shirt size: S/M/L/XL)
```

### QA Role — Test Engineer

```
追问: 可测试性？边界条件？异常场景？
输出: 测试策略 + 关键测试用例(Given-When-Then)
```

### SRE Role — Operations

```
追问: 可观测性？部署方式？性能要求？
输出: 监控指标 + 日志规范 + SLA建议
```

### SEC Role — Security

```
追问: 威胁模型？数据合规？攻击面？
输出: 安全需求 + 隐私保护措施
```

### UX Role — Designer

```
追问: 用户心智模型？交互流程？无障碍？
输出: 用户旅程 + 关键交互规范
```

---

## Phase 4: Conflict Resolution

Detect cross-role conflicts:

```markdown
### 检测到的潜在冲突

| 冲突 | 角色A | 角色B | 描述 |
|------|-------|-------|------|
| C1 | PM | TL | PM要求[X]，TL指出[Y]限制 |
| C2 | QA | UX | QA提出[场景]，UX认为[体验问题] |

### 建议权衡
1. [方案A]: <描述> — 偏向角色A
2. [方案B]: <描述> — 折中
3. [方案C]: <描述> — 偏向角色B

请选择或提出替代方案。
```

---

## Phase 5: Document Generation

### 5.1 PRD (Requirements Specification)

```markdown
# PRD — <项目名>

## 项目概述
<1-2句>

## 用户角色
| 角色 | 描述 | 核心场景 |
|------|------|---------|

## 功能需求 (按优先级)
| ID | 需求 | 验收标准 | 优先级 | 来源 |
|----|------|---------|--------|------|

## 非功能需求
| 类别 | 需求 | 指标 |
|------|------|------|

## 约束与假设
| 类型 | 内容 |
|------|------|

## 待澄清问题
- Q1: ...
```

### 5.2 User Story Map

```markdown
| Epic | Feature | User Story | AC | Priority |
|------|---------|------------|----|----------|
```

### 5.3 Acceptance Test Matrix

```markdown
| ID | Given | When | Then | Priority |
|----|-------|------|------|----------|
```

### 5.4 MoSCoW Priority

```markdown
| 优先级 | 需求 |
|--------|------|
| Must have | R1, R2, ... |
| Should have | R5, R6, ... |
| Could have | R10, ... |
| Won't have | R15, ... |
```

**Output**: `.claude/req/prd.md`, `.claude/req/stories.md`, `.claude/req/tests.md`

---

## Phase 6: Quality Self-Check

| Principle | Check | Status |
|-----------|-------|--------|
| Unambiguous | 每条需求只有一种解读？ | ✅/❌ |
| Testable | 每条需求可写 Given-When-Then？ | ✅/❌ |
| Consistent | 需求之间无矛盾？ | ✅/❌ |
| Traceable | 需求→架构→代码→测试可追溯？ | ✅/❌ |
| Prioritized | 每条有明确优先级？ | ✅/❌ |

---

## Output Files

```
.claude/req/
├── user-profile.md      # Phase 1: User persona + pain + payment
├── role-analysis.md     # Phase 3: Per-role analysis
├── conflicts.md         # Phase 4: Conflict detection
├── prd.md               # Phase 5.1: Requirements spec
├── stories.md           # Phase 5.2: User story map
├── tests.md             # Phase 5.3: Acceptance matrix
└── quality.md           # Phase 6: Self-check report
```

## Extended Roles v2

### GP — 游戏心理分析师 (Game Psychology)
- 核心驱动: 什么让孩子主动打开App？什么让他们持续玩？
- 心流设计: 难度曲线是否在"无聊-焦虑"之间的心流通道？
- 反馈循环: 即时反馈→短期目标→长期目标的闭环是否完整？
- 社交动机: 炫耀/竞争/合作哪种驱动最强？
- 损失厌恶: 签到连续被打断会怎样？贴纸被收回会怎样？

### AD — 成瘾性分析 (Addiction Design)
- 成瘾风险评估: 签到宝箱/随机奖励/收集系统 → 是否触发赌徒心理？
- 伦理边界: 儿童产品特别敏感。哪些设计绝对不能做？
- 防沉迷: 15分钟强制休息是否足够？是否有"再玩5分钟"漏洞？
- 家长信任: 什么样的设计让家长放心而不是担心？
- 合规要求: 中国未成年人保护法 + COPPA 对游戏化的限制
