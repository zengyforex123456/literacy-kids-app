// 程序化音效合成 (正弦波 - 零音频文件)
class SoundSystem {
  constructor() {
    this.ctx = null
    this.enabled = true
    this.initOnClick()
  }

  initOnClick() {
    const init = () => {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)()
      if (this.ctx.state === 'suspended') this.ctx.resume()
      document.removeEventListener('click', init)
    }
    document.addEventListener('click', init)
  }

  beep(freq, duration, volume = 0.3, type = 'sine') {
    if (!this.ctx || !this.enabled) return
    const o = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    o.type = type; o.frequency.value = freq
    g.gain.setValueAtTime(volume, this.ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration)
    o.connect(g); g.connect(this.ctx.destination)
    o.start(); o.stop(this.ctx.currentTime + duration)
  }

  correct() {  // C5→E5→G5 上行音阶
    this.beep(523, 0.12)
    setTimeout(() => this.beep(659, 0.12), 100)
    setTimeout(() => this.beep(784, 0.18), 200)
  }

  wrong() {  // 下行低音
    this.beep(300, 0.2, 0.2, 'square')
    setTimeout(() => this.beep(200, 0.2, 0.15, 'square'), 150)
  }

  plant() {  // 种植音效: C5→G5
    this.beep(523, 0.1); setTimeout(() => this.beep(784, 0.15), 80)
  }

  shoot() { this.beep(880, 0.05, 0.15) }

  zombieDie() {  // 消灭音: 低音→高音
    this.beep(200, 0.1, 0.2, 'square')
    setTimeout(() => this.beep(300, 0.1, 0.2), 80)
    setTimeout(() => this.beep(400, 0.15, 0.25), 160)
  }

  win() {  // 胜利: C→E→G→C 上行
    [523,659,784,1047].forEach((f,i) => setTimeout(() => this.beep(f,0.2,0.3), i*150))
  }

  sun() { this.beep(1200, 0.08, 0.15) }  // 收集阳光
  click() { this.beep(600, 0.03, 0.08) }  // 点击

  toggle() { this.enabled = !this.enabled; return this.enabled }
}

const SOUND = new SoundSystem()