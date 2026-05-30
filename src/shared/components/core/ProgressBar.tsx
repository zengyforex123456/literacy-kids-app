import { motion } from 'framer-motion'

interface Props { percent: number; color?: string; height?: number; label?: string }

export function ProgressBar({ percent, color, height, label }: Props) {
  const c = color || 'linear-gradient(90deg,var(--disney-gold),var(--disney-pink))'
  const h = height || 12
  return (
    <div>
      {label && <div style={{ display:'flex',justifyContent:'space-between',fontSize:13,fontWeight:600,marginBottom:6 }}><span>{label}</span><span>{Math.round(percent)}%</span></div>}
      <div style={{ height:h,background:'#F1F5F9',borderRadius:h/2,overflow:'hidden',boxShadow:'inset 0 2px 4px rgba(0,0,0,0.06)' }}>
        <motion.div initial={{ width:0 }} animate={{ width:Math.min(percent,100)+'%' }} style={{ height:'100%',background:c,borderRadius:h/2,transition:'width 0.5s' }} />
      </div>
    </div>
  )
}
