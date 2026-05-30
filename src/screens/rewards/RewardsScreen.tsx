import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { CollectionWall } from './CollectionWall'
import { motion } from 'framer-motion'
import { useUserStore } from '../../shared/stores/userStore'

const STICKERS = [
  { emoji:'🌟',name:'初识汉字',earned:true },
  { emoji:'🦋',name:'动物专家',earned:true },
  { emoji:'🌸',name:'水果达人',earned:true },
  { emoji:'🐰',name:'小兔子',earned:false },
  { emoji:'🍎',name:'红苹果',earned:false },
  { emoji:'🦁',name:'狮子王',earned:false },
  { emoji:'🌙',name:'月亮船',earned:false },
  { emoji:'⭐',name:'满星成就',earned:false },
  { emoji:'🏆',name:'十级学者',earned:false },
]

const ACHIEVEMENTS = [
  { level:1, name:'初学者', desc:'学会10个词', earned:true, medal:'🥇' },
  { level:2, name:'进阶者', desc:'学会50个词', earned:false, medal:'🥈' },
  { level:3, name:'大师', desc:'学会200个词', earned:false, medal:'🥉' },
]

export function RewardsScreen() {
const [showWall, setShowWall] = useState(false)
  const navigate = useNavigate()
  const { coins, streak } = useUserStore()

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', padding:'16px 16px 100px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0 16px' }}>
        <button onClick={() => navigate('/')} style={{ fontSize:24, border:'none', background:'none', cursor:'pointer' }}>←</button>
        <h1 style={{ fontFamily:'var(--font-heading)', fontSize:24 }}>🏆 成就与贴纸</h1>
        <span style={{ fontWeight:700, fontSize:18, background:'white', padding:'6px 14px', borderRadius:16, boxShadow:'var(--shadow-sm)' }}>⭐ {coins}</span>
      </div>

      {/* Achievements */}
      <h3 style={{ fontFamily:'var(--font-heading)', fontSize:18, marginBottom:12 }}>🏅 成就勋章</h3>
      <div style={{ display:'flex', gap:12, marginBottom:24 }}>
        {ACHIEVEMENTS.map(a => (
          <motion.div key={a.name}
            whileHover={a.earned ? { scale:1.05 } : {}}
            style={{
              flex:1, textAlign:'center', padding:20, borderRadius:20,
              background: a.earned ? 'white' : '#F5F5F5',
              opacity: a.earned ? 1 : 0.5,
              boxShadow: a.earned ? 'var(--shadow-sm)' : 'none',
              border: a.earned ? '2px solid var(--bbaby-yellow)' : '2px solid #EEE',
            }}
          >
            <div style={{ fontSize:40 }}>{a.earned ? a.medal : '🔒'}</div>
            <div style={{ fontWeight:700, fontSize:14, marginTop:4 }}>{a.name}</div>
            <small style={{ color:'#999' }}>{a.desc}</small>
          </motion.div>
        ))}
      </div>

      {/* Stickers */}
      <h3 style={{ fontFamily:'var(--font-heading)', fontSize:18, marginBottom:12 }}>🦄 贴纸背包</h3>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12 }}>
        {STICKERS.map(s => (
          <motion.div key={s.name}
            whileHover={s.earned ? { scale:1.1, rotate:-3 } : {}}
            style={{
              textAlign:'center', padding:20, borderRadius:20,
              background: s.earned ? 'white' : '#F5F5F5',
              opacity: s.earned ? 1 : 0.4,
              boxShadow: s.earned ? 'var(--shadow-sm)' : 'none',
              border: s.earned ? '2px solid var(--bbaby-pink)' : '2px solid #EEE',
            }}
          >
            <div style={{ fontSize:48 }}>{s.earned ? s.emoji : '🔒'}</div>
            <small style={{ fontWeight:600 }}>{s.name}</small>
          </motion.div>
        ))}
      </div>

      {/* Streak */}
      <motion.div
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        style={{
          marginTop:24, padding:20, background:'linear-gradient(135deg, var(--bbaby-orange), var(--bbaby-red))',
          borderRadius:20, color:'white', display:'flex', alignItems:'center', gap:16,
        }}
      >
        <div style={{ fontSize:48 }}>🔥</div>
        <div>
          <div style={{ fontWeight:700, fontSize:18 }}>连续打卡 {streak} 天</div>
          <small style={{ opacity:0.9 }}>再坚持 {7 - (streak % 7)} 天获得额外奖励!</small>
        </div>
      </motion.div>
    </div>
  )
}
