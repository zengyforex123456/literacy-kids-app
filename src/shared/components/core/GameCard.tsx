import { motion } from 'framer-motion'

interface Props { emoji: string; label: string; desc: string; color: string; onClick: () => void }

export function GameCard({ emoji, label, desc, color, onClick }: Props) {
  return (
    <motion.div
      whileHover={{ scale:1.04 }} whileTap={{ scale:0.95 }}
      onClick={onClick}
      style={{
        padding:'24px 16px',textAlign:'center',cursor:'pointer',
        borderTop:'5px solid '+color,minHeight:150,
        display:'flex',flexDirection:'column',alignItems:'center',
        justifyContent:'center',gap:8,background:'white',
        borderRadius:22,boxShadow:'0 8px 32px rgba(0,0,0,0.08)',
      }}>
      <div style={{ fontSize:40 }}>{emoji}</div>
      <div style={{ fontWeight:700,fontSize:15,fontFamily:'var(--font-heading)' }}>{label}</div>
      <small style={{ color:'#94A3B8',fontSize:12 }}>{desc}</small>
    </motion.div>
  )
}
