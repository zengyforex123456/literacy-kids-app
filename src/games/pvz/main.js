const game = new Phaser.Game({
  type: Phaser.AUTO, width: 1000, height: 600, parent: 'game',
  backgroundColor: '#2d5a2c', scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [BootScene, GameScene]
});
