import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useVoice } from '../../shared/hooks/useVoice'
import { useSound } from '../../shared/hooks/useSound'
import { useGameStore } from '../../shared/stores/gameStore'
import { useUserStore } from '../../shared/stores/userStore'
import { Confetti } from '../../shared/components/Confetti'
import { useGameProgressStore } from '../../shared/stores/gameProgressStore'

const ALL_CHARS = '山水火木人口手日月田力子女门车马虫鱼鸟王贝竹草土石金言目心'.split('')
const COLORS = ['#FF9FF3','#FFD93D','#6BCB77','#4ECDC4','#A66CFF','#FF9F43','#FF6B6B','#42A5F5']
function getRandomWords(n: number) {
  const s = [...ALL_CHARS].sort(() => Math.random() - 0.5)
  return s.slice(0, n).map(c => ({ chinese:c, english:c, emoji:'字', color:COLORS[Math.floor(Math.random()*COLORS.length)] }))
}
const WORDS = getRandomWords(8)

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
        }}>🔄 再玩一次(新字)</button><button onClick={() => navigate('/game/matching')} style={{padding:'12px 32px',borderRadius:18,border:'none',background:'var(--bbaby-purple)',color:'white',fontWeight:700,cursor:'pointer',marginLeft:8}}>🎯 配对闯关</button><button onClick={() => navigate('/')} style={{background:'none',border:'none',color:'#999',cursor:'pointer',marginTop:8,display:'block',width:'100%'}}>返回主页</button>
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
