import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useVoice } from '../../shared/hooks/useVoice'
import { useSound } from '../../shared/hooks/useSound'
import { useGameProgressStore } from '../../shared/stores/gameProgressStore'
import { useGameStore } from '../../shared/stores/gameStore'
import { useUserStore } from '../../shared/stores/userStore'
import { Confetti } from '../../shared/components/Confetti'

const PAIRS = [
  { emoji: '🍎', text: '苹果', pair: 0 },
  { emoji: '🐱', text: '猫', pair: 1 },
  { emoji: '🐶', text: '狗', pair: 2 },
  { emoji: '🐰', text: '兔子', pair: 3 },
  { emoji: '🦁', text: '狮子', pair: 4 },
  { emoji: '🐦', text: '鸟', pair: 5 },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function MatchingGame() {
  const navigate = useNavigate()
  const { speak } = useVoice()
  const { play } = useSound()
  const { score, startGame, endGame, answerQuestion } = useGameStore()
  const addCoins = useUserStore(s => s.addCoins)
  const cards = shuffle([
    ...PAIRS.map((p, i) => ({ id: `emoji-${i}`, content: p.emoji, pair: p.pair, type: 'emoji' as const })),
    ...PAIRS.map((p, i) => ({ id: `text-${i}`, content: p.text, pair: p.pair, type: 'text' as const })),
  ])
  const [selected, setSelected] = useState<string | null>(null)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    startGame('matching')
    speak('把一样的卡片连起来吧！')
    return () => endGame()
  }, [])

  const handleSelect = (card: typeof cards[0]) => {
    if (matched.has(card.id)) return
    if (!selected) { setSelected(card.id); speak(card.type === 'emoji' ? '' : card.content); return }

    const prev = cards.find(c => c.id === selected)
    if (!prev) { setSelected(card.id); return }

    if (prev.pair === card.pair && prev.id !== card.id) {
      setMatched(new Set([...matched, prev.id, card.id]))
      play('correct')
      answerQuestion(true)
      addCoins(1)
      speak(`对啦！${PAIRS[card.pair].text}, ${PAIRS[card.pair].emoji}`)
      setShowConfetti(true)
    } else {
      play('wrong')
      answerQuestion(false)
      setTimeout(() => {}, 500)
    }
    setSelected(null)
  }

  const allMatched = matched.size === cards.length

  return (
    <div style={{ minHeight: '100vh' }}>
      <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
        <button onClick={() => navigate('/')} style={{ fontSize: 24, border: 'none', background: 'none', cursor: 'pointer' }}>←</button>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20 }}>🎯 配对大闯关</span>
        <span style={{ fontWeight: 700, fontSize: 18, background: 'white', padding: '6px 14px', borderRadius: 16 }}>⭐ {score}</span>
      </div>

      {allMatched ? (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 72 }}>🏆</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32 }}>全部配对!</h1>
          <button onClick={() => navigate('/')} style={{
            padding: '16px 48px', fontSize: 20, fontWeight: 700, border: 'none',
            borderRadius: 20, background: 'var(--primary)', color: 'white', cursor: 'pointer', marginTop: 16,
          }}>回到主页</button>
        </div>
      ) : (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
          padding: '0 16px', maxWidth: 480, margin: '0 auto',
        }}>
          {cards.map(card => (
            <motion.div key={card.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelect(card)}
              animate={matched.has(card.id) ? { scale: [1, 1.1, 1], opacity: 0.5 } :
                selected === card.id ? { scale: 1.08, boxShadow: '0 0 20px rgba(255,213,79,0.5)' } : {}}
              style={{
                aspectRatio: '1', borderRadius: 'var(--radius-sm)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: matched.has(card.id) ? 'default' : 'pointer',
                background: matched.has(card.id) ? '#A5D6A7' :
                  selected === card.id ? 'var(--accent)' : 'white',
                boxShadow: 'var(--shadow)', fontSize: card.type === 'emoji' ? 42 : 20,
                fontWeight: 700, pointerEvents: matched.has(card.id) ? 'none' : 'auto',
              }}
            >
              {card.content}
            </motion.div>
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', padding: 16, fontSize: 16, color: '#999' }}>
        把一样的卡片连起来 ({matched.size/2}/{PAIRS.length})
      </div>
    </div>
  )
}
