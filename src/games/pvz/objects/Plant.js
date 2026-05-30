// 植物基类 + 子类
class Plant {
  constructor(scene, row, col, config) {
    this.scene = scene;
    this.row = row;
    this.col = col;
    this.config = config; // {id, name, word, cost, hp, color, fireRate, damage}
    this.hp = config.hp;
    this.fireTimer = 0;
    this.x = 80 + col * 90 + 45;
    this.y = 70 + row * 100 + 50;
    this.graphics = null;
    this.label = null;
    this.alive = true;

    this.draw();
  }

  // 程序化绘制
  draw() {
    const g = this.scene.add.graphics().setDepth(10);
    const c = this.config.color;
    // Stem
    g.fillStyle(0x006400);
    g.fillRect(this.x - 4, this.y + 8, 8, 28);
    // Head
    g.fillStyle(c);
    g.fillCircle(this.x, this.y - 3, 18);
    // Eyes
    g.fillStyle(0xFFFFFF);
    g.fillCircle(this.x - 6, this.y - 9, 5);
    g.fillCircle(this.x + 6, this.y - 9, 5);
    g.fillStyle(0x000000);
    g.fillCircle(this.x - 5, this.y - 10, 2);
    g.fillCircle(this.x + 5, this.y - 10, 2);
    // Mouth/cannon
    g.fillStyle(c);
    g.fillRect(this.x + 7, this.y - 11, 20, 12);
    this.graphics = g;

    // Word label
    this.label = this.scene.add.text(this.x, this.y + 38, this.config.word, {
      fontSize: '12px', fill: '#FFD700'
    }).setOrigin(0.5).setDepth(11);
  }

  // 子类覆盖
  update(delta) {
    this.fireTimer += delta;
  }

  canFire() {
    if (this.fireTimer >= this.config.fireRate) {
      this.fireTimer = 0;
      return true;
    }
    return false;
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) this.die();
  }

  die() {
    this.alive = false;
    if (this.graphics) this.graphics.destroy();
    if (this.label) this.label.destroy();
  }
}

// 豌豆射手 — 直线攻击
class Peashooter extends Plant {
  constructor(scene, row, col) {
    super(scene, row, col, {
      id: 'pea', name: '豌豆射手', word: '豌', cost: 50,
      hp: 300, color: 0x228B22, fireRate: 1200, damage: 25,
    });
  }

  update(delta) {
    super.update(delta);
    if (this.canFire()) this.shoot();
  }

  shoot() {
    const bx = this.x + 22;
    const by = this.y - 10;
    this.scene.bullets.push({
      obj: this.scene.add.circle(bx, by, 5, 0x00FF00).setDepth(15),
      row: this.row, damage: this.config.damage
    });
  }
}

// 向日葵 — 产生阳光
class Sunflower extends Plant {
  constructor(scene, row, col) {
    super(scene, row, col, {
      id: 'sun', name: '向日葵', word: '日', cost: 50,
      hp: 100, color: 0xFFD700, fireRate: 5000, damage: 0,
    });
  }

  update(delta) {
    super.update(delta);
    if (this.canFire()) {
      this.scene.sun += 25;
    }
  }
}

// 坚果墙 — 高血量防御
class WallNut extends Plant {
  constructor(scene, row, col) {
    super(scene, row, col, {
      id: 'nut', name: '坚果墙', word: '坚', cost: 50,
      hp: 800, color: 0x8B4513, fireRate: 99999, damage: 0,
    });
    this.drawNut(); // 覆盖绘制
  }

  drawNut() {
    if (this.graphics) this.graphics.destroy();
    const g = this.scene.add.graphics().setDepth(10);
    g.fillStyle(0x8B4513);
    g.fillCircle(this.x, this.y, 22);
    g.fillStyle(0xA0522D);
    g.fillCircle(this.x - 5, this.y - 5, 8);
    g.fillCircle(this.x + 5, this.y - 5, 8);
    g.fillStyle(0x000000);
    g.fillCircle(this.x - 4, this.y - 6, 3);
    g.fillCircle(this.x + 4, this.y - 6, 3);
    g.fillStyle(0xFFFFFF);
    g.fillRect(this.x - 4, this.y + 2, 8, 3);
    this.graphics = g;
    if (this.label) this.label.destroy();
    this.label = this.scene.add.text(this.x, this.y + 35, this.config.word, {
      fontSize: '12px', fill: '#FFD700'
    }).setOrigin(0.5).setDepth(11);
  }
}

// 火爆辣椒 — 整行范围攻击
class ChiliPepper extends Plant {
  constructor(scene, row, col) {
    super(scene, row, col, {
      id: 'chili', name: '火爆辣椒', word: '火', cost: 100,
      hp: 200, color: 0xFF4500, fireRate: 8000, damage: 100,
    });
  }

  update(delta) {
    super.update(delta);
    if (this.canFire()) this.explode();
  }

  explode() {
    this.scene.cameras.main.shake(200, 0.01);
    // Damage ALL zombies in the same row
    this.scene.zombies.forEach(z => {
      if (z.active && z.zRow === this.row) {
        z.zHp -= this.config.damage;
        z.zHpBar.width = 30 * (Math.max(z.zHp, 0) / z.zMaxHp);
        if (z.zHp <= 0) {
          z.destroy();
          this.scene.score += 10;
          this.scene.sun += 25;
        }
      }
    });
    // Self-destruct
    this.die();
  }
}

// 工厂函数
Plant.create = function(scene, row, col, type) {
  switch (type) {
    case 'pea': return new Peashooter(scene, row, col);
    case 'sun': return new Sunflower(scene, row, col);
    case 'nut': return new WallNut(scene, row, col);
    case 'chili': return new ChiliPepper(scene, row, col);
    default: return new Peashooter(scene, row, col);
  }
};
