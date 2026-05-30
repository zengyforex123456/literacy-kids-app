import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useVoice } from '../../shared/hooks/useVoice'
import { useSound } from '../../shared/hooks/useSound'
import { useUserStore } from '../../shared/stores/userStore'
import { Confetti } from '../../shared/components/Confetti'

interface QuizWord { chinese: string; pinyin: string; emoji: string }

interface Props { words: QuizWord[]; onComplete: (correct: number, total: number) => void }

export function QuizGame({ words, onComplete }: Props) {
  const [idx, setIdx] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const { speak } = useVoice()
  const { play } = useSound()
  const addCoins = useUserStore(s => s.addCoins)
  const [showConfetti, setShowConfetti] = useState(false)

  const current = words[idx]

  useEffect(() => {
    if (!current || words.length < 4) return
    const wrongs = words.filter(w => w.chinese !== current.chinese)
    const shuffled = [...wrongs].sort(() => Math.random() - 0.5).slice(0, 3)
    const opts = [...shuffled.map(w => w.chinese), current.chinese].sort(() => Math.random() - 0.5)
    setOptions(opts)
    speak(current.chinese + ', which character is it?')
  }, [idx, current])

  const handleSelect = (opt: string) => {
    if (selected) return
    setSelected(opt)
    const isCorrect = opt === current.chinese
    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) {
      play('correct')
      setCorrect(c => c + 1)
      addCoins(1)
      setShowConfetti(true)
    } else {
      play('wrong')
    }
    setTimeout(() => {
      if (idx < words.length - 1) {
        setIdx(i => i + 1)
        setSelected(null)
        setFeedback(null)
      } else {
        onComplete(correct + (isCorrect ? 1 : 0), words.length)
      }
    }, 1200)
  }

  if (!current) return null

  return (
    <div style={{ minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,gap:20 }}>
      <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
      <div style={{ fontSize:14,color:'#999' }}>Quiz {idx + 1}/{words.length}</div>
      <div style={{ fontFamily:'var(--font-heading)',fontSize:20,color:'var(--bbaby-text)' }}>
        Which is <span style={{ color:'var(--bbaby-red)',fontSize:28 }}>{current.chinese}</span> ?
      </div>
      <div style={{ fontSize:40 }}>{current.emoji || 'Hanzi'}</div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,width:'100%',maxWidth:320 }}>
        {options.map(opt => {
          const isSelected = selected === opt
          const bg = isSelected ? (opt === current.chinese ? 'var(--bbaby-green)' : 'var(--bbaby-red)') : 'white'
          return (
            <motion.button key={opt}
              whileTap={{ scale:0.9 }}
              onClick={() => handleSelect(opt)}
              disabled={!!selected}
              style={{
                padding:'20px 16px',borderRadius:16,border:'2px solid #EEE',
                background:bg,color:isSelected?'white':'var(--bbaby-text)',
                fontWeight:700,fontSize:28,cursor:selected?'default':'pointer',
                opacity:selected && !isSelected ? 0.5 : 1,
              }}
            >{opt}</motion.button>
          )
        })}
      </div>
      {feedback && (
        <div style={{ fontSize:16,fontWeight:600,color:feedback==='correct'?'var(--bbaby-green)':'var(--bbaby-red)' }}>
          {feedback === 'correct' ? 'Correct!' : 'Try again'}
        </div>
      )}
    </div>
  )
}
