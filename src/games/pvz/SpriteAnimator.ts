// 精灵动画系统 — procedurally generates pixel-art animation frames
// No external assets needed. Creates sprite sheets from geometric drawing.

type AnimFrame = (g: any, x: number, y: number, scale: number) => void

export class SpriteAnimator {
  static createPlantAnimations(): Record<string, { idle: AnimFrame[]; attack: AnimFrame[] }> {
    return {
      peashooter: {
        idle: Array.from({ length: 4 }, (_, i) => (g: any, x: number, y: number, s: number) => {
          const bob = Math.sin(i * Math.PI / 2) * 2  // breathing
          g.fillStyle(0x006400); g.fillRect(x - 3, y + 5 + bob, 6, 22)  // stem
          g.fillStyle(0x228B22); g.fillCircle(x, y - 2 + bob, 14)       // head
          g.fillStyle(0xFFFFFF); g.fillCircle(x - 4, y - 7 + bob, 4)    // eye
          g.fillCircle(x + 4, y - 7 + bob, 4)
          g.fillStyle(0x000000); g.fillCircle(x - 3, y - 8 + bob, 2)
          g.fillCircle(x + 3, y - 8 + bob, 2)
          g.fillStyle(0x228B22); g.fillRect(x + 5, y - 9 + bob, 16, 10)
        }),
        attack: Array.from({ length: 6 }, (_, i) => (g: any, x: number, y: number, s: number) => {
          const recoil = i < 2 ? -3 : 0  // recoil frames
          g.fillStyle(0x006400); g.fillRect(x - 3 + recoil, y + 5, 6, 22)
          g.fillStyle(0x228B22); g.fillCircle(x + recoil, y - 2, 14)
          g.fillStyle(0x228B22); g.fillRect(x + 5 + recoil, y - 9, 16 + (i % 2) * 4, 10)
        }),
      },
      sunflower: {
        idle: Array.from({ length: 4 }, (_, i) => (g: any, x: number, y: number, s: number) => {
          const sway = Math.sin(i * Math.PI / 2) * 3
          g.fillStyle(0x228B22); g.fillRect(x - 3, y + 5, 6, 22)        // stem
          g.fillStyle(0x228B22); g.fillCircle(x - 6, y - 10, 6)          // leaf left
          g.fillCircle(x + 6, y - 10, 6)                                  // leaf right
          g.fillStyle(0xFFD700); g.fillCircle(x, y - 2 + sway, 16)       // head
          for (let p = 0; p < 8; p++) {                                   // petals
            const a = p * Math.PI / 4 + sway * 0.1
            g.fillStyle(0xFFF176)
            g.fillCircle(x + Math.cos(a) * 14, y - 2 + sway + Math.sin(a) * 14, 6)
          }
          g.fillStyle(0x8B4513); g.fillCircle(x, y - 2 + sway, 8)        // center
        }),
        attack: Array.from({ length: 4 }, (_, i) => (g: any, x: number, y: number, s: number) => {
          g.fillStyle(0xFFD700); g.fillCircle(x, y - 2, 16 + i * 2)       // pulse bigger
        }),
      },
      wallnut: {
        idle: Array.from({ length: 2 }, (_, i) => (g: any, x: number, y: number, s: number) => {
          const squeeze = i === 0 ? 2 : -2
          g.fillStyle(0x8B4513); g.fillCircle(x, y, 20)                   // body
          g.fillStyle(0xA0522D); g.fillCircle(x - 4 + squeeze, y - 5, 6)  // eye
          g.fillCircle(x + 4 - squeeze, y - 5, 6)
          g.fillStyle(0x000000); g.fillCircle(x - 3, y - 6, 2)
          g.fillCircle(x + 3, y - 6, 2)
          g.fillStyle(0xFFFFFF); g.fillRect(x - 3, y + 2, 6, 2)           // mouth
        }),
        attack: [],
      },
    }
  }

  static createZombieAnimations(): Record<string, { walk: AnimFrame[]; eat: AnimFrame[]; die: AnimFrame[] }> {
    const createZombieFrame = (tilt: number, mouthOpen: number) =>
      (g: any, x: number, y: number, s: number) => {
        g.fillStyle(0x808080); g.fillRect(-15, -8, 30, 45)                // body
        g.fillStyle(0x556B2F); g.fillCircle(0, -18 + tilt, 12)            // head
        g.fillStyle(0xFF0000); g.fillCircle(-3, -22 + tilt, 2)            // eye
        g.fillCircle(3, -22 + tilt, 2)
        g.fillStyle(0xFFFFFF); g.fillRect(-4, -15 + tilt + mouthOpen, 8, 4) // mouth
        g.fillStyle(0x808080); g.fillRect(-22, 2 + tilt * 2, 10, 5)      // arm L
        g.fillRect(12, 2 - tilt * 2, 10, 5)                               // arm R
        g.fillStyle(0x666666); g.fillRect(-18, 35, 8, 10)                 // leg L
        g.fillRect(10, 35, 8, 10)                                          // leg R
      }

    return {
      normal: {
        walk: Array.from({ length: 4 }, (_, i) => {
          const tilt = Math.sin(i * Math.PI / 2) * 4
          return createZombieFrame(tilt, i % 2)
        }),
        eat: Array.from({ length: 3 }, (_, i) => createZombieFrame(0, i * 3)),
        die: [createZombieFrame(0, 0)],
      },
    }
  }
}
