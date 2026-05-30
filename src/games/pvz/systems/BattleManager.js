// 战斗系统 — 管理植物/僵尸/子弹的所有交互

class BattleManager {
  constructor(scene) {
    this.scene = scene;
    this.plants = [];    // Plant instances
    this.zombies = [];   // Zombie instances
    this.bullets = [];   // {x, y, row, damage}
    this.grid = scene.grid;
  }

  // === 植物瞄准：攻击同行最近的僵尸 ===
  findTarget(plant) {
    let closest = null;
    let minDist = Infinity;
    for (const z of this.zombies) {
      if (!z.alive) continue;
      if (z.row !== plant.row) continue;
      const dist = z.x - plant.x;
      if (dist > 0 && dist < minDist) {
        minDist = dist;
        closest = z;
      }
    }
    return closest;
  }

  // === 植物射击 ===
  updatePlants(delta) {
    for (const plant of this.plants) {
      if (!plant.alive) continue;
      plant.update(delta);
      if (plant.canFire && plant.canFire()) {
        const target = this.findTarget(plant);
        if (target) {
          this.bullets.push({
            x: plant.x + 22,
            y: plant.y - 10,
            row: plant.row,
            damage: plant.config.damage || 25,
            target: target,
          });
        }
      }
    }
  }

  // === 子弹飞行 + 命中 ===
  updateBullets(delta) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += 4; // bullet speed

      // Home towards target
      if (b.target && b.target.alive) {
        const dx = b.target.x - b.x;
        const dy = (b.target.y - 20) - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 30) {
          // HIT!
          b.target.takeDamage(b.damage);
          if (!b.target.alive) {
            this.scene.score += 10;
            this.scene.sun += 25;
          }
          this.bullets.splice(i, 1);
          continue;
        }
      }

      // Off screen
      if (b.x > 1000) {
        this.bullets.splice(i, 1);
      }
    }
  }

  // === 僵尸移动 + 吃植物 ===
  updateZombies(delta) {
    for (let i = this.zombies.length - 1; i >= 0; i--) {
      const z = this.zombies[i];
      if (!z.alive) {
        this.zombies.splice(i, 1);
        continue;
      }

      z.update(delta);

      // Check collision with plant
      const col = Math.floor((z.x - 80) / 90);
      if (col >= 0 && col < 9) {
        const cell = this.grid[z.row] ? this.grid[z.row][col] : null;
        if (cell && cell.plant && cell.plant.alive) {
          z.speed = 0; // Stop to eat
          cell.plant.takeDamage(z.damage * delta / 16);
          if (!cell.plant.alive) {
            cell.plant.die();
            this.grid[z.row][col] = { plant: null, graphics: null, label: null };
            z.speed = z.config.speed; // Resume moving
          }
        } else {
          z.speed = z.config.speed; // Resume
        }
      }
    }
  }

  // === 主更新 ===
  update(delta) {
    this.updatePlants(delta);
    this.updateBullets(delta);
    this.updateZombies(delta);
  }

  // === 波次系统 ===
  spawnWave(waveNumber, words) {
    const count = 3 + waveNumber;
    for (let i = 0; i < count; i++) {
      const row = Phaser.Math.Between(0, 4);
      const word = words[waveNumber % words.length];
      const type = waveNumber > 5 ? 'cone' : 'basic';
      const z = Zombie.create(this.scene, row, type, word);
      this.zombies.push(z);
    }
    // Boss every 5 waves
    if (waveNumber % 5 === 0) {
      const z = Zombie.create(this.scene, 2, 'boss', '造句');
      this.zombies.push(z);
    }
  }

  // === 胜利条件 ===
  checkWin() {
    return this.zombies.length === 0 && this.scene.spawnQueueEmpty;
  }

  // === 失败条件 ===  
  checkLose() {
    return this.zombies.some(z => z.alive && z.x < 50);
  }

  // === 清理 ===
  clear() {
    this.plants.forEach(p => { if (p.alive) p.die(); });
    this.zombies.forEach(z => { if (z.alive) z.die(); });
    this.bullets = [];
    this.plants = [];
    this.zombies = [];
  }
}
