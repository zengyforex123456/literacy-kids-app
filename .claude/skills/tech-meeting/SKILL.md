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

## Extended Roles (v2)

| Role | Code | Focus | Output |
|------|------|-------|--------|
| 艺术家 | ART | Visual design, color, animation, child appeal | UI review + visual improvement plan |
| 可用性测试 | UT | Child usability, parent navigation, error recovery | Usability report + fix priority |

### ART — 艺术家
- 视觉风格: 是否符合3-6岁审美？色彩是否舒适？
- 动画质量: 过渡是否流畅？反馈动画是否有吸引力？
- 设计一致性: 所有页面是否统一风格？
- 儿童吸引力: 角色/图标/场景是否吸引小朋友？
- 改进建议: 具体可执行的视觉优化

### UT — 可用性测试
- 儿童可操作性: 3-4岁能否独立使用？按钮够大吗？
- 认知负荷: 信息量是否超出年龄承受？
- 错误恢复: 误操作后能回来吗？
- 家长导航: 找设置/看报告是否直觉？
- 无障碍: 色盲/弱视儿童能否使用？

### CP — 儿童玩家 (Child Player)
- 好不好玩？: 孩子会主动打开吗？第二天还想玩吗？
- 奖励够不够？: 积分/贴纸/升级有吸引力吗？
- 难度合适吗？: 太难→挫败放弃，太简单→无聊放弃
- 社交需求？: 想给好朋友看吗？想炫耀吗？
- 成瘾风险？: 会不会停不下来？护眼机制真有效吗？
- 对标游戏: vs 宝宝巴士/汤姆猫/水果忍者，我们的游戏性在什么水平？
