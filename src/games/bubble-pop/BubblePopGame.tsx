import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useVoice } from '../../shared/hooks/useVoice'
import { useSound } from '../../shared/hooks/useSound'
import { useGameStore } from '../../shared/stores/gameStore'
import { useUserStore } from '../../shared/stores/userStore'
import { Confetti } from '../../shared/components/Confetti'
import { useGameProgressStore } from '../../shared/stores/gameProgressStore'

const WORDS = [
  { chinese:'苹果',english:'apple',emoji:'🍎',color:'#FF9FF3' },
  { chinese:'香蕉',english:'banana',emoji:'🍌',color:'#FFD93D' },
  { chinese:'猫',english:'cat',emoji:'🐱',color:'#6BCB77' },
  { chinese:'狗',english:'dog',emoji:'🐶',color:'#4ECDC4' },
  { chinese:'大象',english:'elephant',emoji:'🐘',color:'#A66CFF' },
  { chinese:'鸟',english:'bird',emoji:'🐦',color:'#FF9F43' },
  { chinese:'鱼',english:'fish',emoji:'🐟',color:'#4ECDC4' },
  { chinese:'花',english:'flower',emoji:'🌸',color:'#FF9FF3' },
]

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

export function BubblePopGame() {
  const navigate = useNavigate()
  const { speak } = useVoice()
  const { play } = useSound()
  const { score, startGame, endGame, answerQuestion } = useGameStore()
  const addCoins = useUserStore(s => s.addCoins)
  const [target, setTarget] = useState(WORDS[0])
  const [bubbles, setBubbles] = useState<typeof WORDS>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [feedback, setFeedback] = useState<'correct'|'wrong'|null>(null)
  const [round, setRound] = useState(0)
  const [popped, setPopped] = useState<Set<string>>(new Set())

  const nextRound = useCallback(() => {
    const next = WORDS[(round + 1) % WORDS.length]
    setTarget(next)
    const others = WORDS.filter(w => w.chinese !== next.chinese)
    const distractors = shuffle(others).slice(0, 5)
    setBubbles(shuffle([next, ...distractors]))
    setRound(r => r + 1)
    setPopped(new Set())
    setTimeout(() => speak('找到' + next.chinese, 'zh-CN'), 300)
  }, [round])

  useEffect(() => { startGame('bubble-pop'); nextRound(); return () => endGame() }, [])

  const handlePop = (word: typeof WORDS[0]) => {
    if (popped.has(word.chinese)) return
    setPopped(new Set([...popped, word.chinese]))
    if (word.chinese === target.chinese) {
      play('correct'); answerQuestion(true); addCoins(1)
        useGameProgressStore.getState().addLearnedChars([word.chinese])
        useGameProgressStore.getState().addLearnedChars([word.chinese])
      setFeedback('correct'); setShowConfetti(true)
      speak('太棒了！' + word.chinese)
      setTimeout(() => { setFeedback(null); nextRound() }, 1200)
    } else {
      play('wrong'); answerQuestion(false)
      setFeedback('wrong')
      speak('这是' + word.chinese + '，再找找' + target.chinese)
      setTimeout(() => setFeedback(null), 800)
    }
  }

  if (round > WORDS.length) {
    return (
      <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',gap:20,padding:40,textAlign:'center' }}>
        <div style={{ fontSize:72 }}>🫧</div>
        <h1 style={{ fontFamily:'var(--font-heading)',fontSize:32,color:'var(--bbaby-blue)' }}>游戏结束!</h1>
        <p style={{ fontSize:18 }}>得⭐: {score}/{round - 1}</p>
        <button onClick={() => navigate('/')} style={{
          padding:'16px 48px',fontSize:20,fontWeight:700,border:'none',
          borderRadius:20,background:'var(--bbaby-red)',color:'white',cursor:'pointer',
        }}>回到主页</button>
      </div>
    )
  }

  return (
    <div style={{ minHeight:'100vh' }}>
      <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px' }}>
        <button onClick={() => navigate('/')} style={{ fontSize:24,border:'none',background:'none',cursor:'pointer' }}>←</button>
        <span style={{ fontFamily:'var(--font-heading)',fontSize:20,color:'var(--bbaby-blue)' }}>🫧 泡泡大战</span>
        <span style={{ fontWeight:700,fontSize:18,background:'white',padding:'6px 14px',borderRadius:16,boxShadow:'var(--shadow-sm)' }}>⭐ {score}</span>
      </div>

      <div style={{
        margin:'0 16px',height:420,borderRadius:24,
        background:'linear-gradient(180deg, #E3F2FD, #BBDEFB, #90CAF9)',
        position:'relative',overflow:'hidden',
      }}>
        <AnimatePresence>
          {bubbles.map((b, i) => (
            !popped.has(b.chinese) && (
              <motion.div key={b.chinese + '-' + i}
                initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0, opacity:0 }}
                onClick={() => handlePop(b)}
                style={{
                  position:'absolute',
                  width:80 + Math.random() * 20,
                  height:80 + Math.random() * 20,
                  borderRadius:'50%',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  cursor:'pointer',fontWeight:700,fontSize:15,color:'var(--bbaby-text)',
                  background:'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), ' + b.color + ')',
                  boxShadow:'inset -3px -3px 8px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.1)',
                  top: (10 + (i % 3) * 32) + '%',
                  left: (5 + (i % 2) * 28 + ((i * 11) % 18)) + '%',
                  animation:'bob 3s ' + (i * 0.3) + 's ease-in-out infinite',
                }}
              >
                {b.emoji}<br/>{b.chinese}
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      <div style={{
        textAlign:'center',padding:16,fontSize:18,fontWeight:600,
        background:'rgba(255,255,255,0.95)',borderRadius:20,
        margin:'12px 16px',boxShadow:'var(--shadow-sm)',
        color: feedback === 'correct' ? 'var(--bbaby-green)' :
               feedback === 'wrong' ? 'var(--bbaby-red)' : 'var(--bbaby-text)',
      }}>
        🔊 请找到: <strong>{target.emoji} {target.chinese}</strong>
        {feedback === 'correct' && ' ✅'}
        {feedback === 'wrong' && ' ❌ 再试试!'}
      </div>
    </div>
  )
}
