# 《汉字保卫战》技术路线对比

**技术会议**: TA + BE + FE + QA + Ops  
**日期**: 2026-05-30  

---

## 【TA — 技术架构师】

### 三路线对比

| 维度 | A: React+Canvas | B: Phaser.js | C: Flutter+Flame |
|------|----------------|-------------|-----------------|
| 游戏性能 | ⭐⭐ requestAnimationFrame | ⭐⭐⭐⭐ 游戏引擎 | ⭐⭐⭐⭐⭐ 原生60fps |
| 开发速度 | ⭐⭐ 自建轮子 | ⭐⭐⭐⭐⭐ 开箱即用 | ⭐⭐⭐ 需学Dart |
| 与现有React复用 | ⭐⭐⭐⭐ 同项目 | ⭐⭐⭐⭐ 混合使用 | ⭐ 完全重写 |
| 塔防特性支持 | ⭐ 无内置 | ⭐⭐⭐⭐⭐ 网格/精灵/碰撞 | ⭐⭐⭐⭐ |
| 动画特效 | ⭐⭐ | ⭐⭐⭐⭐ 粒子系统 | ⭐⭐⭐⭐⭐ |
| 字库数据复用 | ✅ | ✅ | ⚠️ 需迁移 |
| 进度存储复用 | ✅ | ✅ | ⚠️ 需迁移 |
| 工时 | ~40h | ~31h | ~50h |
| 包体大小 | 同现有 | +200KB | +15MB |
| 学习成本 | 低 | 低(1天) | 中(3天) |

### 推荐: **B — Phaser.js**

理由：
1. 塔防是Phaser的经典场景——网格/精灵/碰撞/粒子全内置
2. 与React同DOM混合——字库/进度/音效全部复用
3. 开发最快(31h)——1天上手Phaser
4. 包体仅增200KB(Phaser.min.js)
5. 社区成熟——塔防教程和示例极多

---

## 【FE — 前端工程师】

### Phaser + React 混合架构

```
index.html
├── <div id="game-container">    ← Phaser Canvas (游戏层)
│   └── BattleScene
│       ├── GridManager (5×9)
│       ├── PlantSprite[] 
│       ├── ZombieSprite[]
│       └── BulletSprite[]
│
└── <div id="react-ui">         ← React DOM (UI层)
    ├── TopBar (阳光/墨水/暂停)
    ├── PlantSelector (底部植物栏)
    ├── QuizModal (识字弹窗)
    └── RewardOverlay (奖励/图鉴)
```

### 双向通信

```ts
// React → Phaser: 用户选了字
window.dispatchEvent(new CustomEvent('char-selected', { detail: { char: '火' } }))

// Phaser → React: 僵尸被消灭
game.events.on('zombie-killed', (char: string) => {
  store.addLearnedChars([char])  // 更新React状态
})
```

### 复用清单

| 现有模块 | 能否复用 |
|---------|---------|
| radicalQuery(字族引擎) | ✅ 直接 import |
| gameProgressStore | ✅ 直接使用 |
| useSound(音效) | ✅ 直接使用 |
| useVoice(TTS) | ✅ 直接使用 |
| purchaseStore | ✅ 直接使用 |
| PaywallModal | ✅ 直接使用 |
| Disney设计Token | ✅ CSS变量复用 |
| 字库JSON | ✅ 直接读取 |

---

## 【BE — 后端工程师】

### 需要新增的后端

```sql
-- 游戏进度(塔防专用)
CREATE TABLE pvz_progress (
  user_id uuid PRIMARY KEY,
  unlocked_levels int[] DEFAULT '{1}',
  completed_levels int[] DEFAULT '{}',
  collected_plants text[] DEFAULT '{}',
  garden_decorations jsonb DEFAULT '{}',
  highest_score int DEFAULT 0
);

-- 对战记录(家庭对战)
CREATE TABLE pvp_matches (
  id uuid PRIMARY KEY,
  player1_id uuid,
  player2_id uuid,
  player1_score int,
  player2_score int,
  words_used text[],
  created_at timestamptz DEFAULT now()
);
```

### 存量复用
- purchases 表 → ✅ 完全复用(解锁关卡)
- progress_snapshots → ✅ 复用
- RLS策略 → ✅ 复用

---

## 【QA — 测试】

### 塔防特有测试场景

```
TC-TD01: 放置植物在格子 → 植物出现 → 开始攻击同行僵尸
TC-TD02: 读字"火" → 火爆辣椒出现 → 范围伤害
TC-TD03: 点击僵尸头顶的"木" → 子弹射出 → 僵尸扣血
TC-TD04: 3次选错 → 高亮提示 → 再选对 → 继续
TC-TD05: Boss限时30秒 → 答对3题 → Boss掉血 → 继续战斗
TC-TD06: 阳光不足 → 植物不可选 → 提示"答对问题获得阳光"
TC-TD07: 植物被吃 → 字进训练营 → 复习3次 → 字恢复
TC-TD08: 20关完成 → 解锁终极植物 → 图鉴全亮
```

---

## 【Ops — 运维】

### 部署

```
Phaser游戏文件(phaser.min.js + game.js) → 静态CDN
React UI → 现有dist/ → Cloudflare Pages
Supabase → 新增pvz表
```

### 性能目标

```
Phaser Canvas: 60fps 稳定
首次加载: +200KB(Phaser) < 2s 总加载
内存: < 100MB (手机端)
```

---

## 决议

| 项目 | 决策 |
|------|------|
| 技术路线 | **B — Phaser.js** |
| 与现有项目关系 | 同一个React项目，新增 `src/games/pvz/` 目录 |
| 字库复用 | ✅ 复用 radicalQuery + gameProgressStore |
| 付费复用 | ✅ 复用 purchaseStore + PaywallModal |
| 音效复用 | ✅ 复用 useSound |
| 工时 | **31h (~4天)** |
| 新依赖 | `npm install phaser` (一个包) |

### 目录结构

```
src/games/pvz/
├── PhaserGame.tsx        ← React包装组件
├── scenes/
│   ├── BattleScene.ts    ← 主战斗场景
│   ├── MenuScene.ts      ← 关卡选择
│   └── BossScene.ts      ← Boss战
├── entities/
│   ├── Plant.ts          ← 植物精灵
│   ├── Zombie.ts         ← 错字兽精灵
│   └── Bullet.ts         ← 字词子弹
├── systems/
│   ├── GridManager.ts    ← 网格管理
│   ├── WaveSpawner.ts    ← 波次生成
│   └── QuizSystem.ts     ← 识字测验
├── data/
│   └── levels.ts         ← 20关数据
└── ui/
    ├── PlantSelector.tsx ← 植物选择栏(React)
    └── QuizModal.tsx     ← 识字弹窗(React)
```
