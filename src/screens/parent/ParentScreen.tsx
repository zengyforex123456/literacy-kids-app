import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSettingsStore } from '../../shared/stores/settingsStore'

export function ParentScreen() {
  const navigate = useNavigate()
  const settings = useSettingsStore()
  const [pin, setPin] = useState('')
  const [unlocked, setUnlocked] = useState(false)

  const handlePin = (d: string) => {
    const newPin = pin + d
    if (newPin.length >= 4) {
      if (newPin === settings.parentPin) { setUnlocked(true); setPin('') }
      else { setPin(''); alert('密码错误') }
      return
    }
    setPin(newPin)
  }

  if (!unlocked) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', gap:20, padding:40 }}>
        <button onClick={() => navigate('/')} style={{ position:'absolute', top:16, left:16, fontSize:24, border:'none', background:'none', cursor:'pointer' }}>←</button>
        <div style={{ fontSize:56 }}>🔐</div>
        <div style={{ fontSize:20, fontWeight:700, fontFamily:'var(--font-heading)' }}>请输入家长密码</div>
        <div style={{ display:'flex', gap:12 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              width:18, height:18, borderRadius:'50%',
              background: i < pin.length ? 'var(--bbaby-red)' : '#E0E0E0',
              transition:'background 0.2s',
            }} />
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12, maxWidth:300 }}>
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map(k =>
            <button key={k} onClick={() => k === '⌫' ? setPin(p => p.slice(0, -1)) : k && handlePin(k)}
              style={{
                width:72, height:72, borderRadius:'50%', border:'none',
                background: k ? 'white' : 'transparent',
                boxShadow: k ? 'var(--shadow-sm)' : 'none',
                fontSize:28, fontWeight:700, cursor: k ? 'pointer' : 'default',
                color:'var(--bbaby-text)',
              }}
            >{k}</button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding:'16px 16px 100px', minHeight:'100vh' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0 16px' }}>
        <button onClick={() => navigate('/')} style={{ fontSize:24, border:'none', background:'none', cursor:'pointer' }}>←</button>
        <h1 style={{ fontFamily:'var(--font-heading)', fontSize:22 }}>👨‍👩‍👧 家长中心</h1>
        <div />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
        {[
          { label:'已学汉字', value:'24/500', color:'var(--bbaby-red)' },
          { label:'已学英文', value:'18/500', color:'var(--bbaby-blue)' },
          { label:'游戏次数', value:'37 次', color:'var(--bbaby-green)' },
          { label:'正确率', value:'92%', color:'var(--bbaby-purple)' },
        ].map(s => (
          <motion.div key={s.label} whileHover={{ scale:1.03 }}
            style={{
              padding:16, borderRadius:16, textAlign:'center',
              background:'white', boxShadow:'var(--shadow-sm)',
              borderTop:'4px solid ' + s.color,
            }}
          >
            <div style={{ color:'#999', fontSize:13 }}>{s.label}</div>
            <div style={{ fontWeight:700, fontSize:24, color:s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <h3 style={{ fontFamily:'var(--font-heading)', fontSize:18, marginBottom:12 }}>⚙️ 设置</h3>
      <div style={{ background:'white', borderRadius:20, boxShadow:'var(--shadow-sm)', overflow:'hidden' }}>
        {[
          { label:'📊 每日时长', value: settings.dailyLimitMinutes + ' 分钟' },
          { label:'📈 难度等级', value: ['⭐ 简单','⭐⭐ 中等','⭐⭐⭐ 挑战'][settings.difficulty - 1] },
          { label:'👁️ 护眼模式', toggle: settings.eyeCare, onToggle: settings.toggleEyeCare },
          { label:'🔔 学习提醒', toggle: settings.reminder, onToggle: settings.toggleReminder },
          { label:'🎵 背景音乐', toggle: settings.music, onToggle: settings.toggleMusic },
        ].map((item, i) => (
          <div key={i} style={{
            display:'flex', justifyContent:'space-between', alignItems:'center',
            padding:'14px 16px',
            borderBottom: i < 4 ? '1px solid #F0F0F0' : 'none',
          }}>
            <span style={{ fontWeight:600, fontSize:15 }}>{item.label}</span>
            {'toggle' in item ? (
              <div onClick={item.onToggle} style={{
                width:52, height:28, borderRadius:14, cursor:'pointer',
                background: item.toggle ? 'var(--bbaby-green)' : '#CCC',
                position:'relative', transition:'background 0.3s',
              }}>
                <div style={{
                  width:24, height:24, borderRadius:'50%', background:'white',
                  position:'absolute', top:2,
                  left: item.toggle ? 26 : 2, transition:'left 0.3s',
                }} />
              </div>
            ) : (
              <strong>{item.value}</strong>
            )}
          </div>
        ))}
      </div>

      <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.95 }}
        onClick={() => navigate('/report')}
        style={{
          width:'100%', marginTop:16, padding:14, borderRadius:16, border:'none',
          background:'var(--bbaby-blue)', color:'white',
          fontWeight:700, fontSize:16, cursor:'pointer',
        }}
      >
        📊 查看学习报告
      </motion.button>
    </div>
  )
}
