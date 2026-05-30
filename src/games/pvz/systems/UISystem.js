// UI系统: 植物栏 + 阳光 + 波次条 + 冷却
class UISystem {
  constructor(scene) {
    this.scene = scene
    this.plantCards = []
    this.cooldowns = {} // {pea: 0, sun: 0, ...}
  }

  // === 植物卡片栏 ===
  createPlantBar(plants, onClick) {
    const barY = 540
    this.scene.add.rectangle(500, barY+25, 1000, 70, 0x3E2723).setDepth(90)

    plants.forEach((p, i) => {
      const x = 40 + i * 130
      const y = barY

      // Card background
      const card = this.scene.add.rectangle(x+50, y+25, 110, 55, 0x263238).setDepth(91).setInteractive()
      card.setStrokeStyle(2, 0x4CAF50)

      // Plant icon (geometric)
      const icon = this.scene.add.graphics().setDepth(92)
      icon.fillStyle(p.color); icon.fillCircle(x+25, y+12, 14)
      icon.fillStyle(0xFFFFFF); icon.fillCircle(x+21, y+9, 4); icon.fillCircle(x+29, y+9, 4)

      // Name
      this.scene.add.text(x+55, y+5, p.name, {fontSize:'12px',fill:'#fff'}).setOrigin(0.5).setDepth(92)
      // Cost
      this.scene.add.text(x+55, y+22, p.word+' ¥'+p.cost, {fontSize:'10px',fill:'#FFD700'}).setOrigin(0.5).setDepth(92)

      // Cooldown overlay
      const cdOverlay = this.scene.add.rectangle(x+50, y+25, 110, 55, 0x000000, 0).setDepth(93)
      const cdText = this.scene.add.text(x+50, y+25, '', {fontSize:'18px',fill:'#fff'}).setOrigin(0.5).setDepth(94)

      // Click handler
      card.on('pointerdown', () => {
        if (this.cooldowns[p.id] <= 0 && onClick) onClick(p)
      })

      this.plantCards.push({ card, icon, cdOverlay, cdText, plant: p, x, y })
    })
  }

  // === 更新冷却 ===
  updateCooldowns(delta) {
    for (const key in this.cooldowns) {
      if (this.cooldowns[key] > 0) this.cooldowns[key] -= delta
    }
    this.plantCards.forEach(c => {
      const cd = this.cooldowns[c.plant.id] || 0
      if (cd > 0) {
        c.cdOverlay.setAlpha(0.6)
        c.cdText.setText(Math.ceil(cd/1000)+'s')
        c.card.disableInteractive()
      } else {
        c.cdOverlay.setAlpha(0)
        c.cdText.setText('')
        c.card.setInteractive()
      }
    })
  }

  setCooldown(plantId, ms) { this.cooldowns[plantId] = ms }

  // === 阳光计数器 ===
  createSunCounter(x, y) {
    const bg = this.scene.add.rectangle(x+40, y+12, 90, 28, 0x000000, 0.6).setDepth(100)
    const icon = this.scene.add.text(x+5, y, '☀️', {fontSize:'20px'}).setDepth(101)
    const text = this.scene.add.text(x+28, y, '150', {fontSize:'18px',fill:'#FFD700',fontWeight:'bold'}).setDepth(101)
    return { bg, icon, text, update: (v) => text.setText(Math.floor(v).toString()) }
  }

  // === 波次进度条 ===
  createWaveBar(x, y, w) {
    this.scene.add.text(x, y-18, '第 1 波', {fontSize:'12px',fill:'#fff'}).setDepth(100)
    const bg = this.scene.add.rectangle(x+w/2, y+5, w, 8, 0x333333).setDepth(100)
    const fill = this.scene.add.rectangle(x, y+5, 0, 6, 0x4CAF50).setDepth(101).setOrigin(0, 0)
    const zombieCount = this.scene.add.text(x+w+10, y-18, '0', {fontSize:'11px',fill:'#F44336'}).setDepth(100)
    return { bg, fill, zombieCount, update: (pct, remaining) => {
      fill.width = Math.max(0, Math.min(w, w * pct))
      zombieCount.setText(remaining+'').setColor(remaining>0?'#FF5722':'#4CAF50')
    }}
  }
}