import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Pet states driven by learning activity
type PetMood = 'sleeping' | 'hungry' | 'happy' | 'excited' | 'evolving'
type PetElement = 'fire' | 'water' | 'wood' | 'neutral'

interface PetState {
  name: string
  mood: PetMood
  element: PetElement
  hunger: number       // 0-10, 0=starving, 10=full
  evolved: boolean
  learnedToday: number
  dailyGoal: number
}

const PET_SPRITES: Record<PetMood, string> = {
  sleeping: '💤',
  hungry: '😋',
  happy: '😊',
  excited: '🥳',
  evolving: '✨',
}

const ELEMENT_EMOJI: Record<PetElement, string> = {
  fire: '🔥',
  water: '💧',
  wood: '🌿',
  neutral: '⭐',
}

export function SimplePet() {
  const [pet, setPet] = useState<PetState>({
    name: '小灵',
    mood: 'happy',
    element: 'neutral',
    hunger: 6,
    evolved: false,
    learnedToday: 0,
    dailyGoal: 5,
  })
  const [showBubble, setShowBubble] = useState(true)

  // Pet gets hungry if no learning for a while
  useEffect(() => {
    const timer = setInterval(() => {
      setPet(p => ({
        ...p,
        hunger: Math.max(0, p.hunger - 1),
        mood: p.hunger <= 2 ? 'hungry' : p.hunger <= 4 ? 'hungry' : p.mood,
      }))
    }, 60000) // Check every minute (in real app, based on actual time)
    return () => clearInterval(timer)
  }, [])

  // Pet sleeps at night (after 8pm)
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 20 || hour < 7) {
      setPet(p => ({ ...p, mood: 'sleeping' }))
    }
  }, [])

  const feed = () => {
    setPet(p => {
      const newHunger = Math.min(10, p.hunger + 2)
      const newLearned = p.learnedToday + 1
      const newMood: PetMood = newLearned >= p.dailyGoal ? 'excited' : 'happy'
      return { ...p, hunger: newHunger, learnedToday: newLearned, mood: newMood }
    })
  }

  const checkEvolution = () => {
    // 进化 when learned all chars in a radical family
    setPet(p => ({
      ...p,
      mood: 'evolving',
      evolved: true,
      element: p.element === 'neutral' ? 'wood' : p.element,
    }))
    setTimeout(() => setPet(p => ({ ...p, mood: 'excited' })), 3000)
  }

  const bubbleMessages: Record<PetMood, string> = {
    sleeping: '💤 晚安... 明天见!',
    hungry: '😋 好饿! 学个字喂我吧~',
    happy: '😊 太棒了! 继续加油!',
    excited: '🥳 太厉害了! 今日目标达成!',
    evolving: '✨ 我要进化了!!',
  }

  return (
    <div style={{ position:'fixed',top:60,right:12,zIndex:200 }}>
      {/* Speech bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
            style={{
              background:'white',borderRadius:16,padding:'8px 14px',
              fontSize:13,fontWeight:600,color:'var(--bbaby-text)',
              boxShadow:'0 4px 16px rgba(0,0,0,0.1)',
              marginBottom:8,maxWidth:160,textAlign:'center',
            }}
            onClick={() => setShowBubble(false)}
          >
            {bubbleMessages[pet.mood]}
            <div style={{ width:0,height:0,borderLeft:'8px solid transparent',borderRight:'8px solid transparent',borderTop:'8px solid white',position:'absolute',bottom:-6,right:20 }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pet avatar */}
      <motion.div
        animate={pet.mood === 'excited' ? { scale:[1,1.2,1],rotate:[0,-5,5,0] } :
                 pet.mood === 'hungry' ? { y:[0,-3,0] } :
                 pet.mood === 'sleeping' ? { opacity:0.6 } : {}}
        transition={{ repeat:pet.mood==='hungry'?Infinity:0,duration:1.5 }}
        onClick={() => setShowBubble(!showBubble)}
        style={{
          width:56,height:56,borderRadius:'50%',
          background: pet.element === 'fire' ? '#FF6B6B' :
                     pet.element === 'water' ? '#4ECDC4' :
                     pet.element === 'wood' ? '#6BCB77' : '#FFD93D',
          display:'flex',alignItems:'center',justifyContent:'center',
          cursor:'pointer',boxShadow:'0 4px 16px rgba(0,0,0,0.15)',
          fontSize:24,
        }}
      >
        {ELEMENT_EMOJI[pet.element]}
      </motion.div>

      {/* Hunger bar */}
      <div style={{ marginTop:4,background:'white',borderRadius:8,padding:'4px 8px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ display:'flex',justifyContent:'space-between',fontSize:10,fontWeight:600,marginBottom:2 }}>
          <span>{PET_SPRITES[pet.mood]}</span>
          <span>{pet.learnedToday}/{pet.dailyGoal}</span>
        </div>
        <div style={{ height:4,background:'#EEE',borderRadius:2,overflow:'hidden',width:80 }}>
          <div style={{ height:'100%',width:Math.min((pet.learnedToday/pet.dailyGoal)*100,100)+'%',background:pet.learnedToday>=pet.dailyGoal?'var(--bbaby-green)':'var(--bbaby-yellow)',borderRadius:2,transition:'width 0.5s' }} />
        </div>
      </div>

      {/* Hidden feed test buttons for demo */}
      <div style={{ marginTop:4,display:'flex',gap:4 }}>
        <button onClick={feed} style={{ fontSize:10,padding:'2px 6px',borderRadius:6,border:'1px solid #DDD',background:'white',cursor:'pointer' }}>喂食</button>
        <button onClick={checkEvolution} style={{ fontSize:10,padding:'2px 6px',borderRadius:6,border:'1px solid #DDD',background:'white',cursor:'pointer' }}>进化</button>
      </div>
    </div>
  )
}