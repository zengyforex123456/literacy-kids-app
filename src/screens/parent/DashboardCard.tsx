import { motion } from 'framer-motion'

interface Props {
  todayLearned: string[]
  errorChars: string[]
  totalLearned: number
  streak: number
  gameMinutes: number
}

export function DashboardCard({ todayLearned, errorChars, totalLearned, streak, gameMinutes }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: 20, borderRadius: 20, color: 'white', marginBottom: 20,
        background: 'linear-gradient(135deg, var(--bbaby-blue), var(--bbaby-green))',
      }}
    >
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, marginBottom: 12 }}>
        今日学习简报
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { label: '已学汉字', value: `${totalLearned}/200`, color: '#FFF' },
          { label: '连续打卡', value: `${streak} 天`, color: '#FFE66D' },
          { label: '今日新学', value: `${todayLearned.length} 个`, color: '#A8E6CF' },
          { label: '学习时长', value: `${gameMinutes} 分钟`, color: '#FFD3B6' },
        ].map(s => (
          <div key={s.label}
            style={{
              background: 'rgba(255,255,255,0.2)', borderRadius: 12,
              padding: '10px 14px', textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.9 }}>{s.label}</div>
            <div style={{ fontWeight: 700, fontSize: 22, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Today's words */}
      {todayLearned.length > 0 && (
        <div style={{ marginTop: 14, background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>今日新学</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {todayLearned.map(ch => (
              <span key={ch} style={{
                background: 'white', color: 'var(--bbaby-text)',
                borderRadius: 8, padding: '4px 10px', fontSize: 18, fontWeight: 700,
              }}>{ch}</span>
            ))}
          </div>
        </div>
      )}

      {/* Error-prone chars */}
      {errorChars.length > 0 && (
        <div style={{ marginTop: 10, background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>需要复习</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {errorChars.map(ch => (
              <span key={ch} style={{
                background: '#FFE66D', color: 'var(--bbaby-text)',
                borderRadius: 8, padding: '4px 10px', fontSize: 18, fontWeight: 700,
              }}>{ch}</span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
