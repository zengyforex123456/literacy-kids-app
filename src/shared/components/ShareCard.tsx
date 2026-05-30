import { motion } from 'framer-motion'

interface Props {
  show: boolean
  todayLearned: string[]
  streak: number
  totalLearned: number
  onClose: () => void
}

export function ShareCard({ show, todayLearned, streak, totalLearned, onClose }: Props) {
  if (!show) return null

  const handleShare = async () => {
    const text = `我家宝贝今天学了${todayLearned.length}个新字: ${todayLearned.join('、')}！已连续打卡${streak}天，累计学会${totalLearned}个汉字！📚✨`
    if (navigator.share) {
      await navigator.share({ title: '识字学习成果', text })
    } else {
      await navigator.clipboard.writeText(text)
      alert('已复制到剪贴板，可以分享到微信啦!')
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
          <div style={{ fontSize: 60 }}>🌟</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, marginTop: 8 }}>
            今日学习成就
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 12 }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{todayLearned.length}</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>今日新学</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>🔥{streak}</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>连续打卡</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{totalLearned}</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>已学汉字</div>
            </div>
          </div>
          <div style={{ fontSize: 14, marginTop: 10, opacity: 0.9 }}>
            {todayLearned.join('  ')}
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
