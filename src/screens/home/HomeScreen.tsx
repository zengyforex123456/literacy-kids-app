import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../../shared/stores/userStore'
import { useVoice } from '../../shared/hooks/useVoice'

import { useEffect } from 'react'

export function HomeScreen() {
  const navigate = useNavigate()
  const { name, avatar, coins, streak } = useUserStore()
  const { speak } = useVoice()
  

  useEffect(() => { speak('欢迎来到识字乐园！选一个游戏吧！') }, [])

  const games = [
    { id: 'treasure-hunt', icon: '🔍', label: '森林寻宝', emoji: '🏕️', color: '#FFCC80', desc: '找卡片学单词' },
    { id: 'bubble-pop', icon: '🫧', label: '泡泡大作战', emoji: '🫧', color: '#90CAF9', desc: '听音戳泡泡' },
    { id: 'matching', icon: '🧩', label: '配对大闯关', emoji: '🎯', color: '#A5D6A7', desc: '图文连连看' },
    { id: 'writing', icon: '✏️', label: '书写描红', emoji: '✍️', color: '#F8BBD0', desc: '练习写汉字' },
  ]

  return (
    <div style={{ padding: '16px 16px 100px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0 16px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, color: 'var(--primary)', textShadow: '2px 2px 0 var(--accent)' }}>
          🌳 识字乐园
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '8px 16px', borderRadius: 24, boxShadow: 'var(--shadow)', fontWeight: 700 }}>
          <span>⭐ {coins}</span>
          <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{avatar}</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #FFE66D, #FF6B6B)', borderRadius: 'var(--radius)',
        padding: 24, color: 'white', marginBottom: 20, position: 'relative', overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22 }}>今天学了新词了吗？</h2>
        <p style={{ opacity: 0.9, fontSize: 14 }}>继续加油，{name}！🗺️</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 13, fontWeight: 700 }}>
          <span style={{ background: 'rgba(255,255,255,0.25)', padding: '4px 12px', borderRadius: 12 }}>📚 已学 0/500</span>
          <span style={{ background: 'rgba(255,255,255,0.25)', padding: '4px 12px', borderRadius: 12 }}>🔥 连续 {streak} 天</span>
        </div>
        <div style={{ position: 'absolute', right: -10, bottom: -5, fontSize: 50, opacity: 0.4 }}>🌳🌸🦋</div>
      </div>

      {/* Game Grid */}
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, marginBottom: 12 }}>🎮 今日游戏</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {games.map((game) => (
          <div key={game.id}
            onClick={() => navigate(`/game/${game.id}`)}
            style={{
              background: 'white', borderRadius: 'var(--radius)', padding: '20px 16px',
              textAlign: 'center', cursor: 'pointer', boxShadow: 'var(--shadow)',
              border: `3px solid ${game.color}`, minHeight: 150,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 8, transition: 'transform 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div style={{ fontSize: 48 }}>{game.emoji}</div>
            <div style={{ fontWeight: 700, fontSize: 16, fontFamily: 'var(--font-heading)' }}>{game.label}</div>
            <small style={{ color: '#999' }}>{game.desc}</small>
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        maxWidth: 768, width: '100%', display: 'flex', justifyContent: 'space-around',
        background: 'white', padding: '8px 16px 20px', borderRadius: '24px 24px 0 0',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)', zIndex: 100,
      }}>
        {[
          { icon: '🏠', label: '首页', active: true },
          { icon: '🎒', label: '贴纸', onClick: () => navigate('/rewards') },
          { icon: '🏆', label: '成就', onClick: () => navigate('/rewards') },
          { icon: '👨‍👩‍👧', label: '家长', onClick: () => navigate('/parent') },
        ].map(item => (
          <div key={item.label}
            onClick={item.onClick}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              fontSize: 11, fontWeight: 700, cursor: 'pointer',
              color: item.active ? 'var(--primary)' : '#B2BEC3',
              background: item.active ? '#FFF0F0' : 'transparent',
              padding: '8px 16px', borderRadius: 16,
            }}>
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}
