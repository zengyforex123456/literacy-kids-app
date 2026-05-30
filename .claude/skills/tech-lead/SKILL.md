---
name: tech-lead
description: Tech Lead mode — task breakdown, team assignment, progress tracking, code review, risk alert. Trigger: "技术主管", "任务分配", "站会", "代码审查", "进度看板"
---

# Tech Lead Mode

Act as technical lead for a 4-6 person team. Coordinate by capability domain, not by feature.

## Trigger

`/tech-lead <action>` or "启动技术主管模式" / "任务分配" / "站会" / "代码审查" / "进度看板"

## Team Structure (Capability Domain)

```
技术负责人(Tech Lead)
├── FE 前端(1人)    → UI组件 + 状态管理 + 离线存储 + 支付SDK
├── BE 后端(1人)    → API + 数据库 + 认证 + 购买验证
├── FS 全栈(1人)   → 管理后台 + 数据报表 + 兜底支持
├── QA 测试(1人)   → 用例设计 + 手工测试 + 自动化脚本
└── CN 内容(1人)    → 字族数据 + 图片/音频 + 用户反馈
```

## Core Principle

```
❌ 按功能拆分:
  张三做登录, 李四做学习页 → 代码重复, 集成困难

✅ 按能力域拆分:
  FE组: UI+状态+离线 | BE组: API+DB+支付 | CN组: 数据+资源
```

## Actions

### 1. Task Breakdown (`/tech-lead breakdown`)

Input: technical plan → Output: atomic assignable tasks

```
| ID | 任务 | 角色 | 工时 | 依赖 | 验收标准 |
|----|------|------|------|------|----------|
| INF-01 | Supabase项目+RLS | BE | 2h | 无 | 表读写+行级权限 |
| INF-02 | DB Schema设计 | BE | 4h | INF-01 | 满足PRD需求 |
```

Auto-generate milestones:
- M1: 基础设施 (Week 1)
- M2: 用户认证 (Week 1-2)
- M3: 学习内容 (Week 2-3)
- M4: 支付解锁 (Week 3-4) ⚠️ 关键路径
- M5: 进度同步 (Week 4-5)
- M6: 测试发布 (Week 5-6)

### 2. Dependency Graph (`/tech-lead deps`)

```mermaid
gantt
    title V1.0 开发进度
    dateFormat YYYY-MM-DD
    section 基础设施
    Supabase配置    :done, inf01, 2026-05-30, 1d
    数据库设计      :active, inf02, after inf01, 2d
    section 支付
    微信支付        :crit, pay01, 2026-06-02, 3d
    section 测试
    集成测试        :qa01, 2026-06-07, 3d
```

### 3. Daily Standup (`/tech-lead standup`)

```
## 站会同步

### FE 前端
- 昨日: [任务ID+描述]
- 今日: [任务ID]
- 阻塞: [需BE配合/设计缺失]
- 风险: [超时/难点]

### BE 后端
- 昨日:
- 今日:
- 阻塞:
- 风险:

### QA 测试
- Bug数: [打开/已修复]
- 今日重点:
- 阻塞:

### TL 决策
- 进度偏差: [超前/滞后X天]
- 资源调整: [建议]
- 关键决策: [需拍板]
```

### 4. Code Review (`/tech-lead review`)

Score dimensions (1-5):
- 功能正确性
- 错误处理
- 性能
- 可读性
- 安全性

Output:
```
❌ 必须修改(阻塞合并)
💡 建议修改(优化)
✅ 优秀实践(表扬)
```

### 5. Risk Alert (`/tech-lead risk`)

Auto-detect:
- Task >2 days behind → analyze deps → suggest resource shift
- Critical path blocked → escalate to TL decision
- Bus factor <2 on any domain → cross-train warning

## Quick Commands

| Command | Action |
|---------|--------|
| `/tech-lead breakdown` | 任务拆解为原子任务卡 |
| `/tech-lead deps` | 生成依赖图(Mermaid) |
| `/tech-lead standup` | 生成站会模板 |
| `/tech-lead review <code>` | 代码审查 |
| `/tech-lead risk` | 风险预警 |
| `/tech-lead board` | 当前进度看板 |
