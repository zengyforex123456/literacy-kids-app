import { useState } from 'react'
import { motion } from 'framer-motion'
import { QuizGame } from '../games/quiz/QuizGame'

interface Props { learnedChars: string[]; onClose: () => void }
interface QuizWord { chinese: string; pinyin: string; emoji: string }

export function QuizLauncher({ learnedChars, onClose }: Props) {
  const [started, setStarted] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  if (started && learnedChars.length >= 4) {
    const words: QuizWord[] = learnedChars.slice(-20).map(c => ({
      chinese: c, pinyin: '', emoji: 'Char'
    }))
    return (
      <QuizGame words={words} onComplete={(correct: number, total: number) => {
        setResult(correct + '/' + total + ' correct!')
        setTimeout(() => onClose(), 2000)
      }} />
    )
  }

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }}
      style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:300,padding:16 }}
      onClick={onClose}
    >
      <motion.div initial={{ scale:0.8 }} animate={{ scale:1 }}
        onClick={e => e.stopPropagation()}
        style={{ background:'white',borderRadius:24,padding:32,maxWidth:360,width:'100%',textAlign:'center' }}
      >
        {result ? (
          <div>
            <div style={{ fontSize:56 }}>Score</div>
            <h2 style={{ fontFamily:'var(--font-heading)',fontSize:24,marginTop:8 }}>{result}</h2>
            <button onClick={onClose} style={{ marginTop:16,padding:'12px 32px',borderRadius:14,border:'none',background:'var(--bbaby-green)',color:'white',fontWeight:700,cursor:'pointer' }}>
              Done
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize:56 }}>Quiz</div>
            <h2 style={{ fontFamily:'var(--font-heading)',fontSize:22,marginTop:8,marginBottom:4 }}>
              Ready for a Quiz?
            </h2>
            <p style={{ fontSize:14,color:'#666',marginBottom:20 }}>
              Test your knowledge on recent {Math.min(learnedChars.length, 20)} characters
            </p>
            <div style={{ display:'flex',gap:8 }}>
              <button onClick={() => setStarted(true)} style={{
                flex:1,padding:'14px 24px',borderRadius:16,border:'none',
                background:'var(--bbaby-red)',color:'white',fontWeight:700,fontSize:16,cursor:'pointer',
              }}>Start Quiz</button>
              <button onClick={onClose} style={{
                flex:1,padding:'14px 24px',borderRadius:16,border:'2px solid #EEE',
                background:'white',fontWeight:700,fontSize:16,cursor:'pointer',
              }}>Later</button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
