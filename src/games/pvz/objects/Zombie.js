// 僵尸基类 + 子类 (Phaser)
class Zombie {
  constructor(scene, row, config) {
    this.scene=scene;this.row=row;this.config=config;
    this.hp=config.hp;this.maxHp=config.hp;this.speed=config.speed;this.damage=config.damage;
    this.x=940;this.y=70+row*100+50;this.alive=true;this.container=null;this.hpBar=null;this.draw();
  }
  draw(){
    const g=this.scene.add.graphics().setDepth(20);
    g.fillStyle(this.config.color);g.fillRect(-15,-10,30,50);
    g.fillStyle(0x556B2F);g.fillCircle(0,-20,14);
    g.fillStyle(0xFF0000);g.fillCircle(-4,-25,3);g.fillCircle(4,-25,3);
    g.fillStyle(0xFFFFFF);g.fillRect(-5,-18,10,3);
    g.fillStyle(this.config.color);g.fillRect(-25,0,12,6);g.fillRect(13,0,12,6);
    const lb=this.scene.add.text(0,-44,this.config.word,{fontSize:'16px',fill:'#fff'}).setOrigin(0.5).setDepth(21);
    this.hpBar=this.scene.add.rectangle(0,-54,30,4,0xFF0000).setDepth(21);
    this.container=this.scene.add.container(this.x,this.y,[g,lb,this.hpBar]).setDepth(20);
  }
  update(delta){
    if(!this.alive)return;
    this.x-=this.speed;this.container.x=this.x;this.container.y=this.y;
    this.hpBar.width=30*(this.hp/this.maxHp);
    if(this.hp<=0)this.die();
  }
  takeDamage(amount){this.hp-=amount;if(this.hp<=0)this.die()}
  die(){
    this.alive=false;this.container.destroy();
    this.scene.score+=10;this.scene.sun+=25;
    this.scene.cameras.main.shake(40,0.002);
    this.scene.add.text(this.x,this.y-20,'+10',{fontSize:'16px',fill:'#FFD700'}).setOrigin(0.5).setDepth(30);
  }
  getCol(){return Math.floor((this.x-80)/90)}
}

class BasicZombie extends Zombie { constructor(s,r,w){super(s,r,{id:'basic',name:'错字兽',word:w,hp:100,speed:0.3,damage:20,color:0x808080})} }
class ConeZombie extends Zombie { constructor(s,r,w){super(s,r,{id:'cone',name:'路障错字兽',word:w,hp:200,speed:0.25,damage:25,color:0xA0522D})} }
class BossZombie extends Zombie { constructor(s,r,w){super(s,r,{id:'boss',name:'Boss错字王',word:w,hp:500,speed:0.15,damage:50,color:0xFF0000})} }

Zombie.create=function(s,r,t,w){switch(t){case'basic':return new BasicZombie(s,r,w);case'cone':return new ConeZombie(s,r,w);case'boss':return new BossZombie(s,r,w);default:return new BasicZombie(s,r,w)}};