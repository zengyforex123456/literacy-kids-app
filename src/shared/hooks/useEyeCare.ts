import { useEffect, useRef, useCallback, useState } from 'react'
import { useSettingsStore } from '../stores/settingsStore'

export function useEyeCare() {
  const eyeCare = useSettingsStore(s => s.eyeCare)
  const [showRest, setShowRest] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const startRef = useRef(0)

  const startRest = useCallback(() => {
    setShowRest(true)
    setCountdown(30)
    startRef.current = Date.now()
  }, [])

  useEffect(() => {
    if (!showRest) return
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { setShowRest(false); clearInterval(interval); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [showRest])

  useEffect(() => {
    if (!eyeCare) return
    startRef.current = Date.now()
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000 / 60
      if (elapsed >= 15 && !showRest) {
        startRest()
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [eyeCare, showRest, startRest])

  return { showRest, countdown }
}
