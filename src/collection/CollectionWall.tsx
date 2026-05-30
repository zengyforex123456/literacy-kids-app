import { useState } from 'react'
import { motion } from 'framer-motion'
import { getAllFamilies } from '../shared/utils/radicalQuery'

const COLORS = ['#FF6B6B','#4ECDC4','#FFE66D','#A66CFF','#FF9F43','#6BCB77']

interface Props { learnedChars: string[]; onClose: () => void }

export function CollectionWall({ learnedChars, onClose }: Props) {
  const families = getAllFamilies()
  const learnedSet = new Set(learnedChars)

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }}
      style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:300,padding:16 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale:0.8 }} animate={{ scale:1 }}
        onClick={e => e.stopPropagation()}
        style={{ background:'white',borderRadius:24,padding:24,maxWidth:420,width:'100%',maxHeight:'80vh',overflow:'auto' }}
      >
        <h2 style={{ fontFamily:'var(--font-heading)',fontSize:22,textAlign:'center',marginBottom:12 }}>
          Rad Collection Wall
        </h2>
        <p style={{ textAlign:'center',fontSize:14,color:'#666',marginBottom:16 }}>
          Complete a radical family to unlock its badge!
        </p>
        <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
          {families.map((f: any, i: number) => {
            const learned = f.members.filter((m: string) => learnedSet.has(m)).length
            const total = f.members.length
            const complete = learned >= total
            const pct = total > 0 ? Math.round((learned/total)*100) : 0
            return (
              <motion.div key={f.radical}
                initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }}
                transition={{ delay:i*0.05 }}
                style={{
                  padding:14,borderRadius:16,
                  background: complete ? COLORS[i%COLORS.length] : '#F5F5F5',
                  color: complete ? 'white' : 'var(--bbaby-text)',
                  display:'flex',alignItems:'center',gap:12,
                }}
              >
                <div style={{ width:44,height:44,borderRadius:14,background:complete?'rgba(255,255,255,0.3)':'#EEE',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700 }}>
                  {complete ? 'OK' : pct + '%'}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700,fontSize:15 }}>{f.name}</div>
                  <div style={{ fontSize:12,opacity:0.8 }}>
                    {complete ? 'Mastered! ' + total + ' chars' : learned + '/' + total + ' chars'}
                  </div>
                  <div style={{ height:4,borderRadius:2,marginTop:4,background:complete?'rgba(255,255,255,0.4)':'#E0E0E0',overflow:'hidden' }}>
                    <div style={{ height:'100%',width:pct+'%',background:complete?'white':'var(--bbaby-green)',borderRadius:2,transition:'width 0.5s' }} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
        <button onClick={onClose} style={{ width:'100%',marginTop:16,padding:12,borderRadius:14,border:'none',background:'var(--bbaby-red)',color:'white',fontWeight:700,fontSize:16,cursor:'pointer' }}>
          Close
        </button>
      </motion.div>
    </motion.div>
  )
}
