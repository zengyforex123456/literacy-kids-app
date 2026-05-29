import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useVoice } from '../../shared/hooks/useVoice'
import { useSound } from '../../shared/hooks/useSound'
import { useGameStore } from '../../shared/stores/gameStore'
import { useUserStore } from '../../shared/stores/userStore'
import { Confetti } from '../../shared/components/Confetti'

const ITEMS = [
  { emoji: '🍎', word: '苹果', en: 'apple', color: '#FFCCBC' },
  { emoji: '🐱', word: '猫', en: 'cat', color: '#C5E1A5' },
  { emoji: '🐶', word: '狗', en: 'dog', color: '#B3E5FC' },
  { emoji: '🐰', word: '兔子', en: 'rabbit', color: '#F8BBD0' },
  { emoji: '🦁', word: '狮子', en: 'lion', color: '#FFE082' },
]

export function TreasureHuntGame() {
  const navigate = useNavigate()
  const { speak } = useVoice()
  const { play } = useSound()
  const { score, questionsAnswered, startGame, endGame, answerQuestion } = useGameStore()
  const addCoins = useUserStore(s => s.addCoins)
  const [found, setFound] = useState<Set<number>>(new Set())
  const [showConfetti, setShowConfetti] = useState(false)
  const [revealed, setRevealed] = useState<number | null>(null)

  useEffect(() => {
    startGame('treasure-hunt')
    speak('在森林里找找藏起来的卡片吧！')
    return () => endGame()
  }, [])

  const handleFind = (index: number) => {
    if (found.has(index)) return
    setRevealed(index)
    play('correct')
    speak(`${ITEMS[index].word}, ${ITEMS[index].en}`, 'zh-CN')
    setTimeout(() => speak(ITEMS[index].en, 'en-US'), 800)
    setFound(new Set([...found, index]))
    answerQuestion(true)
    addCoins(1)
    setShowConfetti(true)
  }

  if (questionsAnswered === ITEMS.length) {
    return (
      <div style={{ padding: 60, textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <div style={{ fontSize: 72 }}>🎉</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32 }}>全部找到!</h1>
        <p style={{ fontSize: 18 }}>得分: {score}/{ITEMS.length}</p>
        <button onClick={() => navigate('/')} style={{
          padding: '16px 48px', fontSize: 20, fontWeight: 700, border: 'none',
          borderRadius: 20, background: 'var(--primary)', color: 'white', cursor: 'pointer',
        }}>回到主页</button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
        <button onClick={() => navigate('/')} style={{ fontSize: 24, border: 'none', background: 'none', cursor: 'pointer' }}>←</button>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20 }}>🏕️ 森林寻宝</span>
        <span style={{ fontWeight: 700, fontSize: 18, background: 'white', padding: '6px 14px', borderRadius: 16 }}>⭐ {score}</span>
      </div>

      {/* Scene */}
      <div style={{
        margin: '0 16px', height: 420, borderRadius: 'var(--radius)',
        background: 'linear-gradient(180deg, #C8E6C9 0%, #A5D6A7 40%, #81C784 70%, #66BB6A 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Trees */}
        <div style={{ position: 'absolute', top: '5%', left: '8%', fontSize: 60 }}>🌳</div>
        <div style={{ position: 'absolute', top: '3%', right: '10%', fontSize: 56 }}>🌲</div>
        <div style={{ position: 'absolute', bottom: '15%', left: '5%', fontSize: 50 }}>🌴</div>
        <div style={{ position: 'absolute', bottom: '10%', right: '15%', fontSize: 44 }}>🪨</div>
        <div style={{ position: 'absolute', top: '55%', right: '8%', fontSize: 36 }}>🌻</div>

        {/* Hidden cards */}
        <AnimatePresence>
          {ITEMS.map((item, i) => (
            !found.has(i) && (
              <motion.div key={i}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                onClick={() => handleFind(i)}
                style={{
                  position: 'absolute',
                  top: `${15 + (i % 3) * 30}%`,
                  left: `${20 + (i % 2) * 35}%`,
                  background: item.color,
                  borderRadius: 16,
                  padding: '14px 20px',
                  fontSize: 22,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  animation: i === revealed && found.has(i) ? 'none' : 'float 2s ease-in-out infinite',
                }}
              >
                {revealed === i ? `${item.emoji} ${item.word}` : '?'}
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      <div style={{ textAlign: 'center', padding: 16, fontSize: 18, fontWeight: 600, background: 'rgba(255,255,255,0.9)', borderRadius: 'var(--radius)', margin: '12px 16px' }}>
        👆 在森林里找找藏起来的卡片吧！({found.size}/{ITEMS.length})
      </div>
    </div>
  )
}
