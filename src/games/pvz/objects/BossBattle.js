// Boss Battle System (Phaser) - Confusable Words
class ConfusableWordsBoss extends BossZombie {
  constructor(scene, row) {
    super(scene, row);
    this.wordSets = {
      qing: ["晴","睛","清","请","蜻","精","静"],
      bao: ["抱","跑","炮","泡","饱","苞"],
      fang: ["放","房","防","访","仿","芳"],
    };
    const keys = Object.keys(this.wordSets);
    this.currentSet = keys[Math.floor(Math.random()*keys.length)];
    this.confusable = this.wordSets[this.currentSet];
    this.questions = this.generateQuestions();
    this.questionsRequired = 4;
    this.questionsAsked = 0;
    this.currentQ = null;
  }

  generateQuestions() {
    const sentences = {
      "晴":["今天天气真(   )朗","晴"],"睛":["保护眼(   )很重要","睛"],
      "清":["小河的水真(   )澈","清"],"请":["(   )你帮帮我好吗","请"],
      "蜻":["(   )蜓在水面上飞","蜻"],"抱":["妈妈(   )着宝宝","抱"],
      "跑":["小明在操场上(   )步","跑"],"炮":["过年放鞭(   )","炮"],
      "泡":["热水(   )脚很舒服","泡"],"放":["把书(   )在桌子上","放"],
      "房":["我家住在高楼(   )里","房"],"防":["冬天要(   )寒保暖","防"],
    };
    const qs = [];
    for (const w of this.confusable) {
      if (sentences[w]) qs.push(sentences[w]);
    }
    return qs.sort(()=>Math.random()-0.5);
  }

  getQuestion() {
    if (this.questions.length === 0) return null;
    const q = this.questions.pop();
    const correct = q[1];
    const distractors = this.confusable.filter(w=>w!==correct).sort(()=>Math.random()-0.5).slice(0,3);
    return {
      sentence: q[0], correct: correct,
      options: [correct, ...distractors].sort(()=>Math.random()-0.5),
      timeLimit: 10,
    };
  }

  takeDamage(selected) {
    if (!this.currentQ) return false;
    if (selected === this.currentQ.correct) {
      this.hp -= 150; this.questionsAsked++; return true;
    }
    return false;
  }

  isDefeated() { return this.questionsAsked >= this.questionsRequired || this.hp <= 0; }
}

class BossQuizUI {
  constructor(scene) {
    this.scene = scene; this.active = false; this.question = null;
    this.timer = 0; this.elements = [];
  }

  show(qData) {
    this.active = true; this.question = qData; this.timer = qData.timeLimit * 1000;
    const bg = this.scene.add.rectangle(500,300,800,500,0x000000,0.85).setDepth(400).setInteractive();
    const sText = this.scene.add.text(500,180,qData.sentence,{fontSize:"28px",fill:"#fff"}).setOrigin(0.5).setDepth(401);
    const timerBar = this.scene.add.rectangle(500,260,400,10,0x333333).setDepth(401);
    const timerFill = this.scene.add.rectangle(300,260,400,8,0x4CAF50).setDepth(402).setOrigin(0,0);
    this.elements = [bg, sText, timerBar, timerFill];

    qData.options.forEach((opt,i)=>{
      const bx=220+i*150, by=340;
      const btn = this.scene.add.rectangle(bx,by,120,60,0x555555).setInteractive().setDepth(401);
      const txt = this.scene.add.text(bx,by,opt,{fontSize:"28px",fill:"#fff"}).setOrigin(0.5).setDepth(402);
      this.elements.push(btn, txt);
    });
    return this;
  }

  update(delta) {
    if (!this.active) return;
    this.timer -= delta;
    if (this.timer <= 0) { this.active = false; this.clear(); }
  }

  handleClick(option) {
    if (!this.active) return null;
    this.active = false;
    const correct = option === this.question.correct;
    const fb = this.scene.add.text(500,450,correct?"Correct!":"Wrong!",{fontSize:"24px",fill:correct?"#4CAF50":"#F44336"}).setOrigin(0.5).setDepth(402);
    this.elements.push(fb);
    this.scene.time.delayedCall(800, ()=>this.clear());
    return correct ? option : null;
  }

  clear() { this.elements.forEach(e=>e.destroy()); this.elements=[]; this.active=false; }
  isActive() { return this.active; }
}