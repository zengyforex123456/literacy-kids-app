import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../../shared/stores/userStore'

const STICKERS = [
  { emoji: '🌟', name: '初识汉字', earned: true },
  { emoji: '🦋', name: '动物专家', earned: true },
  { emoji: '🌸', name: '水果达人', earned: true },
  { emoji: '🐰', name: '小兔子', earned: false },
  { emoji: '🍎', name: '红苹果', earned: false },
  { emoji: '🦁', name: '狮子王', earned: false },
  { emoji: '🌙', name: '月亮船', earned: false },
  { emoji: '⭐', name: '满星成就', earned: false },
  { emoji: '🏆', name: '十级学者', earned: false },
]

const ACHIEVEMENTS = [
  { level: 1, name: '初学者', description: '学会10个词', earned: true },
  { level: 2, name: '进阶者', description: '学会50个词', earned: false },
  { level: 3, name: '大师', description: '学会200个词', earned: false },
]

export function RewardsScreen() {
  const navigate = useNavigate()
  const { coins, streak } = useUserStore()

  return (
    <div style={{ padding: '16px 16px 100px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0 16px' }}>
        <button onClick={() => navigate('/')} style={{ fontSize: 24, border: 'none', background: 'none', cursor: 'pointer' }}>←</button>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24 }}>🏆 成就与贴纸</h1>
        <span style={{ fontWeight: 700, fontSize: 18, background: 'white', padding: '6px 14px', borderRadius: 16 }}>⭐ {coins}</span>
      </div>

      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, marginBottom: 12 }}>🏅 成就勋章</h3>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {ACHIEVEMENTS.map(a => (
          <div key={a.name} style={{
            flex: 1, textAlign: 'center', padding: 20, borderRadius: 'var(--radius)',
            background: a.earned ? 'white' : '#F0F0F0', opacity: a.earned ? 1 : 0.5,
            boxShadow: a.earned ? 'var(--shadow)' : 'none',
          }}>
            <div style={{ fontSize: 40 }}>{a.earned ? ['🥇','🥈','🥉'][a.level-1] : '🔒'}</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4 }}>{a.name}</div>
            <small style={{ color: '#999' }}>{a.description}</small>
          </div>
        ))}
      </div>

      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, marginBottom: 12 }}>🦄 贴纸背包</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {STICKERS.map(s => (
          <div key={s.name} style={{
            textAlign: 'center', padding: 20, borderRadius: 'var(--radius)',
            background: s.earned ? 'white' : '#F0F0F0', opacity: s.earned ? 1 : 0.4,
            boxShadow: s.earned ? 'var(--shadow)' : 'none',
          }}>
            <div style={{ fontSize: 48 }}>{s.earned ? s.emoji : '🔒'}</div>
            <small style={{ fontWeight: 600 }}>{s.name}</small>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 24, padding: 20, background: 'white', borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{ fontSize: 48 }}>🔥</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>连续打卡 {streak} 天</div>
          <small style={{ color: '#999' }}>再坚持 {7 - (streak % 7)} 天获得额外奖励!</small>
        </div>
      </div>
    </div>
  )
}
