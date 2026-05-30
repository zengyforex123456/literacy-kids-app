import { useEffect, useState } from 'react'

interface Props { show: boolean; type?: 'star'|'confetti'|'coin'; onComplete?: () => void }

export function RewardAnim({ show, type, onComplete }: Props) {
  const [particles, setParticles] = useState<{x:number;y:number;color:string;delay:number}[]>([])

  useEffect(() => {
    if (!show) { setParticles([]); return }
    const colors = type==='coin'?['#FFD700','#F9A826'] : type==='star'?['#FFD700','#FFF','#F9A826'] : ['#FF6B6B','#4ECDC4','#FFE66D','#A66CFF','#FF9F43']
    setParticles(Array.from({length:20}, () => ({
      x:20+Math.random()*60, y:Math.random()*80,
      color:colors[Math.floor(Math.random()*colors.length)],
      delay:Math.random()*0.3,
    })))
    if (onComplete) setTimeout(onComplete, 1500)
  }, [show])

  if (!show || particles.length===0) return null

  return (
    <div style={{ position:'fixed',inset:0,pointerEvents:'none',zIndex:500 }}>
      {particles.map((p,i) => (
        <div key={i} style={{
          position:'absolute',left:p.x+'%',top:p.y+'%',
          width:8,height:8,borderRadius:'50%',background:p.color,
          animation:'star-burst 1s '+p.delay+'s ease-out forwards',
        }} />
      ))}
    </div>
  )
}
