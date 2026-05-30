import { motion } from 'framer-motion'

interface Props { weeklyData: { week:string; count:number }[] }

export function ProgressCurve({ weeklyData }: Props) {
  if (weeklyData.length === 0) return null
  const maxVal = Math.max(...weeklyData.map(d => d.count), 1)

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }}
      style={{ padding:16,background:'white',borderRadius:16,boxShadow:'var(--shadow-sm)' }}
    >
      <div style={{ fontWeight:700,fontSize:14,marginBottom:12,color:'var(--bbaby-text)' }}>
        Weekly Progress
      </div>
      <div style={{ display:'flex',alignItems:'flex-end',gap:8,height:120 }}>
        {weeklyData.map((d, i) => {
          const h = Math.max((d.count / maxVal) * 100, 4)
          return (
            <div key={i} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4 }}>
              <motion.div
                initial={{ height:0 }} animate={{ height:h + '%' }}
                transition={{ delay:i*0.1,duration:0.5 }}
                style={{
                  width:'100%',maxWidth:40,borderRadius:'8px 8px 0 0',
                  background:d.count > 0 ? 'var(--bbaby-green)' : '#EEE',
                  minHeight:4,
                }}
              />
              <div style={{ fontSize:10,color:'#999' }}>{d.week}</div>
            </div>
          )
        })}
      </div>
      <div style={{ textAlign:'center',marginTop:8,fontSize:13,fontWeight:600,color:'var(--bbaby-green)' }}>
        +{weeklyData.reduce((s,d) => s + d.count, 0)} chars this month
      </div>
    </motion.div>
  )
}
