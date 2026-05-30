import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVoice } from '../hooks/useVoice'

const STORIES = [
  {
    emoji: '🐰',
    title: '帮小兔子找胡萝卜!',
    subtitle: '森林里藏了好多字卡，找到它们就能帮小兔子获得胡萝卜哦！',
    target: '/game/treasure-hunt',
  },
  {
    emoji: '🫧',
    title: '泡泡里藏着什么字?',
    subtitle: '听一听，戳破正确的泡泡，看看里面是什么字！',
    target: '/game/bubble-pop',
  },
  {
    emoji: '🎯',
    title: '把一样的卡片连起来!',
    subtitle: '找到相同的图案和汉字，配成一对！',
    target: '/game/matching',
  },
]

interface Props {
  show: boolean
  gameIndex: number
  onStart: () => void
}

export function StoryIntro({ show, gameIndex, onStart }: Props) {
  const { speak } = useVoice()
  const story = STORIES[gameIndex] || STORIES[0]

  useEffect(() => {
    if (show) {
      setTimeout(() => speak(story.title + story.subtitle), 500)
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 300, padding: 24,
          }}
        >
          <motion.div
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 12 }}
            style={{
              background: 'white', borderRadius: 28, padding: 32,
              maxWidth: 380, width: '100%', textAlign: 'center',
            }}
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ fontSize: 72 }}
            >
              {story.emoji}
            </motion.div>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 24,
              color: 'var(--bbaby-red)', marginTop: 12, marginBottom: 8,
            }}>
              {story.title}
            </h2>
            <p style={{ fontSize: 15, color: '#666', marginBottom: 24, lineHeight: 1.6 }}>
              {story.subtitle}
            </p>
            <button
              onClick={onStart}
              style={{
                padding: '16px 48px', borderRadius: 20, border: 'none',
                background: 'var(--bbaby-red)', color: 'white',
                fontWeight: 700, fontSize: 18, cursor: 'pointer',
              }}
            >
              开始冒险! 🚀
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
