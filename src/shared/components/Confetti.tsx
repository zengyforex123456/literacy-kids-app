import { useEffect, useState, useCallback } from 'react'

interface Props { show: boolean; onComplete?: () => void }

export function Confetti({ show, onComplete }: Props) {
  const [pieces, setPieces] = useState<{ left: string; bg: string; delay: string; dur: string }[]>([])

  const handleComplete = useCallback(() => {
    if (onComplete) setTimeout(onComplete, 2000)
  }, [onComplete])

  useEffect(() => {
    if (!show) { setPieces([]); return }
    const colors = ['#FF6B6B','#4ECDC4','#FFE66D','#A8E6CF','#FF8B94','#B8E994']
    setPieces(Array.from({ length: 50 }, () => ({
      left: `${Math.random() * 100}%`,
      bg: colors[Math.floor(Math.random() * colors.length)],
      delay: `${Math.random() * 0.5}s`,
      dur: `${1 + Math.random() * 1.5}s`,
    })))
    handleComplete()
  }, [show, handleComplete])

  if (!show || pieces.length === 0) return null

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 250 }}>
      {pieces.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: p.left, top: -12,
          width: 12, height: 12, background: p.bg, borderRadius: 3,
          animation: `confetti-fall ${p.dur} ${p.delay} ease-out forwards`,
        }} />
      ))}
    </div>
  )
}
