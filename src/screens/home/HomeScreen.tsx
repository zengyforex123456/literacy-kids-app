import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUserStore } from '../../shared/stores/userStore'
import { useVoice } from '../../shared/hooks/useVoice'
import { SimplePet } from '../../shared/components/SimplePet'
import { DailyBox } from '../../shared/components/DailyBox'

const GAMES = [
  { id:'treasure-hunt',emoji:'🌳',label:'汉字森林',desc:'探索字族树',color:'#16A34A' },
  { id:'bubble-pop',emoji:'🫧',label:'泡泡大战',desc:'听音戳泡泡',color:'#1A73E8' },
  { id:'matching',emoji:'🎯',label:'配对闯关',desc:'汉字配配对',color:'#F9A826' },
  { id:'writing',emoji:'✍️',label:'书写描红',desc:'练习写汉字',color:'#EC4899' },
  { id:'quiz',emoji:'🧠',label:'小测验',desc:'测试掌握的字',color:'#7C3AED' },
]

export function HomeScreen() {
  const navigate = useNavigate()
  const { name, avatar, coins, streak, checkStreak } = useUserStore()
  const { speak } = useVoice()

  useEffect(() => { checkStreak(); speak('欢迎!') }, [])

  return (
    <div style={{ display:'flex',flexDirection:'column',minHeight:'100vh',paddingBottom:80,position:'relative' }}>
      <SimplePet />
      <DailyBox />

      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px 8px' }}>
        <motion.h1 initial={{ opacity:0,x:-20 }} animate={{ opacity:1,x:0 }}
          className="gradient-text"
          style={{ fontFamily:'var(--font-heading)',fontSize:28,fontWeight:800 }}>
          魔法森林
        </motion.h1>
        <motion.div initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }}
          className="disney-card"
          style={{ display:'flex',alignItems:'center',gap:8,padding:'6px 16px',borderRadius:28,fontWeight:700 }}>
          <span>⭐ {coins}</span>
          <span style={{ width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,var(--disney-gold-light),var(--disney-gold))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20 }}>{avatar}</span>
        </motion.div>
      </div>

      <motion.div initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }}
        className="magic-bg"
        style={{ margin:'0 16px',padding:28,borderRadius:28,marginBottom:20,position:'relative',overflow:'hidden' }}>
        <div style={{ position:'relative',zIndex:1 }}>
          <h2 style={{ fontFamily:'var(--font-heading)',fontSize:20,fontWeight:700,color:'var(--disney-charcoal)' }}>
            欢迎回来, {name}!
          </h2>
          <p style={{ fontSize:14,color:'#64748B',marginTop:4 }}>继续你的魔法学习之旅吧...</p>
          <div style={{ display:'flex',gap:12,marginTop:14,fontSize:13,fontWeight:700 }}>
            <span className="disney-card" style={{ padding:'6px 14px',borderRadius:20,background:'rgba(255,255,255,0.8)',color:'var(--disney-green)' }}>Book 0/200</span>
            <span className="disney-card" style={{ padding:'6px 14px',borderRadius:20,background:'rgba(255,255,255,0.8)',color:'var(--disney-gold)' }}>Fire {streak} days</span>
          </div>
        </div>
        <div style={{ position:'absolute',right:10,top:10,fontSize:40,opacity:0.3 }}>⭐</div>
      </motion.div>

      <div style={{ margin:'0 16px',marginBottom:20 }}>
        <div style={{ display:'flex',justifyContent:'space-between',fontSize:13,fontWeight:600,marginBottom:6 }}>
          <span>今日进度</span><span style={{ color:'var(--disney-purple)' }}>0/5</span>
        </div>
        <div style={{ height:12,background:'#F1F5F9',borderRadius:6,overflow:'hidden',boxShadow:'inset 0 2px 4px rgba(0,0,0,0.06)' }}>
          <motion.div initial={{ width:0 }} animate={{ width:'20%' }}
            style={{ height:'100%',background:'linear-gradient(90deg,var(--disney-gold),var(--disney-pink))',borderRadius:6 }} />
        </div>
      </div>

      <h3 style={{ fontFamily:'var(--font-heading)',fontSize:18,padding:'0 16px',marginBottom:12,color:'var(--disney-charcoal)' }}>今日游戏</h3>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,padding:'0 16px' }}>
        {GAMES.map((game, i) => (
          <motion.div key={game.id}
            initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }}
            transition={{ delay:i*0.08 }}
            whileHover={{ scale:1.04 }} whileTap={{ scale:0.95 }}
            onClick={() => navigate('/game/'+game.id)}
            style={{
              padding:'24px 16px',textAlign:'center',cursor:'pointer',
              borderTop:'5px solid '+game.color,
              minHeight:150,display:'flex',flexDirection:'column',
              alignItems:'center',justifyContent:'center',gap:8,
              background:'white',borderRadius:22,
              boxShadow:'0 8px 32px rgba(0,0,0,0.08)',
              position:'relative',overflow:'hidden',
            }}>
            <div style={{ fontSize:40 }}>{game.emoji}</div>
            <div style={{ fontWeight:700,fontSize:15,fontFamily:'var(--font-heading)' }}>{game.label}</div>
            <small style={{ color:'#94A3B8',fontSize:12 }}>{game.desc}</small>
          </motion.div>
        ))}
      </div>

      <div style={{
        position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',
        maxWidth:768,width:'100%',
        display:'flex',justifyContent:'space-around',
        background:'rgba(255,255,255,0.95)',backdropFilter:'blur(20px)',
        padding:'8px 16px 20px',borderRadius:'28px 28px 0 0',
        boxShadow:'0 -4px 24px rgba(0,0,0,0.06)',zIndex:100,
      }}>
        {[
          { icon:'首页',label:'首页',active:true,onClick:() => navigate('/') },
          { icon:'🎒',label:'贴纸',onClick:() => navigate('/rewards') },
          { icon:'🏆',label:'成就',onClick:() => navigate('/rewards') },
          { icon:'👨‍👩‍👧',label:'家长',onClick:() => navigate('/parent') },
        ].map(item => (
          <div key={item.label} onClick={item.onClick}
            style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:4,
              fontSize:11,fontWeight:700,cursor:'pointer',
              color:item.active?'var(--disney-purple)':'#94A3B8',
              background:item.active?'rgba(124,58,237,0.08)':'transparent',
              padding:'8px 14px',borderRadius:20,transition:'all 0.2s' }}>
            <span style={{ fontSize:22 }}>{item.icon}</span>{item.label}
          </div>
        ))}
      </div>
    </div>
  )
}