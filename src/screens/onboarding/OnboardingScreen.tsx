import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const SLIDES = [
  {
    emoji: '👋',
    title: '欢迎来到识字乐园!',
    desc: '和可爱的小动物们一起学汉字和英语吧！',
    color: '#FF6B6B',
  },
  {
    emoji: '👆',
    title: '点一点，找一找',
    desc: '在森林里找卡片，戳泡泡找答案，配对连连看！',
    color: '#4ECDC4',
  },
  {
    emoji: '🌟',
    title: '收集贴纸和勋章',
    desc: '完成任务获得贴纸，收集全部贴纸成为识字大师！',
    color: '#FFE66D',
  },
]

export function OnboardingScreen() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  const next = () => {
    if (step < SLIDES.length - 1) setStep(s => s + 1)
    else navigate('/')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 40,
      background: SLIDES[step].color, transition: 'background 0.5s',
      textAlign: 'center', gap: 24, color: 'white',
    }}>
      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}
        >
          <div style={{ fontSize: 96 }}>{SLIDES[step].emoji}</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32 }}>{SLIDES[step].title}</h1>
          <p style={{ fontSize: 18, opacity: 0.9, maxWidth: 320 }}>{SLIDES[step].desc}</p>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', gap: 8 }}>
        {SLIDES.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 24 : 8, height: 8, borderRadius: 4,
            background: 'white', opacity: i === step ? 1 : 0.5,
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button onClick={() => navigate('/')} style={{
          padding: '12px 24px', borderRadius: 20, border: '2px solid rgba(255,255,255,0.5)',
          background: 'transparent', color: 'white', fontWeight: 700, fontSize: 16, cursor: 'pointer',
        }}>跳过</button>
        <button onClick={next} style={{
          padding: '12px 32px', borderRadius: 20, border: 'none',
          background: 'white', color: SLIDES[step].color, fontWeight: 700, fontSize: 16, cursor: 'pointer',
        }}>
          {step < SLIDES.length - 1 ? '下一步 →' : '开始学习!'}
        </button>
      </div>
    </div>
  )
}
