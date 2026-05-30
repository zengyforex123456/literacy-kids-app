import { useEffect, useRef } from 'react'

export function PhaserPVZGame() {
  const containerRef = useRef<HTMLDivElement>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return; startedRef.current = true
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js'
    script.onload = () => {
      const el = document.getElementById('pvz-game')
      if (!el || el.hasChildNodes()) return
      el.style.width = '100%'; el.style.maxWidth = '1000px'; el.style.margin = '0 auto'
      const Phaser = (window as any).Phaser; if (!Phaser) return

      // ===== TITLE SCENE =====
      class TitleScene extends Phaser.Scene {
        constructor() { super('title') }
        create() {
          this.cameras.main.setBackgroundColor('#1a1a2e')
          this.add.text(500,200,'汉字保卫战',{fontSize:'56px',fill:'#FFD700',fontWeight:'bold'}).setOrigin(0.5)
          this.add.text(500,270,'用汉字击败错字兽!',{fontSize:'20px',fill:'#aaa'}).setOrigin(0.5)
          const btn = this.add.text(500,360,'点击屏幕开始',{fontSize:'20px',fill:'#fff',backgroundColor:'#4CAF50',padding:{x:24,y:12}}).setOrigin(0.5).setInteractive()
          btn.on('pointerdown',()=>this.scene.start('game'))
        }
      }

      // ===== GAME SCENE (Full PVZ) =====
      class GameScene extends Phaser.Scene {
        plants: any[]; zombies: any[]; bullets: any[]; suns: any[]
        grid: any[][]; ro:number; co:number; cw:number; ch:number; sx:number; sy:number
        sun:number; score:number; gameEnd:boolean; selectedPlant:any; wave:number
        cooldowns:Record<string,number>={}; words:string[]=[]

        constructor() { super('game') }

        create() {
          this.sun=200;this.score=0;this.gameEnd=false;this.selectedPlant=null;this.wave=1
          this.ro=5;this.co=9;this.cw=90;this.ch=100;this.sx=80;this.sy=70
          this.grid=Array.from({length:this.ro},()=>Array(this.co).fill(null))
          this.zombies=[];this.bullets=[];this.suns=[]
          this.cooldowns={pea:0,sun:0,nut:0,chili:0}
          this.words='山水火木人口手日月田力子女门车马虫鱼鸟大小多少上下左右中'.split('')
          this.cameras.main.setBackgroundColor('#2d5a2c')

          // Grid
          const gfx=this.add.graphics()
          for(let r=0;r<this.ro;r++)for(let c=0;c<this.co;c++){gfx.lineStyle(1,0xFFFFFF,0.15);gfx.strokeRect(this.sx+c*this.cw,this.sy+r*this.ch,this.cw,this.ch)}

          // UI
          this.sunTxt=this.add.text(10,10,'☀ 阳光: '+this.sun,{fontSize:'18px',fill:'#FFD700'}).setDepth(100)
          this.scoreTxt=this.add.text(780,10,'得分: 0',{fontSize:'18px',fill:'#fff'}).setDepth(100)
          this.waveTxt=this.add.text(10,35,'第 1 波',{fontSize:'14px',fill:'#fff'}).setDepth(100)

          // Plant bar with cooldown
          const plants=[{id:'pea',name:'豌豆射手',w:'豌',cost:50,color:0x228B22,cd:5000},{id:'sun',name:'向日葵',w:'日',cost:50,color:0xFFD700,cd:7000},{id:'nut',name:'坚果墙',w:'坚',cost:50,color:0x8B4513,cd:15000},{id:'chili',name:'火爆辣椒',w:'火',cost:100,color:0xFF4500,cd:30000}]
          this.plantCards=plants.map((p,i)=>{
            const x=40+i*130,y=535
            const bg=this.add.rectangle(x,y,110,50,0x333333).setInteractive().setDepth(99)
            const cd=this.add.rectangle(x,y,110,50,0x000000,0).setDepth(100)
            const cdTxt=this.add.text(x,y,'',{fontSize:'16px',fill:'#fff'}).setOrigin(0.5).setDepth(101)
            bg.on('pointerdown',()=>{if(this.cooldowns[p.id]<=0&&this.sun>=p.cost)this.showQuiz(p)})
            this.add.text(x,y-10,p.name,{fontSize:'12px',fill:'#fff'}).setOrigin(0.5).setDepth(100)
            this.add.text(x,y+8,p.w+' 🌞'+p.cost,{fontSize:'10px',fill:'#aaa'}).setOrigin(0.5).setDepth(100)
            return {bg,cd,cdTxt,plant:p}
          })

          // Grid clicks
          this.input.on('pointerdown',(p:any)=>{if(this.gameEnd||!this.selectedPlant)return;const c=Math.floor((p.x-this.sx)/this.cw);const r=Math.floor((p.y-this.sy)/this.ch);if(r>=0&&r<this.ro&&c>=0&&c<this.co&&!this.grid[r][c]&&this.sun>=this.selectedPlant.cost)this.placePlant(r,c,this.selectedPlant)})

          // Zombie waves
          this.time.addEvent({delay:5000,callback:()=>this.spawnZombie(),loop:true})
          // Sun drops
          this.time.addEvent({delay:7000,callback:()=>this.spawnSun(),loop:true})
        }

        // ===== SUN SYSTEM =====
        spawnSun(){if(this.gameEnd)return;const x=100+Math.random()*800;const s=this.add.circle(x,-20,14,0xFFD700).setDepth(50).setInteractive();s.setStrokeStyle(2,0xFFA000);(s as any).targetY=100+Math.random()*300;(s as any).collected=false;const txt=this.add.text(x,-20,'☀',{fontSize:'18px'}).setOrigin(0.5).setDepth(51);(txt as any).sunCircle=s;this.suns.push({circle:s,text:txt});s.on('pointerdown',()=>{if((s as any).collected)return;(s as any).collected=true;this.sun+=25;this.tweens.add({targets:[s,txt],alpha:0,scale:0.3,x:40,y:20,duration:400,onComplete:()=>{s.destroy();txt.destroy()}})});this.tweens.add({targets:[s,txt],y:(s as any).targetY,duration:3000,ease:'Sine.easeOut'})}

        // ===== QUIZ SYSTEM =====
        showQuiz(plant:any){
          const correct=plant.w
          const opts=[correct,...this.words.filter((w:string)=>w!==correct).slice(0,3)].sort(()=>Math.random()-0.5)
          const bg=this.add.rectangle(500,300,440,220,0x000000,0.92).setDepth(200).setInteractive()
          this.add.text(500,210,'选出「'+correct+'」才能召唤植物!',{fontSize:'20px',fill:'#FFD700'}).setOrigin(0.5).setDepth(201)
          const scene=this
          opts.forEach((o:string,i:number)=>{
            const bx=360+i*90,by=290
            const btn=this.add.rectangle(bx,by,70,70,0x444444).setInteractive().setDepth(201)
            this.add.text(bx,by,o,{fontSize:'30px',fill:'#fff'}).setOrigin(0.5).setDepth(202)
            btn.on('pointerdown',()=>{
              if(o===correct){
                scene.sun-=plant.cost;scene.selectedPlant=plant;scene.cooldowns[plant.id]=plant.cd
                scene.cameras.main.shake(100,0.008)
                scene.add.text(500,360,'✅ 正确! 点击草地种下!',{fontSize:'16px',fill:'#4CAF50'}).setOrigin(0.5).setDepth(202)
                scene.score+=10
              }else{scene.add.text(500,360,'❌ 再试一次',{fontSize:'16px',fill:'#F44336'}).setOrigin(0.5).setDepth(202)}
              scene.time.delayedCall(800,()=>bg.destroy())
            })
          })
        }

        // ===== PLANT PLACEMENT =====
        placePlant(r:number,c:number,p:any){
          const x=this.sx+c*this.cw+this.cw/2,y=this.sy+r*this.ch+this.ch/2
          const g=this.add.graphics().setDepth(10);g.fillStyle(0x006400);g.fillRect(x-4,y+8,8,28);g.fillStyle(p.color);g.fillCircle(x,y-3,18);g.fillStyle(0xFFFFFF);g.fillCircle(x-6,y-9,5);g.fillCircle(x+6,y-9,5);g.fillStyle(p.color);g.fillRect(x+7,y-11,20,12)
          this.add.text(x,y+38,p.w,{fontSize:'12px',fill:'#FFD700'}).setOrigin(0.5).setDepth(11)
          // Placement sparkle
          for(let i=0;i<6;i++){const sx=x+(Math.random()-0.5)*30,sy=y+(Math.random()-0.5)*30;const sp=this.add.circle(sx,sy,3,0xFFFF00).setDepth(12);this.tweens.add({targets:sp,alpha:0,scale:0,duration:400,onComplete:()=>sp.destroy()})}
          this.grid[r][c]={g,plant:p,hp:300,row:r,col:c,timer:0}
          this.selectedPlant=null
        }

        // ===== ZOMBIE SPAWN =====
        spawnZombie(){
          if(this.gameEnd)return
          const r=Phaser.Math.Between(0,4),x=930,y=this.sy+r*this.ch+50
          const w=this.words[Phaser.Math.Between(0,this.words.length-1)]
          const g=this.add.graphics().setDepth(20);g.fillStyle(0x808080);g.fillRect(-15,-10,30,50);g.fillStyle(0x556B2F);g.fillCircle(0,-20,14);g.fillStyle(0xFF0000);g.fillCircle(-4,-25,3);g.fillCircle(4,-25,3);g.fillStyle(0xFFFFFF);g.fillRect(-5,-18,10,3)
          const lb=this.add.text(0,-44,w,{fontSize:'16px',fill:'#fff'}).setOrigin(0.5).setDepth(21)
          const hpBg=this.add.rectangle(0,-54,32,5,0x333333).setDepth(21);const hpFill=this.add.rectangle(-16,-54,32,5,0xFF0000).setDepth(22).setOrigin(0,0.5)
          const z=this.add.container(x,y,[g,lb,hpBg,hpFill]).setDepth(20)
          ;(z as any).zRow=r;(z as any).zHp=100;(z as any).zMaxHp=100;(z as any).zSpeed=0.3;(z as any).zHpBar=hpFill
          this.zombies.push(z)
          // Wave alert at 5 zombies
          if(this.zombies.length%5===0){const alert=this.add.text(500,250,'⚠ 一大波错字兽来袭!',{fontSize:'28px',fill:'#FF0000',fontWeight:'bold',stroke:'#000',strokeThickness:3}).setOrigin(0.5).setDepth(300);this.tweens.add({targets:alert,alpha:0,y:200,duration:2000,onComplete:()=>alert.destroy()})}
        }

        // ===== MAIN UPDATE =====
        update(_time:number,delta:number){
          if(this.gameEnd)return

          // Update cooldowns
          for(const k in this.cooldowns){if(this.cooldowns[k]>0)this.cooldowns[k]-=delta}
          this.plantCards.forEach((card:any)=>{const cd=Math.max(0,this.cooldowns[card.plant.id]);const pct=this.cooldowns[card.plant.id]>0?Math.min(1,this.cooldowns[card.plant.id]/card.plant.cd):0;card.cd.setAlpha(pct*0.6);if(pct>0){card.cdTxt.setText(Math.ceil(this.cooldowns[card.plant.id]/1000)+'s')}else{card.cdTxt.setText('')}})

          // Update zombies
          for(let zi=this.zombies.length-1;zi>=0;zi--){
            const z=this.zombies[zi] as any
            if(!z||!z.active){this.zombies.splice(zi,1);continue}
            z.x-=z.zSpeed
            const col=Math.floor((z.x-this.sx)/this.cw)
            if(col>=0&&col<this.co&&this.grid[z.zRow]&&this.grid[z.zRow][col]){z.zSpeed=0;this.grid[z.zRow][col].hp-=0.3;if(this.grid[z.zRow][col].hp<=0){this.grid[z.zRow][col].g.destroy();this.grid[z.zRow][col]=null;z.zSpeed=0.3;this.cameras.main.shake(60,0.004)}}
            // Plants shoot
            for(let r=0;r<this.ro;r++)for(let c=0;c<this.co;c++){const cell=this.grid[r]?.[c];if(cell&&r===z.zRow){cell.timer+=delta;if(cell.timer>1000){cell.timer=0;const bx=this.sx+c*this.cw+this.cw/2+20,by=this.sy+r*this.ch+this.ch/2-10;const b=this.add.circle(bx,by,5,0x00FF00).setDepth(15);this.bullets.push({obj:b,row:r,trail:[]})}}}
            // Bullet hit
            for(let bi=this.bullets.length-1;bi>=0;bi--){const b=this.bullets[bi];if(!b||!b.obj||!b.obj.active){this.bullets.splice(bi,1);continue}b.obj.x+=5;if(Phaser.Math.Distance.Between(b.obj.x,b.obj.y,z.x,z.y)<30){b.obj.destroy();this.bullets.splice(bi,1);z.zHp-=25;z.zHpBar.width=32*(Math.max(z.zHp,0)/z.zMaxHp);const dmg=this.add.text(z.x,z.y-30,'-25',{fontSize:'16px',fill:'#FF4444',fontWeight:'bold'}).setOrigin(0.5).setDepth(30);this.tweens.add({targets:dmg,alpha:0,y:dmg.y-30,duration:600,onComplete:()=>dmg.destroy()});if(z.zHp<=0){for(let p=0;p<8;p++){const px=this.add.circle(z.x+(Math.random()-0.5)*20,z.y+(Math.random()-0.5)*30,3,0x808080).setDepth(30);this.tweens.add({targets:px,alpha:0,x:px.x+(Math.random()-0.5)*60,y:px.y-30,duration:500,onComplete:()=>px.destroy()})}z.destroy();this.zombies.splice(zi,1);this.score+=10;this.sun+=25;this.cameras.main.shake(40,0.002);break}}}
          }

          this.sunTxt.setText('☀ 阳光: '+Math.floor(this.sun))
          this.scoreTxt.setText('得分: '+this.score)
          if(this.score>=120&&!this.gameEnd){this.gameEnd=true;this.showWin()}
        }

        // ===== VICTORY =====
        showWin(){
          const bg=this.add.rectangle(500,280,450,280,0x000000,0.9).setDepth(300)
          this.add.text(500,170,'🎉 保卫成功!',{fontSize:'44px',fill:'#FFD700'}).setOrigin(0.5).setDepth(301)
          this.add.text(500,240,'得分: '+this.score+' | 学会了 '+Math.floor(this.score/5)+' 个字',{fontSize:'20px',fill:'#fff'}).setOrigin(0.5).setDepth(301)
          for(let i=0;i<15;i++){const sx=200+Math.random()*600,sy=100+Math.random()*200;const star=this.add.text(sx,sy,'⭐',{fontSize:'24px'}).setOrigin(0.5).setDepth(302);this.tweens.add({targets:star,y:star.y+30,alpha:0,duration:1000+Math.random()*1000,delay:Math.random()*500})}
          const btn=this.add.rectangle(500,340,180,55,0x4CAF50).setInteractive().setDepth(301)
          this.add.text(500,340,'🔄 再来一局',{fontSize:'20px',fill:'#fff'}).setOrigin(0.5).setDepth(302)
          btn.on('pointerdown',()=>this.scene.restart())
        }
      }

      new Phaser.Game({type:Phaser.AUTO,width:1000,height:600,parent:'pvz-game',backgroundColor:'#2d5a2c',scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[TitleScene,GameScene]})
    }
    document.head.appendChild(script)
    return () => { script.remove() }
  }, [])

  return (<div style={{minHeight:'100vh',background:'#1a1a2e',display:'flex',alignItems:'center',justifyContent:'center'}}><div ref={containerRef} id='pvz-game'/></div>)
}