class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }
  create() {
    this.sun=150;this.score=0;this.wave=1;this.gameEnd=false;
    this.ro=5;this.co=9;this.cw=90;this.ch=100;this.sx=80;this.sy=70;
    this.grid=Array.from({length:this.ro},()=>Array(this.co).fill(null));
    this.zombies=[];this.bullets=[];this.selectedPlant=null;
    this.words='山水火木人口手日月田力子女门车马虫鱼鸟'.split('');
    this.learnedWords=JSON.parse(localStorage.getItem('pvz_learned')||'[]');
    this.gfx=this.add.graphics();
    for(let r=0;r<this.ro;r++)for(let c=0;c<this.co;c++){this.gfx.lineStyle(1,0xFFFFFF,0.15);this.gfx.strokeRect(this.sx+c*this.cw,this.sy+r*this.ch,this.cw,this.ch)}
    this.sunTxt=this.add.text(10,10,'阳光: '+this.sun,{fontSize:'18px',fill:'#FFD700'}).setDepth(100);
    this.waveTxt=this.add.text(10,35,'第 '+this.wave+' 波',{fontSize:'14px',fill:'#fff'}).setDepth(100);
    this.scoreTxt=this.add.text(800,10,'得分: 0',{fontSize:'18px',fill:'#fff'}).setDepth(100);
    this.learnedTxt=this.add.text(800,35,'已学: '+this.learnedWords.length+'字',{fontSize:'14px',fill:'#4CAF50'}).setDepth(100);
    this.createPlantBar();
    this.input.on('pointerdown',(p)=>{
      if(this.gameEnd||!this.selectedPlant)return;
      const c=Math.floor((p.x-this.sx)/this.cw);
      const r=Math.floor((p.y-this.sy)/this.ch);
      if(r>=0&&r<this.ro&&c>=0&&c<this.co&&!this.grid[r][c]&&this.sun>=this.selectedPlant.cost)this.showQuiz(this.selectedPlant,r,c);
    });
    this.time.addEvent({delay:5000,callback:()=>this.spawnZombie(),loop:true});
    this.time.addEvent({delay:6000,callback:()=>{this.sun+=25},loop:true});
  }
  createPlantBar(){
    const plants=[{id:'pea',name:'豌豆射手',word:'豌',cost:50,color:0x228B22},{id:'sun',name:'向日葵',word:'日',cost:50,color:0xFFD700},{id:'nut',name:'坚果墙',word:'坚',cost:50,color:0x8B4513},{id:'chili',name:'火爆辣椒',word:'火',cost:100,color:0xFF4500}];
    plants.forEach((p,i)=>{
      const x=40+i*120,y=540;
      const bg=this.add.rectangle(x,y,100,50,0x333333).setInteractive().setDepth(99);
      bg.on('pointerdown',()=>{this.selectedPlant=p});
      this.add.text(x,y-10,p.name,{fontSize:'12px',fill:'#fff'}).setOrigin(0.5).setDepth(100);
      this.add.text(x,y+8,p.word+' Sun'+p.cost,{fontSize:'10px',fill:'#aaa'}).setOrigin(0.5).setDepth(100);
    });
  }
  showQuiz(plant,r,c){
    const correct=plant.word;
    const opts=[correct,...this.words.filter(w=>w!==correct).slice(0,3)].sort(()=>Math.random()-0.5);
    const bg=this.add.rectangle(500,300,420,220,0x000000,0.92).setDepth(200).setInteractive();
    this.add.text(500,210,'选出「'+correct+'」',{fontSize:'22px',fill:'#FFD700'}).setOrigin(0.5).setDepth(201);
    const elems=[bg];
    opts.forEach((o,i)=>{
      const bx=370+i*85,by=290;
      const btn=this.add.rectangle(bx,by,65,65,0x444444).setInteractive().setDepth(201);
      const txt=this.add.text(bx,by,o,{fontSize:'28px',fill:'#fff'}).setOrigin(0.5).setDepth(202);
      elems.push(btn,txt);
      btn.on('pointerdown',()=>{
        if(o===correct){
          this.sun-=plant.cost;this.placePlant(r,c,plant);
          this.cameras.main.shake(80,0.005);
          this.add.text(500,340,'正确!',{fontSize:'18px',fill:'#4CAF50'}).setOrigin(0.5).setDepth(202);
          if(!this.learnedWords.includes(correct)){this.learnedWords.push(correct);localStorage.setItem('pvz_learned',JSON.stringify(this.learnedWords))}
          this.learnedTxt.setText('已学: '+this.learnedWords.length+'字');this.score+=10;
        }else{this.add.text(500,340,'再试!',{fontSize:'18px',fill:'#F44336'}).setOrigin(0.5).setDepth(202)}
        this.time.delayedCall(500,()=>elems.forEach(e=>e.destroy()));
      });
    });
  }
  placePlant(r,c,p){
    const x=this.sx+c*this.cw+this.cw/2,y=this.sy+r*this.ch+this.ch/2;
    const g=this.add.graphics().setDepth(10);
    g.fillStyle(0x006400);g.fillRect(x-4,y+8,8,28);g.fillStyle(p.color);g.fillCircle(x,y-3,18);
    g.fillStyle(0xFFFFFF);g.fillCircle(x-6,y-9,5);g.fillCircle(x+6,y-9,5);
    g.fillStyle(0x000000);g.fillCircle(x-5,y-10,2);g.fillCircle(x+5,y-10,2);
    g.fillStyle(p.color);g.fillRect(x+7,y-11,20,12);
    const lb=this.add.text(x,y+38,p.word,{fontSize:'12px',fill:'#FFD700'}).setOrigin(0.5).setDepth(11);
    this.grid[r][c]={graphics:g,label:lb,hp:300,color:p.color,row:r,col:c,timer:0};
    this.selectedPlant=null;this.updateUI();
  }
  spawnZombie(){
    if(this.gameEnd)return;
    const r=Phaser.Math.Between(0,4),x=940,y=this.sy+r*this.ch+50;
    const w=this.words[this.wave%this.words.length];
    const g=this.add.graphics().setDepth(20);
    g.fillStyle(0x808080);g.fillRect(-15,-10,30,50);g.fillStyle(0x556B2F);g.fillCircle(0,-20,14);
    g.fillStyle(0xFF0000);g.fillCircle(-4,-25,3);g.fillCircle(4,-25,3);
    g.fillStyle(0xFFFFFF);g.fillRect(-5,-18,10,3);
    const lb=this.add.text(0,-44,w,{fontSize:'16px',fill:'#fff'}).setOrigin(0.5).setDepth(21);
    const hpBar=this.add.rectangle(0,-54,30,4,0xFF0000).setDepth(21);
    const cont=this.add.container(x,y,[g,lb,hpBar]).setDepth(20);
    cont.zRow=r;cont.zHp=100+this.wave*20;cont.zMaxHp=cont.zHp;cont.zWord=w;cont.zSpeed=0.3+this.wave*0.03;cont.zHpBar=hpBar;
    this.zombies.push(cont);
  }
  update(time,delta){
    if(this.gameEnd)return;
    for(let zi=this.zombies.length-1;zi>=0;zi--){
      const z=this.zombies[zi];
      if(!z.active){this.zombies.splice(zi,1);continue}
      z.x-=z.zSpeed;
      const c=Math.floor((z.x-this.sx)/this.cw);
      if(c>=0&&c<this.co&&this.grid[z.zRow]&&this.grid[z.zRow][c]){z.zSpeed=0;this.grid[z.zRow][c].hp-=0.3;if(this.grid[z.zRow][c].hp<=0){this.grid[z.zRow][c].graphics.destroy();if(this.grid[z.zRow][c].label)this.grid[z.zRow][c].label.destroy();this.grid[z.zRow][c]=null;z.zSpeed=0.3+this.wave*0.03}}
      for(let r=0;r<this.ro;r++)for(let c=0;c<this.co;c++){
        const cell=this.grid[r][c];
        if(cell&&r===z.zRow){cell.timer+=delta;if(cell.timer>1000){cell.timer=0;const bx=this.sx+c*this.cw+this.cw/2+20,by=this.sy+r*this.ch+this.ch/2-10;this.bullets.push({obj:this.add.circle(bx,by,5,0x00FF00).setDepth(15),row:r})}}
      }
      for(let bi=this.bullets.length-1;bi>=0;bi--){
        const b=this.bullets[bi];
        if(!b.obj.active){this.bullets.splice(bi,1);continue}
        b.obj.x+=4;
        if(Phaser.Math.Distance.Between(b.obj.x,b.obj.y,z.x,z.y)<35){b.obj.destroy();this.bullets.splice(bi,1);z.zHp-=25;z.zHpBar.width=30*(z.zHp/z.zMaxHp);if(z.zHp<=0){z.destroy();this.zombies.splice(zi,1);this.score+=10;this.sun+=25;this.add.text(z.x,z.y-20,'+10',{fontSize:'16px',fill:'#FFD700'}).setOrigin(0.5).setDepth(30);this.cameras.main.shake(40,0.002);break}}
      }
    }
    this.updateUI();
    if(this.score>=100&&!this.gameEnd){this.gameEnd=true;this.showWin()}
  }
  updateUI(){this.sunTxt.setText('阳光: '+this.sun);this.scoreTxt.setText('得分: '+this.score)}
  showWin(){
    const bg=this.add.rectangle(500,300,500,350,0x000000,0.9).setDepth(300);
    this.add.text(500,160,'保卫成功!',{fontSize:'48px',fill:'#FFD700'}).setOrigin(0.5).setDepth(301);
    this.add.text(500,230,'学会了 '+this.learnedWords.length+' 个字',{fontSize:'22px',fill:'#fff'}).setOrigin(0.5).setDepth(301);
    this.add.text(500,280,'得分: '+this.score,{fontSize:'18px',fill:'#aaa'}).setOrigin(0.5).setDepth(301);
    const btn=this.add.rectangle(500,360,200,60,0x4CAF50).setInteractive().setDepth(301);
    this.add.text(500,360,'再来一局',{fontSize:'22px',fill:'#fff'}).setOrigin(0.5).setDepth(302);
    btn.on('pointerdown',()=>this.scene.restart());
  }
}