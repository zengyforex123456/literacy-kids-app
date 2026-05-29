import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUserStore } from '../../shared/stores/userStore'
import { useVoice } from '../../shared/hooks/useVoice'

const GAMES = [
  { id: 'treasure-hunt', icon: '🌳', label: '汉字森林', desc: '探索字族树', color: '#6BCB77' },
  { id: 'bubble-pop', icon: '🫧', label: '泡泡大战', desc: '听音戳泡泡', color: '#4ECDC4' },
  { id: 'matching', icon: '🎯', label: '配对闯关', desc: '图文连连看', color: '#FF9F43' },
  { id: 'writing', icon: '✍️', label: '书写描红', desc: '练习写汉字', color: '#FF9FF3' },
]

export function HomeScreen() {
  const navigate = useNavigate()
  const { name, avatar, coins, streak, checkStreak } = useUserStore()
  const { speak } = useVoice()

  useEffect(() => { checkStreak(); speak('欢迎来到识字乐园！') }, [])

  const heroBg = 'linear-gradient(135deg, var(--bbaby-yellow), var(--bbaby-red))'

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', paddingBottom:80 }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px 8px' }}>
        <h1 style={{ fontFamily:'var(--font-heading)', fontSize:26, color:'var(--bbaby-red)', textShadow:'2px 2px 0 var(--bbaby-yellow)' }}>
          🌳 识字乐园
        </h1>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'white', borderRadius:24, padding:'6px 16px', boxShadow:'var(--shadow-sm)', fontWeight:700 }}>
          <span>⭐ {coins}</span>
          <span style={{ width:36, height:36, borderRadius:'50%', background:'var(--bbaby-yellow)', display:'flex', alignItems:'center', justifyContent:'center' }}>{avatar}</span>
        </div>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
        style={{
          margin:'0 16px', borderRadius:24, padding:24, color:'white', marginBottom:20,
          position:'relative', overflow:'hidden', background: heroBg,
        }}
      >
        <h2 style={{ fontFamily:'var(--font-heading)', fontSize:18, fontWeight:700 }}>
          今天学了新词了吗？
        </h2>
        <p style={{ fontSize:14, opacity:0.9 }}>继续加油，{name}！🗺️</p>
        <div style={{ display:'flex', gap:12, marginTop:12, fontSize:13, fontWeight:700 }}>
          <span style={{ background:'rgba(255,255,255,0.25)', padding:'4px 12px', borderRadius:12 }}>📚 已学 0/500</span>
          <span style={{ background:'rgba(255,255,255,0.25)', padding:'4px 12px', borderRadius:12 }}>🔥 连续 {streak} 天</span>
        </div>
        <div style={{ position:'absolute', right:-8, bottom:-4, fontSize:48, opacity:0.3 }}>🌳🌸🦋</div>
      </motion.div>

      {/* Progress */}
      <div style={{ margin:'0 16px', marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, fontWeight:600, marginBottom:6 }}>
          <span>学习进度</span><span>0/500</span>
        </div>
        <div style={{ height:10, background:'#E8E8E8', borderRadius:5, overflow:'hidden' }}>
          <div style={{ height:'100%', width:'0%', background:'linear-gradient(90deg, var(--bbaby-blue), var(--bbaby-green))', borderRadius:5, transition:'width 0.5s' }} />
        </div>
      </div>

      {/* Game Cards */}
      <h3 style={{ fontFamily:'var(--font-heading)', fontSize:18, fontWeight:700, padding:'0 16px', marginBottom:12 }}>
        🎮 今日游戏
      </h3>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, padding:'0 16px' }}>
        {GAMES.map((game) => (
          <motion.div key={game.id}
            whileHover={{ scale:1.04 }}
            whileTap={{ scale:0.95 }}
            onClick={() => navigate('/game/' + game.id)}
            style={{
              background:'white', borderRadius:20, padding:'20px 16px',
              textAlign:'center', cursor:'pointer',
              boxShadow:'0 4px 0 rgba(0,0,0,0.08)',
              border:'3px solid ' + game.color,
              minHeight:150, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', gap:8,
              transition:'transform 0.2s',
            }}
          >
            <div style={{ fontSize:44 }}>{game.icon}</div>
            <div style={{ fontWeight:700, fontSize:16, fontFamily:'var(--font-heading)' }}>{game.label}</div>
            <small style={{ color:'#999' }}>{game.desc}</small>
          </motion.div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
        maxWidth:768, width:'100%',
        display:'flex', justifyContent:'space-around',
        background:'white', padding:'8px 16px 20px',
        borderRadius:'24px 24px 0 0',
        boxShadow:'0 -4px 20px rgba(0,0,0,0.06)', zIndex:100,
      }}>
        {[
          { icon:'🏠', label:'首页', active:true },
          { icon:'🎒', label:'贴纸', onClick:() => navigate('/rewards') },
          { icon:'🏆', label:'成就', onClick:() => navigate('/rewards') },
          { icon:'👨‍👩‍👧', label:'家长', onClick:() => navigate('/parent') },
        ].map(item => (
          <div key={item.label}
            onClick={item.onClick}
            style={{
              display:'flex', flexDirection:'column', alignItems:'center', gap:4,
              fontSize:11, fontWeight:700, cursor:'pointer',
              color: item.active ? 'var(--bbaby-red)' : '#B2BEC3',
              background: item.active ? '#FFF0F0' : 'transparent',
              padding:'8px 16px', borderRadius:16,
            }}>
            <span style={{ fontSize:24 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}
