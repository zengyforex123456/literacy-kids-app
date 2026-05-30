import { useEffect, useRef } from 'react'
import { SpriteAnimator } from './SpriteAnimator'

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

      const plantAnims = SpriteAnimator.createPlantAnimations()
      const zombieAnims = SpriteAnimator.createZombieAnimations()

      // ===== TITLE SCENE =====
      class TitleScene extends Phaser.Scene {
        constructor() { super('title') }
        create() {
          this.cameras.main.setBackgroundColor('#1a1a2e')
          const t = this.add.text(500,200,'汉字保卫战',{fontSize:'56px',fill:'#FFD700',fontWeight:'bold'}).setOrigin(0.5).setAlpha(0)
          const s = this.add.text(500,280,'用汉字击败错字兽!',{fontSize:'20px',fill:'#aaa'}).setOrigin(0.5).setAlpha(0)
          this.tweens.add({targets:t,alpha:1,y:180,duration:600,ease:'Back.easeOut'})
          this.tweens.add({targets:s,alpha:1,duration:600,delay:200})
          // Animated demo peashooter in background
          for(let i=0;i<5;i++){
            const px=150+i*180,py=420
            const g=this.add.graphics().setAlpha(0)
            this.tweens.add({targets:g,alpha:0.3,delay:500+i*150,duration:400})
            this.time.addEvent({delay:300,loop:true,callback:()=>{
              g.clear()
              const frame=Math.floor(Date.now()/400)%4
              plantAnims.peashooter.idle[frame](g,px,py,1)
            }})
          }
          const btn = this.add.text(500,380,'点击屏幕开始',{fontSize:'20px',fill:'#fff',backgroundColor:'#4CAF50',padding:{x:28,y:14}}).setOrigin(0.5).setInteractive()
          btn.on('pointerover',()=>btn.setScale(1.05))
          btn.on('pointerout',()=>btn.setScale(1))
          btn.on('pointerdown',()=>this.scene.start('game'))
        }
      }

      // ===== GAME SCENE =====
      class GameScene extends Phaser.Scene {
        plants:any[]=[];zombies:any[]=[];bullets:any[]=[];suns:any[]=[];mowers:any[]=[]
        grid:any[][]=[];ro=5;co=9;cw=90;ch=100;sx=80;sy=70
        sun=200;score=0;gameEnd=false;selectedPlant=null as any;wave=1
        cooldowns:Record<string,number>={pea:0,sun:0,nut:0,chili:0}
        words:string[]='山水火木人口手日月田力子女门车马虫鱼鸟大小多少上下左右中'.split('')
        plantCards:any[]=[];animFrame=0

        constructor() { super('game') }

        create() {
          this.cameras.main.setBackgroundColor('#2d5a2c')
          // Draw lawn with alternating shades
          const gfx=this.add.graphics()
          for(let r=0;r<this.ro;r++)for(let c=0;c<this.co;c++){
            const shade=(r+c)%2===0?0x4CAF50:0x388E3C
            gfx.fillStyle(shade);gfx.fillRect(this.sx+c*this.cw,this.sy+r*this.ch,this.cw,this.ch)
            gfx.lineStyle(1,0xFFFFFF,0.1);gfx.strokeRect(this.sx+c*this.cw,this.sy+r*this.ch,this.cw,this.ch)
          }
          // Road/path at top
          gfx.fillStyle(0x8B7355);gfx.fillRect(0,0,1000,60)

          // UI
          this.sunTxt=this.add.text(10,12,'☀ 阳光: '+this.sun,{fontSize:'18px',fill:'#FFD700',stroke:'#000',strokeThickness:2}).setDepth(100)
          this.scoreTxt=this.add.text(800,12,'得分: 0',{fontSize:'18px',fill:'#fff',stroke:'#000',strokeThickness:2}).setDepth(100)
          this.waveTxt=this.add.text(400,12,'第 1 波',{fontSize:'16px',fill:'#FFEB3B',stroke:'#000',strokeThickness:2}).setOrigin(0.5,0).setDepth(100)

          // Plant bar with animated cards
          const plantDefs=[{id:'pea',name:'豌豆射手',w:'豌',cost:50,color:0x228B22,cd:5000,key:'peashooter'},{id:'sun',name:'向日葵',w:'日',cost:50,color:0xFFD700,cd:7000,key:'sunflower'},{id:'nut',name:'坚果墙',w:'坚',cost:50,color:0x8B4513,cd:15000,key:'wallnut'},{id:'chili',name:'火爆辣椒',w:'火',cost:100,color:0xFF4500,cd:30000,key:'peashooter'}]
          plantDefs.forEach((p,i)=>{
            const x=40+i*130,y=535
            const bg=this.add.rectangle(x,y,110,50,0x263238).setStrokeStyle(2,0x4CAF50).setInteractive().setDepth(99)
            const cdOverlay=this.add.rectangle(x,y,110,50,0x000000,0).setDepth(100)
            const cdText=this.add.text(x,y,'',{fontSize:'16px',fill:'#fff'}).setOrigin(0.5).setDepth(101)
            bg.on('pointerdown',()=>{if(this.cooldowns[p.id]<=0&&this.sun>=p.cost)this.showQuiz(p)})
            bg.on('pointerover',()=>{if(this.cooldowns[p.id]<=0)this.tweens.add({targets:bg,scaleX:1.05,scaleY:1.05,duration:100})})
            bg.on('pointerout',()=>{this.tweens.add({targets:bg,scaleX:1,scaleY:1,duration:100})})
            // Mini plant icon on card
            const icon=this.add.graphics().setDepth(100)
            plantAnims[p.key]?.idle?.[0]?.(icon,x-35,y-2,0.6)
            this.add.text(x+5,y-12,p.name,{fontSize:'12px',fill:'#fff'}).setOrigin(0.5).setDepth(100)
            this.add.text(x+5,y+8,p.w+' ☀'+p.cost,{fontSize:'10px',fill:'#FFD700'}).setOrigin(0.5).setDepth(100)
            this.plantCards.push({bg,cd:cdOverlay,cdTxt:cdText,def:p,icon,x:40+i*130})
          })

          // Grid click to place
          this.input.on('pointerdown',(p:any)=>{
            if(this.gameEnd||!this.selectedPlant)return
            const c=Math.floor((p.x-this.sx)/this.cw);const r=Math.floor((p.y-this.sy)/this.ch)
            if(r>=0&&r<this.ro&&c>=0&&c<this.co&&!this.grid[r][c]&&this.sun>=this.selectedPlant.cost)this.placePlant(r,c,this.selectedPlant)
          })

          // Mowers
          this.mowers=[]
          for(let r=0;r<this.ro;r++){
            const g=this.add.graphics().setDepth(25)
            g.fillStyle(0xCC0000);g.fillRect(10,this.sy+r*this.ch+50-8,20,16)
            g.fillStyle(0xFFD700);g.fillRect(14,this.sy+r*this.ch+50-10,12,6)
            g.fillStyle(0x333333);g.fillCircle(15,this.sy+r*this.ch+50,3)
            ;(g as any).used=false;this.mowers.push(g)
          }

          // Timers
          this.time.addEvent({delay:5000,callback:()=>this.spawnZombie(),loop:true})
          this.time.addEvent({delay:7000,callback:()=>this.spawnSun(),loop:true})
          // Animation timer
          this.time.addEvent({delay:200,loop:true,callback:()=>{this.animFrame=(this.animFrame+1)%120}})
        }

        spawnSun(){
          if(this.gameEnd)return
          const x=100+Math.random()*800;const s=this.add.circle(x,-20,14,0xFFD700).setDepth(50).setInteractive()
          s.setStrokeStyle(2,0xFFA000);(s as any).targetY=100+Math.random()*300;(s as any).collected=false
          const t=this.add.text(x,-20,'☀',{fontSize:'18px'}).setOrigin(0.5).setDepth(51)
          const glow=this.add.circle(x,-20,22,0xFFFF00,0.2).setDepth(49)
          this.tweens.add({targets:glow,alpha:0.4,scale:1.3,duration:800,yoyo:true,repeat:-1})
          this.suns.push({circle:s,text:t,glow})
          s.on('pointerdown',()=>{if((s as any).collected)return;(s as any).collected=true;this.sun+=25
            this.tweens.add({targets:[s,t,glow],alpha:0,scale:0.3,x:60,y:25,duration:400,
              onComplete:()=>{s.destroy();t.destroy();glow.destroy()}})})
          this.tweens.add({targets:[s,t,glow],y:(s as any).targetY,duration:3000,ease:'Sine.easeOut'})
        }

        showQuiz(plant:any){
          const correct=plant.w;const opts=[correct,...this.words.filter((w:string)=>w!==correct).slice(0,3)].sort(()=>Math.random()-0.5)
          const bg=this.add.rectangle(500,300,460,240,0x000000,0.94).setDepth(200).setInteractive().setStrokeStyle(3,0xFFD700)
          this.add.text(500,210,'选出「'+correct+'」召唤 '+plant.name+'!',{fontSize:'20px',fill:'#FFD700'}).setOrigin(0.5).setDepth(201)
          const scene=this;const elems:any[]=[bg]
          opts.forEach((o:string,i:number)=>{
            const bx=350+i*95,by=290;const btn=this.add.rectangle(bx,by,75,75,0x444444).setInteractive().setDepth(201).setStrokeStyle(2,0x888888)
            const txt=this.add.text(bx,by,o,{fontSize:'32px',fill:'#fff'}).setOrigin(0.5).setDepth(202)
            elems.push(btn,txt)
            btn.on('pointerover',()=>{btn.setFillStyle(0x666666)})
            btn.on('pointerout',()=>{btn.setFillStyle(0x444444)})
            btn.on('pointerdown',()=>{
              if(o===correct){scene.sun-=plant.cost;scene.selectedPlant=plant;scene.cooldowns[plant.id]=plant.cd
                scene.cameras.main.shake(120,0.01);scene.score+=10
                scene.add.text(500,365,'✅ 正确! 点击草地种下!',{fontSize:'16px',fill:'#4CAF50'}).setOrigin(0.5).setDepth(202)
              }else{scene.add.text(500,365,'❌ 再试',{fontSize:'16px',fill:'#F44336'}).setOrigin(0.5).setDepth(202)}
              scene.time.delayedCall(800,()=>elems.forEach(e=>e.destroy()))
            })
          })
        }

        placePlant(r:number,c:number,p:any){
          const x=this.sx+c*this.cw+this.cw/2,y=this.sy+r*this.ch+this.ch/2
          const g=this.add.graphics().setDepth(10)
          // Placement sparkle effect
          for(let i=0;i<8;i++){const sx=x+(Math.random()-0.5)*40,sy=y+(Math.random()-0.5)*40;const sp=this.add.circle(sx,sy,3,0xFFFF00).setDepth(12);this.tweens.add({targets:sp,alpha:0,scale:0,duration:500,onComplete:()=>sp.destroy()})}
          // Plant label
          const lb=this.add.text(x,y+40,p.w,{fontSize:'12px',fill:'#FFD700',stroke:'#000',strokeThickness:2}).setOrigin(0.5).setDepth(11)
          this.grid[r][c]={g,lb,plant:p,hp:300,row:r,col:c,timer:0,animType:p.key||'peashooter'}
          this.selectedPlant=null as any;this.sunTxt.setText('☀ 阳光: '+Math.floor(this.sun))
          // Scale-in animation
          g.setScale(0);this.tweens.add({targets:g,scaleX:1,scaleY:1,duration:300,ease:'Back.easeOut'})
        }

        spawnZombie(){
          if(this.gameEnd)return
          const r=Phaser.Math.Between(0,4),x=960,y=this.sy+r*this.ch+50
          const w=this.words[Phaser.Math.Between(0,this.words.length-1)]
          const g=this.add.graphics().setDepth(20)
          const lb=this.add.text(0,-48,w,{fontSize:'18px',fill:'#fff',stroke:'#000',strokeThickness:3}).setOrigin(0.5).setDepth(21)
          const hpBg=this.add.rectangle(0,-60,34,6,0x333333).setDepth(21)
          const hpFill=this.add.rectangle(-17,-60,34,6,0xFF0000).setDepth(22).setOrigin(0,0.5)
          const z=this.add.container(x,y,[g,lb,hpBg,hpFill]).setDepth(20)
          ;(z as any).zRow=r;(z as any).zHp=100;(z as any).zMaxHp=100;(z as any).zSpeed=0.3;(z as any).zHpBar=hpFill;(z as any).zGraphics=g;(z as any).zWalkFrame=0;(z as any).zWobble=0
          this.zombies.push(z)
          // Wave alert
          if(this.zombies.length===5){this.wave=2;this.waveTxt.setText('第 2 波')
            const a=this.add.text(500,250,'⚠ 一大波错字兽来袭!',{fontSize:'30px',fill:'#FF1744',fontWeight:'bold',stroke:'#000',strokeThickness:4}).setOrigin(0.5).setDepth(300).setScale(0)
            this.tweens.add({targets:a,scaleX:1,scaleY:1,duration:500,ease:'Back.easeOut'})
            this.tweens.add({targets:a,alpha:0,y:200,duration:2000,delay:1000,onComplete:()=>a.destroy()})
          }
        }

        update(_time:number,delta:number){
          if(this.gameEnd)return
          const af=this.animFrame
          // Cooldowns
          for(const k in this.cooldowns){if(this.cooldowns[k]>0)this.cooldowns[k]-=delta}
          this.plantCards.forEach((c:any)=>{
            const cd=this.cooldowns[c.def.id];const pct=cd>0?Math.min(1,cd/c.def.cd):0
            c.cd.setAlpha(pct*0.55)
            if(pct>0){c.cdTxt.setText(Math.ceil(cd/1000)+'s')}else{c.cdTxt.setText('')}
            if(pct>0&&pct<1){c.cd.setFillStyle(0x000000)}else{c.cd.setAlpha(0)}
          })
          // Animate plants
          for(let r=0;r<this.ro;r++)for(let c=0;c<this.co;c++){
            const cell=this.grid[r]?.[c];if(!cell)continue
            cell.g.clear()
            const frameIdx=Math.floor(af/15+cell.row+cell.col)%4
            const anim=plantAnims[cell.animType]?.idle?.[frameIdx]
            if(anim){const px=this.sx+c*this.cw+this.cw/2;const py=this.sy+r*this.ch+this.ch/2;anim(cell.g,px,py,1)}
            cell.timer+=delta
          }
          // Animate zombies
          for(let zi=this.zombies.length-1;zi>=0;zi--){
            const z=this.zombies[zi] as any;if(!z||!z.active){this.zombies.splice(zi,1);continue}
            z.x-=z.zSpeed;z.zWalkFrame+=delta/200
            const col=Math.floor((z.x-this.sx)/this.cw)
            // Mower trigger
            if(col<=0&&this.mowers[z.zRow]&&!(this.mowers[z.zRow] as any).used){(this.mowers[z.zRow] as any).used=true
              this.tweens.add({targets:this.mowers[z.zRow],x:1200,duration:1500})
              for(let j=this.zombies.length-1;j>=0;j--){const zz=this.zombies[j] as any;if(zz.zRow===z.zRow){zz.destroy();this.zombies.splice(j,1);this.score+=5}}
            }
            // Eat plant
            if(col>=0&&col<this.co&&this.grid[z.zRow]?.[col]){z.zSpeed=0;this.grid[z.zRow][col].hp-=0.3
              if(this.grid[z.zRow][col].hp<=0){this.grid[z.zRow][col].g.destroy();this.grid[z.zRow][col].lb.destroy();this.grid[z.zRow][col]=null;z.zSpeed=0.3}}
            // Redraw zombie with walk animation
            z.zGraphics.clear()
            const walkFrame=Math.floor(z.zWalkFrame)%4
            zombieAnims.normal.walk[walkFrame](z.zGraphics,0,0,1)
            // Shoot
            for(let r=0;r<this.ro;r++)for(let c=0;c<this.co;c++){const cell=this.grid[r]?.[c];if(cell&&r===z.zRow&&cell.timer>1000){cell.timer=0
              const bx=this.sx+c*this.cw+this.cw/2+20,by=this.sy+r*this.ch+this.ch/2-10
              const b=this.add.circle(bx,by,5,0x00FF00).setDepth(15);this.bullets.push({obj:b,row:r})}}
            // Bullet hits
            for(let bi=this.bullets.length-1;bi>=0;bi--){const b=this.bullets[bi];if(!b?.obj?.active){this.bullets.splice(bi,1);continue}
              b.obj.x+=5;if(Phaser.Math.Distance.Between(b.obj.x,b.obj.y,z.x,z.y)<30){b.obj.destroy();this.bullets.splice(bi,1)
                z.zHp-=25;z.zHpBar.width=34*(Math.max(z.zHp,0)/z.zMaxHp)
                const dmg=this.add.text(z.x,z.y-35,'-25',{fontSize:'16px',fill:'#FF4444',fontWeight:'bold',stroke:'#000',strokeThickness:2}).setOrigin(0.5).setDepth(30)
                this.tweens.add({targets:dmg,alpha:0,y:dmg.y-30,duration:600,onComplete:()=>dmg.destroy()})
                if(z.zHp<=0){for(let p=0;p<10;p++){const px=this.add.circle(z.x+(Math.random()-0.5)*30,z.y+(Math.random()-0.5)*40,3,0x808080).setDepth(30);this.tweens.add({targets:px,alpha:0,y:px.y-40,x:px.x+(Math.random()-0.5)*50,duration:500,onComplete:()=>px.destroy()})}
                  z.destroy();this.zombies.splice(zi,1);this.score+=10;this.sun+=25;this.cameras.main.shake(50,0.003);break}}
            }
          }
          this.sunTxt.setText('☀ 阳光: '+Math.floor(this.sun))
          this.scoreTxt.setText('得分: '+this.score)
          if(this.score>=150&&!this.gameEnd){this.gameEnd=true;this.showWin()}
        }

        showWin(){
          const bg=this.add.rectangle(500,280,500,320,0x000000,0.92).setDepth(300).setStrokeStyle(3,0xFFD700)
          this.add.text(500,160,'🎉 保卫成功!',{fontSize:'44px',fill:'#FFD700',stroke:'#000',strokeThickness:3}).setOrigin(0.5).setDepth(301)
          this.add.text(500,230,'得分: '+this.score+'  |  学字: '+Math.floor(this.score/5)+' 个',{fontSize:'20px',fill:'#fff'}).setOrigin(0.5).setDepth(301)
          for(let i=0;i<20;i++){const sx=150+Math.random()*700,sy=120+Math.random()*180;const star=this.add.text(sx,sy,'⭐',{fontSize:i%5===0?28:18}).setOrigin(0.5).setDepth(302);this.tweens.add({targets:star,y:star.y+40,alpha:0,duration:1200+Math.random()*1000,delay:Math.random()*800})}
          const btn=this.add.rectangle(500,350,200,60,0x4CAF50).setInteractive().setDepth(301).setStrokeStyle(2,0x388E3C)
          this.add.text(500,350,'🔄 再来一局',{fontSize:'22px',fill:'#fff'}).setOrigin(0.5).setDepth(302)
          btn.on('pointerover',()=>btn.setScale(1.05));btn.on('pointerout',()=>btn.setScale(1))
          btn.on('pointerdown',()=>this.scene.restart())
        }
      }

      new Phaser.Game({type:Phaser.AUTO,width:1000,height:600,parent:'pvz-game',backgroundColor:'#2d5a2c',scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[TitleScene,GameScene]})
    }
    document.head.appendChild(script);return () => { script.remove() }
  }, [])

  return (<div style={{minHeight:'100vh',background:'#1a1a2e',display:'flex',alignItems:'center',justifyContent:'center'}}><div ref={containerRef} id='pvz-game'/></div>)
}