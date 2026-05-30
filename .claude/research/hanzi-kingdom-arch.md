# 技术分析 — 汉字王国架构参考

**分析角色**: TA + BE + FE + CP + ART  
**日期**: 2026-05-30  

---

## 【TA — 技术架构师】

### 汉字王国的架构精髓

```
汉字王国的设计哲学:

"每个汉字不是一个字符，而是一个有故事的公民"

架构分层:
┌─────────────────────────────────────────┐
│           Kingdom Layer (王国层)          │
│  世界地图、领地解锁、王国建设               │
├─────────────────────────────────────────┤
│           Quest Layer (任务层)            │
│  主线任务、支线任务、每日任务、成就          │
├─────────────────────────────────────────┤
│           Character Layer (汉字层)         │
│  每个字=一个公民，有属性/故事/形态           │
├─────────────────────────────────────────┤
│           Battle Layer (战斗层)            │
│  识字=战斗力，Boss=测试关卡                │
├─────────────────────────────────────────┤
│           Social Layer (社交层)            │
│  王国排行、好友访问、公民交换               │
└─────────────────────────────────────────┘
```

### 我们的架构对比

| 层 | 汉字王国 | 我们的当前 | 差距 |
|----|---------|-----------|------|
| 王国层 | 世界地图+领地 | 森林地图(初版) | 缺少领地建设 |
| 任务层 | 主线+支线+每日 | 签到宝箱(初版) | 缺少任务系统 |
| 汉字层 | 公民属性+故事 | 字族数据(静态) | 缺少动态属性 |
| 战斗层 | Boss战斗 | 小测验(初版) | 缺少Boss战 |
| 社交层 | 排行+访问 | 分享卡片(初版) | 缺少社交互动 |

### 推荐架构升级

```yaml
V2 目标架构:

Kingdom:
  - 森林王国(Map) → 火焰谷 → 水之湖 → 木之森 → 金山
  - 每个领地=一个字族, 解锁=集齐该字族
  - 王国建设: 学字→获得金币→建造王国建筑

Quest:
  - 主线: 拯救汉字王国(分5章)
  - 支线: 收集稀有字/完成字族/Boss挑战
  - 每日: 学3字+复习5字+挑战1次

Character:
  - 每个字族=一个NPC角色
  - "木"族长=老树精, "水"族长=水精灵
  - 学完字族=族长加入王国

Battle:
  - Boss战=用正确汉字攻击
  - 例: 火Boss → 用"水"+"灭"+"消"攻击
  - 胜利=解锁新领地
```

---

## 【BE — 后端工程师】

### 数据模型 (王国扩展)

```sql
-- 王国进度
kingdom_progress (
  user_id uuid,
  territory_id text,        -- 'forest' | 'fire_valley' | 'water_lake'
  unlocked boolean,
  buildings text[],         -- ['library','tower','garden']
  citizens text[],          -- unlocked character NPCs
  gold integer DEFAULT 0,
  PRIMARY KEY (user_id, territory_id)
);

-- 任务系统
quests (
  id serial PRIMARY KEY,
  type text,                -- 'main' | 'side' | 'daily'
  title text,
  requirement jsonb,        -- {action:'learn',count:5,radical:'木'}
  reward jsonb,             -- {gold:50,item:'fire_gem'}
  story_text text
);

-- 用户任务进度
user_quests (
  user_id uuid,
  quest_id int,
  status text,              -- 'locked'|'active'|'completed'
  progress int DEFAULT 0,
  completed_at timestamptz,
  PRIMARY KEY (user_id, quest_id)
);
```

---

## 【FE — 前端工程师】

### 组件重构

```
KingdomMap (新)
├── TerritoryNode x5        ← 每个字族=一块领地
│   ├── LockedState         ← 灰色锁+预览
│   ├── ActiveState         ← 彩色+当前任务
│   └── CompletedState      ← 金色+已收集
├── QuestPanel              ← 当前任务+奖励预览
└── KingdomBuilder          ← 建设小游戏

QuestSystem (新)
├── QuestCard               ← 任务卡片
├── QuestProgress           ← 进度条
└── QuestReward             ← 奖励动画

BattleSystem (新)
├── BattleScene             ← Boss战斗
├── WordAttack              ← 汉字攻击面板
└── BossHealth              ← Boss血量
```

### 路由

```
/kingdom          ← 王国地图(新主页)
/kingdom/:land    ← 领地详情
/quests            ← 任务列表
/battle/:boss     ← Boss战斗
/games            ← 游戏列表(现有)
```

---

## 【CP — 儿童玩家】

### 王国隐喻对孩子意味着什么

```
不是: "来学字吧" (家长语气)
而是: "来拯救汉字王国吧!" (冒险语气)

心理驱动:
  领地解锁 → 完形心理 (看到灰色领地=想解锁)
  公民收集 → 收集欲 (每个字族NPC=新朋友)
  Boss战斗 → 成就感 (用学会的字打败Boss)
  王国建设 → 创造欲 (我的王国越来越美)

留存设计:
  Day 1: 进入王国 → 接第1个任务 → 学5字 → 解锁森林领地
  Day 2: 签到 → 每日任务 → 获得金币 → 建小屋
  Day 7: 集齐木字族 → 解锁老树精NPC → Boss战 → 解锁火焰谷
  Day 30: 5个领地全解锁 → 王国建成 → 成就感巅峰
```

---

## 决议

| 项目 | 决策 |
|------|------|
| V1 保持现有架构 | 森林+字族+游戏 已可用 |
| V2 引入王国隐喻 | KingdomMap + QuestSystem |
| V2 Boss战斗 | 每字族=1个领地+1个Boss |
| V2 王国建设 | 金币=建设材料 |
| 社交层延后 | V3加入排行/好友访问 |

### 工时预估

| 模块 | 工时 |
|------|------|
| KingdomMap | 4h |
| QuestSystem | 4h |
| BattleSystem | 6h |
| KingdomBuilder | 4h |
| BE扩展(quests表+API) | 4h |
| 合计 | 22h |

---

## 汉字王国模块化设计 — 深度分析

### 五大识字课程模块 → 我们的映射

| 汉字王国 | 核心机制 | 我们的对应 | 差距 |
|---------|---------|-----------|------|
| 去旅行 | 跟随故事学字，每站=一组字 | Forest Quest (字族树) | ⭐⭐ 缺故事线 |
| 大声读 | 语音跟读+AI纠音 | Bubble Pop (听音辨字) | ⭐⭐⭐ 接近 |
| 过小桥 | 拖拽配对，桥梁=正确率 | Matching Game (配对闯关) | ⭐⭐⭐ 接近 |
| 挖一挖 | 挖掘考古，发现甲骨文 | Evolution Cards (字形演变) | ⭐⭐ 缺交互 |
| 脑力操 | 限时挑战，测试掌握度 | Quiz Game (小测验) | ⭐⭐⭐ 接近 |

### 16主题互动图书 → 我们的映射

```
汉字王国: 16个主题(动物/食物/自然/交通...)
我们:     20个字族(木/水/火/口/人/女...)

区别:
  他们按"场景主题"分组 → 动物篇、食物篇
  我们按"部首字族"分组 → 木字旁、三点水

优劣:
  主题分组 → 更直观，孩子理解快
  部首分组 → 更科学，识字效率高

建议: V2结合两者 → 主题场景下包含字族学习
  例: "森林主题" → 木字旁+草字头+竹字头
```

### 17种创意绘画 → 我们的映射

```
汉字王国: 描红/涂色/贴纸/刮画/拼图...
我们:    仅Writing Game (描红)

差距巨大。V2可扩展:
  - 汉字涂色(给汉字上色)
  - 字族拼图(把部首拼成完整汉字)
  - 刮刮乐(刮开涂层发现汉字)
```

### 创作社区 → 我们缺失

```
汉字王国: 电影道具包(孩子创作故事+录视频)
社交传播: 孩子创作的内容→家长分享→自然增长

这是我们的最大机会！
V2 可设计:
  - "我的汉字故事" 创作工具
  - 用已学汉字编写小故事
  - 自动配音+生成分享视频
```

---

## 模块化实施路线

### Phase 1: 补齐课程模块 (V1.1)

```
现有5游戏 → 映射到5课程模块 → 统一UI

Forest Quest  → 去旅行 (加故事线)
Bubble Pop    → 大声读 (✅已OK)
Matching      → 过小桥 (✅已OK)
Evolution     → 挖一挖 (加考古交互)
Quiz          → 脑力操 (加限时模式)
```

### Phase 2: 互动图书 (V2)

```
现有20字族 → 重组为10主题书

森林篇: 木+草+竹
海洋篇: 水+鱼+雨
火焰篇: 火+日+光
人物篇: 人+女+子
...
```

### Phase 3: 创意绘画 (V2)

```
新增3种画板:
  描红画板 (已有)
  拼字画板 (NEW: 部首拼合)
  涂色画板 (NEW: 汉字上色)
```

### Phase 4: 创作社区 (V3)

```
汉字故事创作工具:
  选5个已学汉字 → 编故事 → AI配音 → 生成视频 → 分享
```

---

## 共享组件库设计

```
src/shared/components/
├── game-core/          ← 游戏通用
│   ├── GameCard        ← 课程卡片(统一入口)
│   ├── ProgressBar     ← 进度条(disney风格)
│   └── RewardAnim      ← 奖励动画(星星/烟花)
├── input/              ← 交互通用
│   ├── DragTarget      ← 拖拽目标
│   ├── VoiceButton     ← 语音按钮
│   └── CanvasDraw      ← 画板基础
├── display/            ← 展示通用
│   ├── WordCard        ← 汉字卡片(字+拼音+图)
│   ├── StoryPanel      ← 故事面板
│   └── CollectionGrid  ← 收集网格
└── feedback/           ← 反馈通用
    ├── Confetti        ← 撒花
    ├── StarBurst       ← 星星
    └── PetBubble       ← 精灵对话
```
