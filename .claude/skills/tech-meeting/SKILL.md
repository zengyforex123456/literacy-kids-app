---
name: tech-meeting
description: Multi-role technical meeting — TA/BE/FE/QA/Ops/DE analyze requirements and output implementation plan. Trigger: "启动技术会议", "技术方案", "开发方案", "实现方案"
---

# Technical Role Meeting

## Trigger
`/tech-meeting <需求ID>` or "启动技术会议" / "技术方案"

## Role Matrix

| Role | Focus | Output |
|------|-------|--------|
| TA 架构师 | Tech selection, decomposition | Architecture + proposal |
| BE 后端 | API, database, logic | API spec + DB schema |
| FE 前端 | UI, state, offline | Components + data flow |
| QA 测试 | Test cases, automation | Test report |
| Ops 运维 | Deploy, monitor, security | CI/CD + metrics |
| DE 数据 | Tracking, sync | Data model + protocol |

## Meeting Modes

| Mode | When | Format |
|------|------|--------|
| Serial | New feature | TA→BE→FE→QA→Ops, confirm each |
| Parallel | Quick decision | All roles output 10 lines simultaneously |
| Conflict | Disagreement | Each side 50 chars → PM decides |
| Minimal | Bug fix | BE+QA only |

## Per-Role Template

```
### 【TA】
- 理解: 我对需求的解读是...
- 选型: [A/B/C] + pros/cons
- 分解: modules: [...]
- 待决策: [questions]

### 【BE】
- API: [endpoints]
- 数据模型: [tables]
- 风险: [concurrency/consistency]

### 【FE】
- 组件: [breakdown]
- 状态: [data flow]
- 离线: [storage strategy]

### 【QA】
- 测试场景: [3-5 GWT]
- 自动化: [unit/integration/e2e]

### 【Ops】
- 部署: [env]
- 监控: [metrics + SLA]
```

## Output
```
✅ 决议: [...]
❓ 待确认: [...]
📋 任务: [Role: Task (estimate)]
```
