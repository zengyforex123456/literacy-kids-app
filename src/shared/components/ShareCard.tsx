import { motion } from 'framer-motion'
import { useUserStore } from '../stores/userStore'
import { useProfileStore } from '../stores/profileStore'

interface Props {
  show: boolean
  todayLearned: string[]
  totalLearned: number
  onClose: () => void
}

export function ShareCard({ show, todayLearned, totalLearned, onClose }: Props) {
  if (!show) return null

  const { streak } = useUserStore()
  const profile = useProfileStore(s => s.getActiveProfile())

  // Peer comparison (simulated — real data would come from backend)
  const peerPercentile = totalLearned >= 50 ? 85 : totalLearned >= 20 ? 60 : 30
  const peerEmoji = peerPercentile >= 80 ? '🏆' : peerPercentile >= 50 ? '⭐' : '🌱'

  const handleShare = async () => {
    const text = [
      `${profile?.name || '宝贝'}的识字日报 📚`,
      `今日新学: ${todayLearned.join(' ')} (${todayLearned.length}字)`,
      `累计已学: ${totalLearned}字`,
      `连续打卡: ${streak}天 🔥`,
      `超过${peerPercentile}%同龄小朋友 ${peerEmoji}`,
      `— 识字乐园 App`,
    ].join('\n')

    if (navigator.share) {
      await navigator.share({ title: '识字学习日报', text })
    } else {
      await navigator.clipboard.writeText(text)
      alert('已复制! 可以分享到微信啦 📤')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 400, padding: 16,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 24, padding: 24,
          maxWidth: 360, width: '100%', textAlign: 'center',
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, var(--bbaby-red), var(--bbaby-purple))',
          borderRadius: 16, padding: 24, color: 'white', marginBottom: 16,
        }}>
          <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 4 }}>
            {profile?.name || '宝贝'} · 第{streak}天
          </div>
          <div style={{ fontSize: 52 }}>{peerEmoji}</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, marginTop: 4 }}>
            今日识字日报
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 800 }}>{todayLearned.length}</div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>今日新学</div>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 800 }}>{totalLearned}</div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>累计已学</div>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 800 }}>🔥{streak}</div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>连续打卡</div>
            </div>
          </div>

          <div style={{
            marginTop: 14, background: 'rgba(255,255,255,0.2)',
            borderRadius: 10, padding: '8px 12px', fontSize: 13,
          }}>
            {peerEmoji} 超过了 <b>{peerPercentile}%</b> 的同龄小朋友!
          </div>

          <div style={{ fontSize: 16, marginTop: 10, opacity: 0.95, letterSpacing: 2 }}>
            {todayLearned.length > 0 ? todayLearned.join('  ') : '今天还没开始学习哦'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleShare} style={{
            flex: 1, padding: 12, borderRadius: 14, border: 'none',
            background: 'var(--bbaby-green)', color: 'white',
            fontWeight: 700, fontSize: 16, cursor: 'pointer',
          }}>📤 分享到微信</button>
          <button onClick={onClose} style={{
            flex: 1, padding: 12, borderRadius: 14, border: '2px solid #EEE',
            background: 'white', fontWeight: 700, fontSize: 16, cursor: 'pointer',
          }}>关闭</button>
        </div>
      </motion.div>
    </motion.div>
  )
}
