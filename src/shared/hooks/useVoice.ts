import { useCallback, useRef } from 'react'

export function useVoice() {
  const synthRef = useRef(window.speechSynthesis)

  const speak = useCallback((text: string, lang: 'zh-CN' | 'en-US' = 'zh-CN') => {
    synthRef.current.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = lang === 'zh-CN' ? 0.85 : 0.9
    utterance.pitch = 1.1
    utterance.volume = 0.8

    const voices = synthRef.current.getVoices()
    if (voices.length > 0) {
      const targetVoice = voices.find(v => v.lang.startsWith(lang))
      if (targetVoice) utterance.voice = targetVoice
    }

    synthRef.current.speak(utterance)
  }, [])

  const stop = useCallback(() => synthRef.current.cancel(), [])

  return { speak, stop }
}
