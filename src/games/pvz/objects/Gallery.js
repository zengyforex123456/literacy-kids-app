// Character Gallery (Phaser)
class CharacterCard {
  constructor(scene, data, x, y, size) {
    this.scene = scene; this.data = data; this.x = x; this.y = y; this.size = size || 70;
    this.mastery = data.mastery_level || 0;
    this.container = null; this.elements = [];
  }

  create() {
    const s = this.size;
    const colors = [0xB4B4B4, 0xE67E22, 0xF1C40F, 0xF1C40F, 0x2ECC71, 0x27AE60];
    const bg = this.scene.add.rectangle(this.x+s/2, this.y+s/2, s, s, colors[Math.min(this.mastery,5)], 1).setStrokeStyle(2, 0xFFFFFF).setInteractive();
    const char = this.scene.add.text(this.x+s/2, this.y+s/3, this.data.character||"?", {fontSize:(s*0.45)+"px",fill:"#fff"}).setOrigin(0.5);
    const pinyin = this.scene.add.text(this.x+s/2, this.y+s-15, this.data.pinyin||"", {fontSize:"11px",fill:"#fff"}).setOrigin(0.5);

    // Stars
    const stars = [];
    for (let i=0; i<5; i++) {
      stars.push(this.scene.add.circle(this.x+12+i*12, this.y+s-30, 4, i<this.mastery?0xFFD700:0x646464));
    }

    this.container = this.scene.add.container(0,0,[bg,char,pinyin,...stars]);
    this.elements = [bg,char,pinyin,...stars];
    bg.on("pointerover",()=>this.scene.tweens.add({targets:this.container,scaleX:1.1,scaleY:1.1,duration:150}));
    bg.on("pointerout",()=>this.scene.tweens.add({targets:this.container,scaleX:1,scaleY:1,duration:150}));
    return bg;
  }

  destroy() { this.elements.forEach(e=>e.destroy()); }
}


class GalleryPage {
  constructor(scene, progressTracker) {
    this.scene = scene; this.tracker = progressTracker;
    this.cards = []; this.showingDetail = false; this.selectedCard = null;
    this.detailElements = [];
  }

  build() {
    this.cards.forEach(c=>c.destroy());
    this.cards = [];
    if (!this.tracker) return;
    const words = this.tracker.data.mastered || {};
    const entries = Object.entries(words).sort();
    const cols = 6, marginX = 40, marginY = 80, size = 80, gap = 16;
    entries.forEach(([char, mastery], i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const card = new CharacterCard(this.scene, {character:char,mastery_level:mastery}, marginX+col*(size+gap), marginY+row*(size+gap), size);
      const bg = card.create();
      bg.on("pointerdown", () => this.showDetail(card));
      this.cards.push(card);
    });
  }

  showDetail(card) {
    this.detailElements.forEach(e=>e.destroy());
    this.detailElements = [];
    this.showingDetail = true; this.selectedCard = card;

    const bg = this.scene.add.rectangle(500,300,500,400,0x1E1E28).setDepth(500).setInteractive();
    bg.on("pointerdown",()=>this.closeDetail());
    const ch = this.scene.add.text(320,160,card.data.character,{fontSize:"72px",fill:"#FFD700"}).setDepth(501);
    const info = [
      `Pinyin: ${card.data.pinyin||"N/A"}`, `Radical: ${card.data.radical||"N/A"}`,
      `Strokes: ${card.data.stroke_count||"N/A"}`, `Mastery: ${"*".repeat(card.mastery)}/5`,
      `Family: ${card.data.word_family||"N/A"}`,
    ];
    const texts = info.map((line,i)=>this.scene.add.text(420,170+i*28,line,{fontSize:"14px",fill:"#ccc"}).setDepth(501));
    this.detailElements = [bg,ch,...texts];
  }

  closeDetail() { this.showingDetail=false; this.detailElements.forEach(e=>e.destroy()); this.detailElements=[]; }
}