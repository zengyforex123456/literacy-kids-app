import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props { charIndex: number; onActivate: () => void }

export function FreeTrialBanner({ charIndex, onActivate }: Props) {
  const [show, setShow] = useState(true)

  if (!show || charIndex < 90) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:20 }}
        style={{
          margin:'12px 16px',padding:'14px 18px',borderRadius:16,
          background:'linear-gradient(135deg, var(--bbaby-purple), var(--bbaby-blue))',
          color:'white',display:'flex',alignItems:'center',gap:12,
          boxShadow:'0 4px 16px rgba(166,108,255,0.3)',
        }}
      >
        <div style={{ fontSize:28 }}>GIFT</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700,fontSize:14 }}>1-Day Free Trial!</div>
          <div style={{ fontSize:12,opacity:0.9 }}>Unlock ALL features free for 24 hours</div>
        </div>
        <button onClick={() => { onActivate(); setShow(false) }} style={{
          padding:'8px 16px',borderRadius:12,border:'none',
          background:'white',color:'var(--bbaby-purple)',fontWeight:700,fontSize:13,cursor:'pointer',
        }}>
          Activate
        </button>
        <button onClick={() => setShow(false)} style={{
          background:'none',border:'none',color:'rgba(255,255,255,0.6)',fontSize:18,cursor:'pointer',padding:0,
        }}>X</button>
      </motion.div>
    </AnimatePresence>
  )
}
