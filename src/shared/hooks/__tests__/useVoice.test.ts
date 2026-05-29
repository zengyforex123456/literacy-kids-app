import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useVoice } from '../useVoice'

function mockSynthesis() {
  return {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: () => [{ lang: 'zh-CN', name: 'Tingting' }],
    speaking: false,
    paused: false,
    pending: false,
    onvoiceschanged: null as (() => void) | null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as SpeechSynthesis
}

describe('useVoice', () => {
  beforeEach(() => {
    window.speechSynthesis = mockSynthesis()
  })

  it('should speak Chinese text', () => {
    const { result } = renderHook(() => useVoice())
    result.current.speak('你好')
    expect(window.speechSynthesis.speak).toHaveBeenCalled()
  })

  it('should stop speaking', () => {
    const { result } = renderHook(() => useVoice())
    result.current.stop()
    expect(window.speechSynthesis.cancel).toHaveBeenCalled()
  })

  it('should handle English text', () => {
    const { result } = renderHook(() => useVoice())
    result.current.speak('hello', 'en-US')
    expect(window.speechSynthesis.speak).toHaveBeenCalled()
  })
})
