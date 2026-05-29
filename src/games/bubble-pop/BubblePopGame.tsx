import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useVoice } from '../../shared/hooks/useVoice'
import { useSound } from '../../shared/hooks/useSound'
import { useGameStore } from '../../shared/stores/gameStore'
import { useUserStore } from '../../shared/stores/userStore'
import { Confetti } from '../../shared/components/Confetti'

const WORDS = [
  { chinese: '苹果', english: 'apple', emoji: '🍎', color: '#FFCCBC' },
  { chinese: '香蕉', english: 'banana', emoji: '🍌', color: '#FFE082' },
  { chinese: '猫', english: 'cat', emoji: '🐱', color: '#C5E1A5' },
  { chinese: '狗', english: 'dog', emoji: '🐶', color: '#B3E5FC' },
  { chinese: '大象', english: 'elephant', emoji: '🐘', color: '#F8BBD0' },
  { chinese: '鸟', english: 'bird', emoji: '🐦', color: '#D1C4E9' },
  { chinese: '鱼', english: 'fish', emoji: '🐟', color: '#B2EBF2' },
  { chinese: '花', english: 'flower', emoji: '🌸', color: '#F8BBD0' },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function BubblePopGame() {
  const navigate = useNavigate()
  const { speak } = useVoice()
  const { play } = useSound()
  const { score, startGame, endGame, answerQuestion } = useGameStore()
  const addCoins = useUserStore(s => s.addCoins)
  const [target, setTarget] = useState(WORDS[0])
  const [bubbles, setBubbles] = useState<typeof WORDS>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [round, setRound] = useState(0)

  const nextRound = useCallback(() => {
    const next = WORDS[(round + 1) % WORDS.length]
    setTarget(next)
    const others = WORDS.filter(w => w.chinese !== next.chinese)
    const distractors = shuffle(others).slice(0, 5)
    setBubbles(shuffle([next, ...distractors]))
    setRound(r => r + 1)
    setTimeout(() => speak(`找到${next.chinese}`, 'zh-CN'), 300)
    setTimeout(() => speak(next.english, 'en-US'), 1000)
  }, [round])

  useEffect(() => {
    startGame('bubble-pop')
    nextRound()
    return () => endGame()
  }, [])

  const handlePop = (word: typeof WORDS[0]) => {
    if (word.chinese === target.chinese) {
      play('correct')
      answerQuestion(true)
      addCoins(1)
      setFeedback('correct')
      setShowConfetti(true)
      speak(`太棒了！${word.chinese}, ${word.english}`, 'zh-CN')
      setTimeout(() => { setFeedback(null); nextRound() }, 1500)
    } else {
      play('wrong')
      answerQuestion(false)
      setFeedback('wrong')
      speak(`这是${word.chinese}，再试一次找${target.chinese}`, 'zh-CN')
      setTimeout(() => setFeedback(null), 1000)
    }
  }

  if (round > WORDS.length) {
    return (
      <div style={{ padding: 60, textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <div style={{ fontSize: 72 }}>🫧</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32 }}>游戏结束!</h1>
        <p style={{ fontSize: 18 }}>得分: {score}/{round - 1}</p>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
        <button onClick={() => navigate('/')} style={{ fontSize: 24, border: 'none', background: 'none', cursor: 'pointer' }}>←</button>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20 }}>🫧 泡泡大作战</span>
        <span style={{ fontWeight: 700, fontSize: 18, background: 'white', padding: '6px 14px', borderRadius: 16 }}>⭐ {score}</span>
      </div>

      <div style={{
        margin: '0 16px', height: 420, borderRadius: 'var(--radius)',
        background: 'linear-gradient(180deg, #E3F2FD, #BBDEFB, #90CAF9)',
        position: 'relative', overflow: 'hidden',
      }}>
        <AnimatePresence>
          {bubbles.map((b, i) => (
            <motion.div key={`${b.chinese}-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => handlePop(b)}
              style={{
                position: 'absolute',
                width: 80 + Math.random() * 30, height: 80 + Math.random() * 30,
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontWeight: 700, fontSize: 16, color: 'var(--text)',
                background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), ${b.color})`,
                boxShadow: 'inset -3px -3px 8px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.1)',
                top: `${10 + (i % 3) * 32}%`,
                left: `${5 + (i % 2) * 30 + ((i * 13) % 20)}%`,
                animation: `bob 3s ${i * 0.3}s ease-in-out infinite`,
              }}
            >
              {b.emoji}<br/>{b.chinese}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div style={{
        textAlign: 'center', padding: 16, fontSize: 20, fontWeight: 600,
        background: 'rgba(255,255,255,0.9)', borderRadius: 'var(--radius)',
        margin: '12px 16px',
        color: feedback === 'correct' ? 'var(--success)' : feedback === 'wrong' ? 'var(--danger)' : 'var(--text)',
      }}>
        🔊 请找到: <strong>{target.emoji} {target.chinese}</strong>
        {feedback === 'correct' && ' ✅'}
        {feedback === 'wrong' && ' ❌'}
      </div>
    </div>
  )
}
