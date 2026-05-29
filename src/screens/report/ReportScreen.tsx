import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export function ReportScreen() {
  const navigate = useNavigate()

  return (
    <div style={{ padding:'16px 16px 100px', minHeight:'100vh' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0 16px' }}>
        <button onClick={() => navigate('/parent')} style={{ fontSize:24, border:'none', background:'none', cursor:'pointer' }}>←</button>
        <h1 style={{ fontFamily:'var(--font-heading)', fontSize:22 }}>📊 学习报告</h1>
        <div />
      </div>

      <div style={{
        padding:24, borderRadius:20, color:'white', marginBottom:20,
        background:'linear-gradient(135deg, var(--bbaby-blue), var(--bbaby-green))',
      }}>
        <h2 style={{ fontFamily:'var(--font-heading)', fontSize:20 }}>本周学习总结</h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:12 }}>
          {[
            { label:'新学词汇', value:'21 个' },
            { label:'游戏次数', value:'15 次' },
            { label:'正确率', value:'92%' },
            { label:'学习时长', value:'2.5 小时' },
          ].map(s => (
            <div key={s.label} style={{ background:'rgba(255,255,255,0.2)', padding:'10px 14px', borderRadius:12 }}>
              <div style={{ fontSize:12, opacity:0.9 }}>{s.label}</div>
              <div style={{ fontWeight:700, fontSize:22 }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      <h3 style={{ fontFamily:'var(--font-heading)', fontSize:18, marginBottom:12 }}>🔍 需要加强</h3>
      {[
        { category:'动物', learned:12, total:30, color:'var(--bbaby-red)' },
        { category:'水果', learned:8, total:20, color:'var(--bbaby-blue)' },
        { category:'身体部位', learned:4, total:15, color:'var(--bbaby-yellow)' },
      ].map(c => (
        <motion.div key={c.category} whileHover={{ scale:1.01 }}
          style={{
            background:'white', borderRadius:16, padding:16, marginBottom:10,
            boxShadow:'var(--shadow-sm)',
          }}
        >
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, fontWeight:600, marginBottom:6 }}>
            <span>{c.category}</span>
            <span style={{ color: c.color }}>{c.learned}/{c.total}</span>
          </div>
          <div style={{ height:8, background:'#F0F0F0', borderRadius:4, overflow:'hidden' }}>
            <div style={{ height:'100%', background:c.color, borderRadius:4, width:((c.learned/c.total)*100)+'%', transition:'width 0.5s' }} />
          </div>
        </motion.div>
      ))}

      <h3 style={{ fontFamily:'var(--font-heading)', fontSize:18, marginBottom:12, marginTop:20 }}>💡 建议复习</h3>
      <div style={{ background:'white', borderRadius:16, padding:16, boxShadow:'var(--shadow-sm)' }}>
        {['🐘 elephant 大象','🦁 lion 狮子','🐟 fish 鱼'].map((w, i) => (
          <div key={i} style={{ padding:'10px 0', fontWeight:600, borderBottom: i < 2 ? '1px solid #F0F0F0' : 'none' }}>
            {w}
          </div>
        ))}
      </div>
    </div>
  )
}
