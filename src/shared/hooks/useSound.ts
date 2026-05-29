import { useCallback } from 'react'

function getCtx(): AudioContext {
  if (typeof window.webkitAudioContext !== 'undefined') {
    return new window.webkitAudioContext()
  }
  return new AudioContext()
}

let audioCtx: AudioContext | null = null

function getAudioCtx(): AudioContext {
  if (!audioCtx) audioCtx = getCtx()
  return audioCtx
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine') {
  const ctx = getAudioCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + duration)
}

export function useSound() {
  const play = useCallback((name: 'correct' | 'wrong' | 'complete') => {
    if (name === 'correct') {
      playTone(523, 0.15)
      setTimeout(() => playTone(659, 0.15), 100)
      setTimeout(() => playTone(784, 0.3), 200)
    } else if (name === 'wrong') {
      playTone(200, 0.3, 'square')
    } else if (name === 'complete') {
      playTone(523, 0.1)
      setTimeout(() => playTone(659, 0.1), 100)
      setTimeout(() => playTone(784, 0.1), 200)
      setTimeout(() => playTone(1047, 0.4), 300)
    }
  }, [])

  return { play }
}
