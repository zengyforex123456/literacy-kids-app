import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '../stores/userStore'

const REWARDS = ['🌟','🦋','🌸','🐰','🍎','⭐','🦊','🎵','🎁','💎']

export function DailyBox() {
  const { checkStreak, addCoins, streak, lastPlayDate } = useUserStore()
  const [show, setShow] = useState(false)
  const [reward, setReward] = useState<string | null>(null)
  const [opened, setOpened] = useState(false)

  const today = new Date().toISOString().slice(0, 10)

  // Show on first open today
  if (!show && !opened && lastPlayDate !== today) {
    setTimeout(() => setShow(true), 800)
  }

  const handleOpen = () => {
    checkStreak()
    const r = REWARDS[Math.floor(Math.random() * REWARDS.length)]
    setReward(r)
    setOpened(true)
    addCoins(streak >= 7 ? 5 : 1)
    setTimeout(() => setShow(false), 2500)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 350,
          }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            style={{ textAlign: 'center' }}
          >
            {!reward ? (
              <div onClick={handleOpen} style={{ cursor: 'pointer' }}>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{ fontSize: 80 }}
                >
                  🎁
                </motion.div>
                <div style={{
                  color: 'white', fontFamily: 'var(--font-heading)',
                  fontSize: 22, marginTop: 12,
                }}>
                  点击打开今日宝箱!
                </div>
                {streak >= 7 && (
                  <div style={{ color: '#FFE66D', fontSize: 14, marginTop: 4 }}>
                    🔥 连续{streak}天! 额外奖励!
                  </div>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                <div style={{ fontSize: 80 }}>{reward}</div>
                <div style={{
                  color: 'white', fontFamily: 'var(--font-heading)',
                  fontSize: 24, marginTop: 8,
                }}>
                  {streak >= 7 ? '太棒了! 稀有贴纸!' : '获得了新贴纸!'}
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
