import { useEffect, useRef } from 'react'

export function PhaserPVZGame() {
  const containerRef = useRef<HTMLDivElement>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js'
    script.onload = () => {
      const el = document.getElementById('pvz-game')
      if (!el || el.hasChildNodes()) return
      el.style.width = '100%'; el.style.maxWidth = '1000px'; el.style.margin = '0 auto'

      const Phaser = (window as any).Phaser
      if (!Phaser) return

      class TitleScene extends Phaser.Scene {
        constructor() { super('title') }
        create() {
          this.cameras.main.setBackgroundColor('#1a1a2e')
          this.add.text(500,200,'汉字保卫战',{fontSize:'56px',fill:'#FFD700',fontWeight:'bold'}).setOrigin(0.5)
          this.add.text(500,280,'用汉字击败错字兽!',{fontSize:'20px',fill:'#aaa'}).setOrigin(0.5)
          this.add.text(500,360,'点击屏幕开始',{fontSize:'18px',fill:'#fff'}).setOrigin(0.5)
          this.input.once('pointerdown',()=>this.scene.start('game'))
        }
      }

      class GameScene extends Phaser.Scene {
        constructor() { super('game') }
        create() {
          this.sun=150;this.score=0;this.gameEnd=false;this.ro=5;this.co=9
          this.cw=90;this.ch=100;this.sx=80;this.sy=70
          this.grid=Array.from({length:this.ro},()=>Array(this.co).fill(null))
          this.zombies=[];this.bullets=[];this.selectedPlant=null
          this.words='山水火木人口手日月田力子女门车马虫鱼鸟大小多少上下左右中'.split('')

          this.cameras.main.setBackgroundColor('#2d5a2c')
          const gfx=this.add.graphics()
          for(let r=0;r<this.ro;r++)for(let c=0;c<this.co;c++){gfx.lineStyle(1,0xFFFFFF,0.15);gfx.strokeRect(this.sx+c*this.cw,this.sy+r*this.ch,this.cw,this.ch)}

          this.sunTxt=this.add.text(10,10,'阳光: '+this.sun,{fontSize:'18px',fill:'#FFD700'}).setDepth(100)
          this.scoreTxt=this.add.text(780,10,'得分: 0',{fontSize:'18px',fill:'#fff'}).setDepth(100)

          const plants=[{id:'pea',name:'豌豆射手',w:'豌',cost:50,color:0x228B22},{id:'sun',name:'向日葵',w:'日',cost:50,color:0xFFD700},{id:'nut',name:'坚果墙',w:'坚',cost:50,color:0x8B4513},{id:'chili',name:'火爆辣椒',w:'火',cost:100,color:0xFF4500}]
          plants.forEach((p,i)=>{
            const x=40+i*130,y=535
            const bg=this.add.rectangle(x,y,110,50,0x333333).setInteractive().setDepth(99)
            bg.on('pointerdown',()=>this.showQuiz(p))
            this.add.text(x,y-10,p.name,{fontSize:'12px',fill:'#fff'}).setOrigin(0.5).setDepth(100)
            this.add.text(x,y+8,p.w+' 阳光'+p.cost,{fontSize:'10px',fill:'#aaa'}).setOrigin(0.5).setDepth(100)
          })

          this.input.on('pointerdown',(pointer:any)=>{
            if(this.gameEnd||!this.selectedPlant)return
            const c=Math.floor((pointer.x-this.sx)/this.cw)
            const r=Math.floor((pointer.y-this.sy)/this.ch)
            if(r>=0&&r<this.ro&&c>=0&&c<this.co&&!this.grid[r][c]&&this.sun>=this.selectedPlant.cost)this.placePlant(r,c,this.selectedPlant)
          })

          this.time.addEvent({delay:4000,callback:()=>{
            if(this.gameEnd)return
            const r=Phaser.Math.Between(0,4),x=920,y=this.sy+r*this.ch+50
            const w=this.words[Phaser.Math.Between(0,this.words.length-1)]
            const g=this.add.graphics().setDepth(20)
            g.fillStyle(0x808080);g.fillRect(-15,-10,30,50);g.fillStyle(0x556B2F);g.fillCircle(0,-20,14)
            g.fillStyle(0xFF0000);g.fillCircle(-4,-25,3);g.fillCircle(4,-25,3)
            const lb=this.add.text(0,-44,w,{fontSize:'16px',fill:'#fff'}).setOrigin(0.5).setDepth(21)
            const hp=this.add.rectangle(0,-54,30,4,0xFF0000).setDepth(21)
            const z=this.add.container(x,y,[g,lb,hp]).setDepth(20)
            ;(z as any).zRow=r;(z as any).zHp=100;(z as any).zMaxHp=100;(z as any).zSpeed=0.3;(z as any).zHpBar=hp
            this.zombies.push(z)
          },loop:true})

          this.time.addEvent({delay:6000,callback:()=>{this.sun+=25},loop:true})
        }

        showQuiz(plant:any){
          const correct=plant.w
          const opts=[correct,...this.words.filter((w:string)=>w!==correct).slice(0,3)].sort(()=>Math.random()-0.5)
          const bg=this.add.rectangle(500,300,420,200,0x000000,0.92).setDepth(200).setInteractive()
          this.add.text(500,220,'选出「'+correct+'」',{fontSize:'22px',fill:'#FFD700'}).setOrigin(0.5).setDepth(201)
          const scene=this
          opts.forEach((o:string,i:number)=>{
            const bx=370+i*85,by=290
            const btn=this.add.rectangle(bx,by,65,65,0x444444).setInteractive().setDepth(201)
            this.add.text(bx,by,o,{fontSize:'28px',fill:'#fff'}).setOrigin(0.5).setDepth(202)
            btn.on('pointerdown',()=>{
              if(o===correct){scene.sun-=plant.cost;scene.selectedPlant=plant;scene.cameras.main.shake(80,0.005);scene.score+=5}
              bg.destroy()
            })
          })
        }

        placePlant(r:number,c:number,p:any){
          const x=this.sx+c*this.cw+this.cw/2,y=this.sy+r*this.ch+this.ch/2
          const g=this.add.graphics().setDepth(10)
          g.fillStyle(0x006400);g.fillRect(x-4,y+8,8,28);g.fillStyle(p.color);g.fillCircle(x,y-3,18)
          g.fillStyle(0xFFFFFF);g.fillCircle(x-6,y-9,5);g.fillCircle(x+6,y-9,5);g.fillStyle(p.color);g.fillRect(x+7,y-11,20,12)
          this.add.text(x,y+38,p.w,{fontSize:'12px',fill:'#FFD700'}).setOrigin(0.5).setDepth(11)
          this.grid[r][c]={g,hp:300,row:r,col:c,timer:0}
          this.selectedPlant=null
        }

        update(_time:number,delta:number){
          if(this.gameEnd||!this.zombies)return
          for(let zi=this.zombies.length-1;zi>=0;zi--){
            const z=this.zombies[zi] as any
            if(!z||!z.active){this.zombies.splice(zi,1);continue}
            z.x-=z.zSpeed
            const col=Math.floor((z.x-this.sx)/this.cw)
            if(col>=0&&col<this.co&&this.grid[z.zRow]&&this.grid[z.zRow][col]){z.zSpeed=0;this.grid[z.zRow][col].hp-=0.3;if(this.grid[z.zRow][col].hp<=0){this.grid[z.zRow][col].g.destroy();this.grid[z.zRow][col]=null;z.zSpeed=0.3}}
            for(let r=0;r<this.ro;r++)for(let c=0;c<this.co;c++){
              const cell=this.grid[r]?.[c]
              if(cell&&r===z.zRow){cell.timer+=delta;if(cell.timer>1000){cell.timer=0;const bx=this.sx+c*this.cw+this.cw/2+20,by=this.sy+r*this.ch+this.ch/2-10;const b=this.add.circle(bx,by,5,0x00FF00).setDepth(15);(b as any).row=r;this.bullets.push({obj:b,row:r})}}
            }
            for(let bi=this.bullets.length-1;bi>=0;bi--){
              const b=this.bullets[bi];if(!b||!b.obj||!b.obj.active){this.bullets.splice(bi,1);continue}
              b.obj.x+=4
              if(Phaser.Math.Distance.Between(b.obj.x,b.obj.y,z.x,z.y)<35){b.obj.destroy();this.bullets.splice(bi,1);z.zHp-=25;z.zHpBar.width=30*(Math.max(z.zHp,0)/z.zMaxHp);if(z.zHp<=0){z.destroy();this.zombies.splice(zi,1);this.score+=10;this.sun+=25;this.cameras.main.shake(40,0.002);break}}
            }
          }
          this.sunTxt.setText('阳光: '+Math.floor(this.sun))
          this.scoreTxt.setText('得分: '+this.score)
          if(this.score>=100&&!this.gameEnd){this.gameEnd=true;this.showWin()}
        }

        showWin(){
          const bg=this.add.rectangle(500,280,400,250,0x000000,0.9).setDepth(300)
          this.add.text(500,180,'保卫成功!',{fontSize:'44px',fill:'#FFD700'}).setOrigin(0.5).setDepth(301)
          this.add.text(500,250,'得分: '+this.score,{fontSize:'24px',fill:'#fff'}).setOrigin(0.5).setDepth(301)
          const btn=this.add.rectangle(500,340,160,50,0x4CAF50).setInteractive().setDepth(301)
          this.add.text(500,340,'再来一局',{fontSize:'18px',fill:'#fff'}).setOrigin(0.5).setDepth(302)
          btn.on('pointerdown',()=>this.scene.restart())
        }
      }

      new Phaser.Game({
        type: Phaser.AUTO, width: 1000, height: 600, parent: 'pvz-game',
        backgroundColor: '#2d5a2c',
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        scene: [TitleScene, GameScene],
      })
    }
    document.head.appendChild(script)
    return () => { script.remove() }
  }, [])

  return (
    <div style={{ minHeight:'100vh',background:'#1a1a2e',display:'flex',alignItems:'center',justifyContent:'center' }}>
      <div ref={containerRef} id='pvz-game' />
    </div>
  )
}