import '@testing-library/jest-dom/vitest'

// Mock AudioContext for jsdom
class MockAudioContext {
  createOscillator() {
    return {
      type: 'sine' as const,
      frequency: { value: 0 },
      connect: () => {},
      start: () => {},
      stop: () => {},
    }
  }
  createGain() {
    return {
      gain: { value: 0, setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
      connect: () => {},
    }
  }
  get destination() { return {} }
  close() {}
}

Object.defineProperty(window, 'AudioContext', { value: MockAudioContext, writable: true })
Object.defineProperty(window, 'webkitAudioContext', { value: MockAudioContext, writable: true })

// Mock SpeechSynthesis
class MockSpeechSynthesis {
  speaking = false
  paused = false
  pending = false

  speak() { this.speaking = true }
  cancel() { this.speaking = false }
  pause() { this.paused = true }
  resume() { this.paused = false }
  getVoices() { return [{ lang: 'zh-CN', name: 'Tingting' }, { lang: 'en-US', name: 'Alex' }] }
  onvoiceschanged: (() => void) | null = null
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() { return true }
}

Object.defineProperty(window, 'speechSynthesis', { value: new MockSpeechSynthesis(), writable: true })

class MockSpeechSynthesisUtterance {
  lang = ''
  rate = 1
  pitch = 1
  volume = 1
  text = ''
  constructor(text?: string) { if (text) this.text = text }
}

Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: MockSpeechSynthesisUtterance, writable: true })
