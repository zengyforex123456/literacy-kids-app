import { useEffect, useRef } from 'react'

type GameState = 'menu' | 'playing' | 'paused' | 'win' | 'lose'

// ===== SPRITE SHEET GENERATOR =====
function generateSpriteSheets() {
  const sheets: Record<string, HTMLCanvasElement> = {}
  
  // Peashooter: 4 idle + 6 attack frames, 64x64 each
  const pea = document.createElement('canvas'); pea.width=64*10; pea.height=64*2
  const pc = pea.getContext('2d')!; let px=0,py=0
  // Idle frames (row 0)
  for(let i=0;i<4;i++){px=i*64;py=0;const bob=Math.sin(i*Math.PI/2)*2
    pc.fillStyle='#006400';pc.fillRect(px+28,py+40+bob,8,24)
    pc.fillStyle='#228B22';pc.beginPath();pc.arc(px+32,py+28+bob,16,0,Math.PI*2);pc.fill()
    pc.fillStyle='#FFF';pc.beginPath();pc.arc(px+27,py+22+bob,5,0,Math.PI*2);pc.arc(px+37,py+22+bob,5,0,Math.PI*2);pc.fill()
    pc.fillStyle='#000';pc.beginPath();pc.arc(px+26,py+21+bob,2,0,Math.PI*2);pc.arc(px+36,py+21+bob,2,0,Math.PI*2);pc.fill()
    pc.fillStyle='#228B22';pc.fillRect(px+38,py+22+bob,20,10)
  }
  // Attack frames (row 1)
  for(let i=0;i<6;i++){px=i*64;py=64;const recoil=i<2?-3:0;const ext=i%2?4:0
    pc.fillStyle='#006400';pc.fillRect(px+28+recoil,py+40,8,24)
    pc.fillStyle='#228B22';pc.beginPath();pc.arc(px+32+recoil,py+28,16,0,Math.PI*2);pc.fill()
    pc.fillStyle='#228B22';pc.fillRect(px+38+recoil,py+22,20+ext,10)
  }
  sheets.peashooter = pea

  // Sunflower: 4 idle frames
  const sun = document.createElement('canvas'); sun.width=64*4; sun.height=64
  const sc=sun.getContext('2d')!
  for(let i=0;i<4;i++){px=i*64;const sway=Math.sin(i*Math.PI/2)*3
    sc.fillStyle='#228B22';sc.fillRect(px+28,py+40,8,24);sc.beginPath();sc.arc(px-4,py+25,6,0,Math.PI);sc.fill()
    sc.beginPath();sc.arc(px+68,py+25,6,0,Math.PI);sc.fill()
    sc.fillStyle='#FFD700';sc.beginPath();sc.arc(px+32,py+28+sway,16,0,Math.PI*2);sc.fill()
    for(let p=0;p<8;p++){const a=p*Math.PI/4+sway*0.1;sc.fillStyle='#FFF176';sc.beginPath();sc.arc(px+32+Math.cos(a)*14,py+28+sway+Math.sin(a)*14,6,0,Math.PI*2);sc.fill()}
    sc.fillStyle='#8B4513';sc.beginPath();sc.arc(px+32,py+28+sway,8,0,Math.PI*2);sc.fill()
  }
  sheets.sunflower = sun

  // Wallnut: 2 idle frames
  const nut = document.createElement('canvas'); nut.width=64*2; nut.height=64
  const nc=nut.getContext('2d')!
  for(let i=0;i<2;i++){px=i*64;const sq=i?-1:1
    nc.fillStyle='#8B4513';nc.beginPath();nc.arc(px+32,py+32,20,0,Math.PI*2);nc.fill()
    nc.fillStyle='#A0522D';nc.beginPath();nc.arc(px+26+sq,py+26,6,0,Math.PI*2);nc.arc(px+38-sq,py+26,6,0,Math.PI*2);nc.fill()
    nc.fillStyle='#000';nc.beginPath();nc.arc(px+25,py+24,2,0,Math.PI*2);nc.arc(px+39,py+24,2,0,Math.PI*2);nc.fill()
    nc.fillStyle='#FFF';nc.fillRect(px+28,py+34,8,2)
  }
  sheets.wallnut = nut

  // Zombie: 4 walk frames, 64x64
  const zom = document.createElement('canvas'); zom.width=64*4; zom.height=64*3
  const zc=zom.getContext('2d')!
  for(let i=0;i<4;i++){px=i*64;py=0;const tilt=Math.sin(i*Math.PI/2)*4;const mo=i%2
    zc.fillStyle='#808080';zc.fillRect(px+18,py+28,28,42)
    zc.fillStyle='#556B2F';zc.beginPath();zc.arc(px+32,py+22+tilt,14,0,Math.PI*2);zc.fill()
    zc.fillStyle='#F00';zc.beginPath();zc.arc(px+28,py+18+tilt,3,0,Math.PI*2);zc.arc(px+36,py+18+tilt,3,0,Math.PI*2);zc.fill()
    zc.fillStyle='#FFF';zc.fillRect(px+27,py+25+tilt+mo,10,3)
    zc.fillStyle='#808080';zc.fillRect(px+8,py+30+tilt*2,10,5);zc.fillRect(px+46,py+30-tilt*2,10,5)
    zc.fillStyle='#666';zc.fillRect(px+14,py+68,8,10);zc.fillRect(px+42,py+68,8,10)
  }
  sheets.zombie = zom

  return sheets
}

// ===== MAIN COMPONENT =====
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
      el.style.width='100%';el.style.maxWidth='1000px';el.style.margin='0 auto'
      const P = (window as any).Phaser; if (!P) return

      const sheets = generateSpriteSheets()
      
      // Convert canvas sprite sheets to Phaser textures
      function loadSheet(key:string, canvas:HTMLCanvasElement, frameW:number, frameH:number, frameCount:number, row:number=0){
        const textures = P.Textures as any; const tex = textures.CanvasPool.create ? textures.CanvasPool.create(null,canvas.width,canvas.height) : null
        // Draw canvas to texture
        const scene = (window as any).__pvzScene
        if (scene) {
          const texImg = scene.textures.createCanvas(key, canvas.width, canvas.height)
          const ctx = texImg?.getContext()
          if (ctx) ctx.drawImage(canvas, 0, 0)
          for(let i=0;i<frameCount;i++) {
            if (texImg) texImg.add(i, 0, i*frameW, row*frameH, frameW, frameH)
          }
        }
      }

      // ===== STATE MACHINE =====
      let state: GameState = 'menu'

      class MenuScene extends P.Scene {
        constructor(){super('menu')}
        create(){
          ;(window as any).__pvzScene = this
          this.cameras.main.setBackgroundColor('#1a1a2e')
          const t=this.add.text(500,180,'汉字保卫战',{fontSize:'56px',fill:'#FFD700',fontWeight:'bold'}).setOrigin(0.5).setAlpha(0)
          this.add.text(500,260,'Plants vs Zombies × Chinese Characters',{fontSize:'16px',fill:'#aaa'}).setOrigin(0.5)
          this.tweens.add({targets:t,alpha:1,y:160,duration:800,ease:'Back.easeOut'})
          const btn=this.add.text(500,370,'开始游戏',{fontSize:'24px',fill:'#fff',backgroundColor:'#4CAF50',padding:{x:32,y:14}}).setOrigin(0.5).setInteractive()
          btn.on('pointerdown',()=>{state='playing';this.scene.start('game')})
          // Preview animations
          for(let i=0;i<6;i++){
            const g=this.add.image(100+i*150,430,'peashooter',Math.floor(Date.now()/300)%4).setScale(2).setAlpha(0.2)
            this.tweens.add({targets:g,alpha:0.15,y:420,duration:800,delay:i*200})
          }
        }
      }

      class GameScene extends P.Scene {
        grid!:any[][];plants!:any[];zombies!:any[];bullets!:any[];suns!:any[];mowers!:any[]
        sun=200;score=0;selectedPlant:any=null;wave=1;gameT=0
        cooldowns:Record<string,number>={pea:0,sun:0,nut:0,chili:0}
        words='山水火木人口手日月田力子女门车马虫鱼鸟大小多少上下左右中'.split('')
        ro=5;co=9;cw=90;ch=100;sx=80;sy=70

        constructor(){super('game')}

        create(){
          ;(window as any).__pvzScene = this
          this.cameras.main.setBackgroundColor('#3a5a2c')
          this.grid=Array.from({length:this.ro},()=>Array(this.co).fill(null))
          this.plants=[];this.zombies=[];this.bullets=[];this.suns=[];this.mowers=[]

          // Load sprite sheets
          Object.entries(sheets).forEach(([key,canvas])=>{
            const fw=64;const frames=Math.floor(canvas.width/64)
            const tex=this.textures.createCanvas(key,canvas.width,canvas.height)
            const ctx=tex.getContext();ctx.drawImage(canvas,0,0);tex.refresh()
            for(let i=0;i<frames;i++){tex.add(i,0,i*fw,0,fw,fw)}
          })

          // Lawn grid with alternating shades
          const gfx=this.add.graphics()
          for(let r=0;r<this.ro;r++)for(let c=0;c<this.co;c++){
            const shade=(r+c)%2===0?0x4CAF50:0x388E3C
            gfx.fillStyle(shade);gfx.fillRect(this.sx+c*this.cw,this.sy+r*this.ch,this.cw,this.ch)
            gfx.lineStyle(1,0xFFFFFF,0.08);gfx.strokeRect(this.sx+c*this.cw,this.sy+r*this.ch,this.cw,this.ch)
          }

          // UI
          this.sunTxt=this.add.text(10,12,'☀ '+this.sun,{fontSize:'18px',fill:'#FFD700',stroke:'#000',strokeThickness:2}).setDepth(100)
          this.scoreTxt=this.add.text(850,12,'得分:0',{fontSize:'16px',fill:'#fff',stroke:'#000',strokeThickness:2}).setDepth(100)

          // Mowers
          for(let r=0;r<this.ro;r++){
            const g=this.add.graphics().setDepth(25)
            g.fillStyle(0xCC0000);g.fillRect(10,this.sy+r*this.ch+50-10,22,18)
            g.fillStyle(0xFFD700);g.fillRect(14,this.sy+r*this.ch+50-14,14,8)
            g.fillStyle(0x333);g.fillCircle(18,this.sy+r*this.ch+50,3);g.fillCircle(26,this.sy+r*this.ch+50,3)
            ;(g as any).used=false;this.mowers.push(g)
          }

          // Plant cards
          const defs=[{id:'pea',name:'豌豆射手',w:'豌',cost:50,cd:5000,key:'peashooter'},{id:'sun',name:'向日葵',w:'日',cost:50,cd:7000,key:'sunflower'},{id:'nut',name:'坚果墙',w:'坚',cost:50,cd:15000,key:'wallnut'},{id:'chili',name:'辣椒',w:'火',cost:100,cd:25000,key:'peashooter'}]
          defs.forEach((p,i)=>{
            const x=50+i*130,y=535
            const bg=this.add.rectangle(x,y,110,52,0x263238).setStrokeStyle(2,0x4CAF50).setInteractive().setDepth(99)
            const cd=this.add.rectangle(x,y,110,52,0x000,0).setDepth(100)
            const ct=this.add.text(x,y,'',{fontSize:'16px',fill:'#fff'}).setOrigin(0.5).setDepth(101)
            bg.on('pointerdown',()=>{if(this.cooldowns[p.id]<=0&&this.sun>=p.cost)this.showQuiz(p)})
            if(sheets[p.key]){try{this.add.image(x-30,y,sheets[p.key].width>64?p.key:'peashooter',0).setScale(0.6).setDepth(100)}catch(e){}}
            this.add.text(x+10,y-14,p.name,{fontSize:'12px',fill:'#fff'}).setOrigin(0.5).setDepth(100)
            this.add.text(x+10,y+8,p.w+' ☀'+p.cost,{fontSize:'10px',fill:'#FFD700'}).setOrigin(0.5).setDepth(100)
            this.plantCards||=[];this.plantCards.push({bg,cd,ct,def:p})
          })

          // Click grid to place plant
          this.input.on('pointerdown',(p:any)=>{
            if(state!=='playing'||!this.selectedPlant)return
            const c=Math.floor((p.x-this.sx)/this.cw),r=Math.floor((p.y-this.sy)/this.ch)
            if(r>=0&&r<this.ro&&c>=0&&c<this.co&&!this.grid[r][c]&&this.sun>=this.selectedPlant.cost)this.placePlant(r,c,this.selectedPlant)
          })

          // Keyboard: P to pause
          this.input.keyboard?.on('keydown-P',()=>{state=state==='paused'?'playing':'paused'})

          // Timers
          this.time.addEvent({delay:5000,callback:()=>{if(state==='playing')this.spawnZombie()},loop:true})
          this.time.addEvent({delay:7000,callback:()=>{if(state==='playing')this.spawnSun()},loop:true})
        }

        spawnSun(){
          const x=120+Math.random()*760;const y=80+Math.random()*300
          const s=this.add.circle(x,-20,14,0xFFD700).setDepth(50).setInteractive().setStrokeStyle(2,0xFFA000)
          ;(s as any).targetY=y;(s as any).collected=false
          const t=this.add.text(x,-20,'🌞',{fontSize:'18px'}).setOrigin(0.5).setDepth(51)
          const g=this.add.circle(x,-20,24,0xFFFF00,0.15).setDepth(49)
          this.tweens.add({targets:g,alpha:0.4,scale:1.4,duration:800,yoyo:true,repeat:-1})
          this.suns.push({circle:s,text:t,glow:g})
          s.on('pointerdown',()=>{if((s as any).collected)return;(s as any).collected=true;this.sun+=25
            this.tweens.add({targets:[s,t,g],alpha:0,scale:0.2,x:60,y:25,duration:400,onComplete:()=>{s.destroy();t.destroy();g.destroy()}})})
          this.tweens.add({targets:[s,t,g],y:(s as any).targetY,duration:3000,ease:'Sine.easeOut'})
        }

        showQuiz(plant:any){
          const correct=plant.w;const opts=[correct,...this.words.filter((w:string)=>w!==correct).slice(0,3)].sort(()=>Math.random()-0.5)
          const bg=this.add.rectangle(500,300,460,220,0x000000,0.94).setDepth(200).setStrokeStyle(3,0xFFD700)
          this.add.text(500,210,'选出「'+correct+'」召唤 '+plant.name+'!',{fontSize:'20px',fill:'#FFD700'}).setOrigin(0.5).setDepth(201)
          const elems:any[]=[bg]
          opts.forEach((o,i)=>{
            const bx=350+i*95,by=290
            const btn=this.add.rectangle(bx,by,75,75,0x444).setInteractive().setDepth(201).setStrokeStyle(2,0x888)
            const txt=this.add.text(bx,by,o,{fontSize:'32px',fill:'#fff'}).setOrigin(0.5).setDepth(202)
            elems.push(btn,txt)
            btn.on('pointerdown',()=>{
              if(o===correct){this.sun-=plant.cost;this.selectedPlant=plant;this.cooldowns[plant.id]=plant.cd
                this.cameras.main.shake(120,0.01);this.score+=10
                this.add.text(500,365,'✅ 正确! 点击草地种下!',{fontSize:'16px',fill:'#4CAF50'}).setOrigin(0.5).setDepth(202)
              }else{this.add.text(500,365,'❌',{fontSize:'16px',fill:'#F44336'}).setOrigin(0.5).setDepth(202)}
              this.time.delayedCall(800,()=>elems.forEach(e=>e.destroy()))
            })
          })
        }

        placePlant(r:number,c:number,p:any){
          const x=this.sx+c*this.cw+this.cw/2,y=this.sy+r*this.ch+this.ch/2
          const g=this.add.image(x,y,p.key||'peashooter',0).setDepth(10).setScale(0)
          this.tweens.add({targets:g,scaleX:1.3,scaleY:1.3,duration:200,ease:'Back.easeOut'})
          this.tweens.add({targets:g,scaleX:1,scaleY:1,duration:150,delay:200})
          // Sparkle
          for(let i=0;i<6;i++){const sp=this.add.circle(x+(Math.random()-0.5)*30,y+(Math.random()-0.5)*30,3,0xFFFF00).setDepth(12);this.tweens.add({targets:sp,alpha:0,scale:0,duration:400,onComplete:()=>sp.destroy()})}
          this.grid[r][c]={g,hp:300,row:r,col:c,timer:0,anim:p.key||'peashooter'}
          this.selectedPlant=null
        }

        spawnZombie(){
          const r=P.Math.Between(0,4);const x=950;const y=this.sy+r*this.ch+50
          const w=this.words[P.Math.Between(0,this.words.length-1)]
          const g=this.add.image(x,y,'zombie',0).setDepth(20).setScale(1.3)
          const lb=this.add.text(x,y-48,w,{fontSize:'18px',fill:'#fff',stroke:'#000',strokeThickness:3}).setOrigin(0.5).setDepth(21)
          const hpBg=this.add.rectangle(x,y-60,34,6,0x333).setDepth(21)
          const hpFill=this.add.rectangle(x-17,y-60,34,6,0xF00).setDepth(22).setOrigin(0,0.5)
          ;(g as any).zRow=r;(g as any).zHp=100;(g as any).zMaxHp=100;(g as any).zSpeed=0.3;(g as any).zHpBar=hpFill;(g as any).zLabel=lb;(g as any).zHpBg=hpBg
          this.zombies.push(g)
          if(this.zombies.length===5){this.wave=2
            const a=this.add.text(500,250,'⚠ 一大波错字兽来袭!',{fontSize:'28px',fill:'#F44',fontWeight:'bold',stroke:'#000',strokeThickness:4}).setOrigin(0.5).setDepth(300).setScale(0)
            this.tweens.add({targets:a,scaleX:1,scaleY:1,duration:500,ease:'Back.easeOut'})
            this.tweens.add({targets:a,alpha:0,y:200,duration:2000,delay:1000,onComplete:()=>a.destroy()})
          }
        }

        update(_t:number,dt:number){
          if(state!=='playing')return;this.gameT+=dt
          // Cooldowns
          for(const k in this.cooldowns){if(this.cooldowns[k]>0)this.cooldowns[k]-=dt}
          if(this.plantCards)this.plantCards.forEach((c:any)=>{
            const cd=this.cooldowns[c.def.id];const pct=cd>0?Math.min(1,cd/c.def.cd):0
            c.cd.setAlpha(pct*0.55);c.ct.setText(pct>0?Math.ceil(cd/1000)+'s':'')
          })
          // Animate plants
          for(let r=0;r<this.ro;r++)for(let c=0;c<this.co;c++){
            const cell=this.grid[r]?.[c];if(!cell?.g)continue
            const f=(Math.floor(this.gameT/200)+cell.row+cell.col)%4
            try{cell.g.setFrame(f)}catch(e){}
            cell.timer+=dt
          }
          // Animate zombies
          for(let zi=this.zombies.length-1;zi>=0;zi--){
            const z=this.zombies[zi] as any;if(!z?.active){this.zombies.splice(zi,1);continue}
            z.x-=z.zSpeed
            const col=Math.floor((z.x-this.sx)/this.cw)
            // Update zombie frame + label position
            try{z.setFrame(Math.floor(this.gameT/250+zi)%4)}catch(e){}
            if(z.zLabel){z.zLabel.x=z.x;z.zLabel.y=z.y-48}
            if(z.zHpBg){z.zHpBg.x=z.x;z.zHpBg.y=z.y-60}
            if(z.zHpBar){z.zHpBar.x=z.x-17;z.zHpBar.y=z.y-60}
            // Mower trigger
            if(col<=0&&this.mowers[z.zRow]&&!(this.mowers[z.zRow] as any).used){
              (this.mowers[z.zRow] as any).used=true;this.tweens.add({targets:this.mowers[z.zRow],x:1200,duration:1500})
              for(let j=this.zombies.length-1;j>=0;j--){const zz=this.zombies[j] as any;if(zz.zRow===z.zRow){zz.destroy();this.zombies.splice(j,1);this.score+=5}}
            }
            // Eat plant
            if(col>=0&&col<this.co&&this.grid[z.zRow]?.[col]){
              this.grid[z.zRow][col].hp-=0.3;z.zSpeed=0
              if(this.grid[z.zRow][col].hp<=0){this.grid[z.zRow][col].g.destroy();this.grid[z.zRow][col]=null;z.zSpeed=0.3}
            }
            // Plants shoot
            for(let r=0;r<this.ro;r++)for(let c=0;c<this.co;c++){const cell=this.grid[r]?.[c];if(cell&&r===z.zRow&&cell.timer>1000){cell.timer=0
              const bx=this.sx+c*this.cw+this.cw/2+22,by=this.sy+r*this.ch+this.ch/2-8;this.bullets.push({obj:this.add.circle(bx,by,5,0x00FF00).setDepth(15)})}}
            // Bullet hits
            for(let bi=this.bullets.length-1;bi>=0;bi--){const b=this.bullets[bi];if(!b?.obj?.active){this.bullets.splice(bi,1);continue}
              b.obj.x+=5;if(P.Math.Distance.Between(b.obj.x,b.obj.y,z.x,z.y)<30){b.obj.destroy();this.bullets.splice(bi,1)
                z.zHp-=25;z.zHpBar.width=34*(Math.max(z.zHp,0)/z.zMaxHp)
                const dmg=this.add.text(z.x,z.y-35,'-25',{fontSize:'16px',fill:'#F44',fontWeight:'bold',stroke:'#000',strokeThickness:2}).setOrigin(0.5).setDepth(30)
                this.tweens.add({targets:dmg,alpha:0,y:dmg.y-30,duration:500,onComplete:()=>dmg.destroy()})
                if(z.zHp<=0){for(let p=0;p<10;p++){const px=this.add.circle(z.x+(Math.random()-0.5)*30,z.y+(Math.random()-0.5)*40,3,0x666).setDepth(30);this.tweens.add({targets:px,alpha:0,y:px.y-40,x:px.x+(Math.random()-0.5)*50,duration:500,onComplete:()=>px.destroy()})}
                  z.zLabel?.destroy();z.zHpBg?.destroy();z.zHpBar?.destroy();z.destroy();this.zombies.splice(zi,1);this.score+=10;this.sun+=25;this.cameras.main.shake(50,0.003);break}}
            }
          }
          this.sunTxt.setText('☀ '+Math.floor(this.sun));this.scoreTxt.setText('得分:'+this.score)
          if(this.score>=150){state='win';this.showWin()}
        }

        showWin(){
          const bg=this.add.rectangle(500,280,500,320,0x000000,0.92).setDepth(300).setStrokeStyle(3,0xFFD700)
          this.add.text(500,160,'🎉 保卫成功!',{fontSize:'44px',fill:'#FFD700',stroke:'#000',strokeThickness:3}).setOrigin(0.5).setDepth(301)
          this.add.text(500,230,'得分:'+this.score+'  学字:'+Math.floor(this.score/5)+'个',{fontSize:'20px',fill:'#fff'}).setOrigin(0.5).setDepth(301)
          for(let i=0;i<25;i++){const s=this.add.text(150+Math.random()*700,120+Math.random()*180,'⭐',{fontSize:i%5===0?30:16}).setOrigin(0.5).setDepth(302);this.tweens.add({targets:s,y:s.y+40,alpha:0,duration:1200+Math.random()*1000,delay:Math.random()*800})}
          const btn=this.add.rectangle(500,350,200,60,0x4CAF50).setInteractive().setDepth(301)
          this.add.text(500,350,'🔄 再来一局',{fontSize:'22px',fill:'#fff'}).setOrigin(0.5).setDepth(302)
          btn.on('pointerdown',()=>{state='playing';this.scene.restart()})
        }
      }

      new P.Game({type:P.AUTO,width:1000,height:600,parent:'pvz-game',backgroundColor:'#2d5a2c',scale:{mode:P.Scale.FIT,autoCenter:P.Scale.CENTER_BOTH},scene:[MenuScene,GameScene]})
    }
    document.head.appendChild(script);return () => { script.remove() }
  }, [])

  return (<div style={{minHeight:'100vh',background:'#1a1a2e',display:'flex',alignItems:'center',justifyContent:'center'}}><div ref={containerRef} id='pvz-game'/></div>)
}