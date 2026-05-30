import { useEffect, useRef } from 'react'

export function PhaserPVZGame() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js'
    script.onload = () => {
      const el = document.getElementById('pvz-game')
      if (!el || el.hasChildNodes()) return
      el.style.width = '100%'
      el.style.maxWidth = '1000px'
      el.style.margin = '0 auto'

      const Phaser = (window as any).Phaser
      if (!Phaser) return

      new Phaser.Game({
        type: Phaser.AUTO, width: 1000, height: 600, parent: 'pvz-game',
        backgroundColor: '#2d5a2c',
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        scene: {
          create(this: any) {
            const scene = this
            scene.cameras.main.setBackgroundColor('#1a1a2e')
            scene.add.text(500, 200, '汉字保卫战', { fontSize:'56px',fill:'#FFD700',fontWeight:'bold' }).setOrigin(0.5)
            scene.add.text(500, 280, '用汉字击败错字兽!', { fontSize:'20px',fill:'#aaa' }).setOrigin(0.5)
            scene.add.text(500, 360, '点击屏幕开始', { fontSize:'18px',fill:'#fff' }).setOrigin(0.5)
            scene.input.once('pointerdown', () => scene.scene.restart())
          }
        }
      })
    }
    document.head.appendChild(script)
    return () => { script.remove() }
  }, [])

  return (
    <div style={{ minHeight:'100vh',background:'#1a1a2e',display:'flex',alignItems:'center',justifyContent:'center' }}>
      <div ref={containerRef} id="pvz-game" />
    </div>
  )
}