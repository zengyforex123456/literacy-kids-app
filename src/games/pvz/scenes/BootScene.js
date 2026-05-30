class BootScene extends Phaser.Scene {
  constructor(){super('BootScene')}
  create(){
    this.cameras.main.setBackgroundColor('#1a1a2e');
    this.add.text(500,200,'汉字保卫战',{fontSize:'56px',fill:'#FFD700',fontWeight:'bold'}).setOrigin(0.5);
    this.add.text(500,280,'用汉字击败错字兽!',{fontSize:'20px',fill:'#aaa'}).setOrigin(0.5);
    this.add.text(500,360,'点击屏幕开始',{fontSize:'18px',fill:'#fff'}).setOrigin(0.5);
    this.input.once('pointerdown',()=>this.scene.start('GameScene'));
  }
}