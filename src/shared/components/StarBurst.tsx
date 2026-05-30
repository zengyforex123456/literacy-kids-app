import { useEffect, useState } from 'react'

interface Props { show: boolean; x: number; y: number; onComplete?: () => void }

export function StarBurst({ show, x, y, onComplete }: Props) {
  const [stars, setStars] = useState<{ angle: number; dist: number; delay: number; size: number }[]>([])

  useEffect(() => {
    if (!show) { setStars([]); return }
    setStars(Array.from({ length: 12 }, () => ({
      angle: Math.random() * 360,
      dist: 40 + Math.random() * 60,
      delay: Math.random() * 0.15,
      size: 8 + Math.random() * 12,
    })))
    if (onComplete) setTimeout(onComplete, 400)
  }, [show])

  if (!show || stars.length === 0) return null

  return (
    <div style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 260 }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: s.size, height: s.size,
          background: '#FFD700',
          borderRadius: '50%',
          animation: `star-burst ${0.3 + s.delay}s ease-out forwards`,
          transform: `rotate(${s.angle}deg) translateX(${s.dist}px)`,
        }} />
      ))}
    </div>
  )
}
