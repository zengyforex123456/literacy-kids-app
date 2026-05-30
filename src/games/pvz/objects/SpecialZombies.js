// Special Zombies + Shooting System (Phaser)
class WordFamilyZombie extends Zombie {
  constructor(scene, row, family) {
    const families = {
      qing: ["清","晴","睛","情","请"],
      bao: ["抱","跑","炮","泡","饱"],
      fang: ["放","房","防","访","仿"],
      gong: ["功","攻","红","虹","江"],
      ke: ["何","河","呵","哥","歌"],
    };
    const words = families[family] || [family, family+"子"];
    super(scene, row, {
      id:"wordfamily", name:"字族兽-"+family, word:words[0],
      hp:150, speed:0.2, damage:15, color:0x6464C8,
    });
    this.family = family;
    this.words = words;
    this.currentIdx = 0;
    this.wordTimer = 0;
    this.wordInterval = 3000;
  }

  update(delta) {
    super.update(delta);
    this.wordTimer += delta;
    if (this.wordTimer >= this.wordInterval) {
      this.wordTimer = 0;
      this.currentIdx = (this.currentIdx + 1) % this.words.length;
      this.config.word = this.words[this.currentIdx];
      // Update label if exists
      if (this.container) {
        const label = this.container.getAt(1);
        if (label) label.setText(this.config.word);
      }
    }
  }
}

class TimedZombie extends Zombie {
  constructor(scene, row, word) {
    super(scene, row, {
      id:"timed", name:"限时兽", word:word,
      hp:100, speed:0.4, damage:10, color:0xFF6432,
    });
    this.timeLimit = 5000;
    this.timer = 0;
    this.accelerated = false;
  }

  update(delta) {
    super.update(delta);
    if (!this.alive) return;
    this.timer += delta;
    if (this.timer >= this.timeLimit && !this.accelerated) {
      this.accelerated = true;
      this.speed *= 2;
      this.config.color = 0xFF0000;
    }
  }
}

class BossZombie extends Zombie {
  constructor(scene, row) {
    super(scene, row, {
      id:"boss", name:"Boss错字王", word:"造句",
      hp:500, speed:0.1, damage:50, color:0xC80000,
    });
    this.questions = [
      {q:"用「好」造句子", correct:"好"},
      {q:"用「花」说句话", correct:"花"},
      {q:"「学」可以组什么词", correct:"学"},
    ];
    this.currentQ = 0;
    this.answered = 0;
  }

  getQuestion() {
    return this.currentQ < this.questions.length ? this.questions[this.currentQ] : null;
  }

  answer(correct) {
    if (correct) {
      this.answered++;
      this.hp -= 100;
      this.currentQ++;
      return true;
    }
    return false;
  }

  isDefeated() {
    return this.answered >= this.questions.length || this.hp <= 0;
  }

  draw() {
    super.draw();
    // Boss crown indicator
    if (this.scene && this.container) {
      const crown = this.scene.add.graphics();
      crown.fillStyle(0xFFD700);
      crown.fillTriangle(-10, -44, 10, -44, 0, -58);
      crown.fillCircle(0, -58, 4);
      this.container.add(crown);
    }
  }
}

// Shooting quiz system
class ShootingQuiz {
  constructor(scene) {
    this.scene = scene;
    this.active = false;
    this.correctWord = "";
    this.options = [];
    this.elements = [];
    this.wordBank = "山水火木人口手日月田力子女门车马虫鱼鸟".split("");
  }

  show(correctWord) {
    this.active = true;
    this.correctWord = correctWord;
    const others = this.wordBank.filter(w => w !== correctWord).sort(() => Math.random()-0.5).slice(0,3);
    this.options = [correctWord, ...others].sort(() => Math.random()-0.5);

    // Draw overlay
    const bg = this.scene.add.rectangle(500, 300, 500, 300, 0x000000, 0.85).setDepth(300).setInteractive();
    const qText = this.scene.add.text(500, 220, "Select: " + correctWord, {
      fontSize:"22px", fill:"#FFD700", fontFamily:"Arial",
    }).setOrigin(0.5).setDepth(301);

    this.elements = [bg, qText];

    this.options.forEach((opt, i) => {
      const bx = 340 + i * 95;
      const by = 300;
      const btn = this.scene.add.rectangle(bx, by, 70, 70, 0x444444).setInteractive().setDepth(301);
      const txt = this.scene.add.text(bx, by, opt, {
        fontSize:"28px", fill:"#fff", fontFamily:"Arial",
      }).setOrigin(0.5).setDepth(302);
      this.elements.push(btn, txt);
    });
    return this;
  }

  handleClick(option) {
    if (!this.active) return null;
    this.active = false;
    const correct = option === this.correctWord;

    // Show feedback
    const fb = this.scene.add.text(500, 400,
      correct ? "Correct!" : "Try again!",
      { fontSize:"20px", fill: correct ? "#4CAF50" : "#F44336" }
    ).setOrigin(0.5).setDepth(302);
    this.elements.push(fb);

    // Clean up after delay
    this.scene.time.delayedCall(800, () => {
      this.elements.forEach(e => e.destroy());
      this.elements = [];
    });

    return correct ? this.correctWord : null;
  }

  isActive() { return this.active; }
}

Zombie.createSpecial = function(scene, row, type, param) {
  switch(type) {
    case "wordfamily": return new WordFamilyZombie(scene, row, param);
    case "timed": return new TimedZombie(scene, row, param);
    case "boss": return new BossZombie(scene, row);
    default: return Zombie.create(scene, row, "basic", param);
  }
};