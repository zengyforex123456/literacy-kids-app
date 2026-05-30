import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useVoice } from '../../shared/hooks/useVoice'
import { useSound } from '../../shared/hooks/useSound'
import { useGameStore } from '../../shared/stores/gameStore'
import { useUserStore } from '../../shared/stores/userStore'
import { Confetti } from '../../shared/components/Confetti'
import { getAllFamilies } from '../../shared/utils/radicalQuery'
import { COMPOUND_CHARS, EVOLUTION_CHARS, type CompoundChar, type EvolutionChar } from './data'

type View = 'map' | 'family' | 'compound' | 'evolution'

export function TreasureHuntGame() {
  const navigate = useNavigate()
  const { speak } = useVoice()
  const { play } = useSound()
  const addCoins = useUserStore(s => s.addCoins)
  const { score, startGame, endGame, answerQuestion } = useGameStore()

  const [view, setView] = useState<View>('map')
  const [familyIdx, setFamilyIdx] = useState(0)
  const [found, setFound] = useState<Set<string>>(new Set())
  const [showConfetti, setShowConfetti] = useState(false)
  const [revealed, setRevealed] = useState<string | null>(null)

  const allFamilies = getAllFamilies()
  const totalFound = found.size
  const unlocked = Math.min(Math.floor(totalFound / 3) + 3, allFamilies.length)

  useEffect(() => {
    startGame('treasure-hunt')
    speak('Welcome to the Character Forest!')
    return () => endGame()
  }, [])

  const handleFind = (char: string) => {
    if (found.has(char)) return
    setRevealed(char)
    play('correct')
    speak(char)
    answerQuestion(true)
    addCoins(1)
    setFound(new Set([...found, char]))
    setShowConfetti(true)
  }

  // === FOREST MAP ===
  if (view === 'map') {
    return (
      <div style={{ minHeight:'100vh',paddingBottom:20 }}>
        <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px' }}>
          <button onClick={() => navigate('/')} style={{ fontSize:24,border:'none',background:'none',cursor:'pointer' }}>Back</button>
          <span style={{ fontFamily:'var(--font-heading)',fontSize:20 }}>Forest</span>
          <span style={{ fontWeight:700,fontSize:18,background:'white',padding:'6px 14px',borderRadius:16 }}>Score {score}</span>
        </div>
        <div style={{ padding:'0 16px',marginBottom:12,textAlign:'center' }}>
          <div style={{ fontSize:14,color:'#666' }}>Found {totalFound} chars - {unlocked}/{allFamilies.length} families</div>
          <div style={{ height:8,background:'#E0E0E0',borderRadius:4,marginTop:6,overflow:'hidden' }}>
            <div style={{ height:'100%',width:Math.min((totalFound/28)*100,100)+'%',background:'var(--bbaby-green)',borderRadius:4,transition:'width 0.5s' }} />
          </div>
        </div>
        <div style={{ margin:'0 16px',height:340,borderRadius:24,background:'linear-gradient(180deg,#C8E6C9,#81C784)',position:'relative',overflow:'hidden' }}>
          {allFamilies.map((f, i) => {
            const x = 8 + (i % 3) * 30
            const y = 8 + Math.floor(i / 3) * 42
            const open = i < unlocked
            return (
              <motion.div key={f.displayChar || f.radical} whileHover={open ? { scale:1.1 } : {}}
                onClick={() => { if (open) { setFamilyIdx(i); setView('family'); speak(f.name) } }}
                style={{ position:'absolute',left:x+'%',top:y+'%',cursor:open?'pointer':'default',textAlign:'center',opacity:open?1:0.4,filter:open?'none':'grayscale(1)' }}
              >
                <div style={{ fontSize:36,background:'rgba(255,255,255,0.9)',borderRadius:16,width:52,height:52,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700 }}>{f.displayChar || f.radical}</div>
                <div style={{ background:'white',borderRadius:10,padding:'2px 8px',fontSize:11,fontWeight:700,marginTop:2 }}>{f.name}({f.count})</div>
                {!open && <div style={{ fontSize:16,marginTop:-44 }}>Lock</div>}
              </motion.div>
            )
          })}
          <motion.div whileHover={{ scale:1.05 }} onClick={() => setView('compound')}
            style={{ position:'absolute',bottom:'5%',right:'8%',background:'linear-gradient(135deg,#FFD700,#FFA000)',borderRadius:16,padding:'10px 14px',cursor:'pointer',textAlign:'center' }}
            animate={{ y:[0,-5,0] }} transition={{ repeat:Infinity,duration:2 }}>
            <div style={{ fontSize:24 }}>Magic</div><div style={{ fontWeight:700,fontSize:12,color:'white' }}>Compound</div>
          </motion.div>
          <motion.div whileHover={{ scale:1.05 }} onClick={() => setView('evolution')}
            style={{ position:'absolute',bottom:'5%',left:'8%',background:'linear-gradient(135deg,#E8D5B7,#C9A96E)',borderRadius:16,padding:'10px 14px',cursor:'pointer',textAlign:'center' }}>
            <div style={{ fontSize:24 }}>Scroll</div><div style={{ fontWeight:700,fontSize:12,color:'white' }}>Evolution</div>
          </motion.div>
        </div>
        <div style={{ textAlign:'center',padding:16,fontSize:15,color:'#666' }}>Tap trees - collect chars to unlock families</div>
      </div>
    )
  }

  // === FAMILY ZONE ===
  if (view === 'family') {
    const family = allFamilies[familyIdx]
    const complete = family.members.every(m => found.has(m))
    const count = family.members.filter(m => found.has(m)).length

    return (
      <div style={{ minHeight:'100vh',paddingBottom:20 }}>
        <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px' }}>
          <button onClick={() => setView('map')} style={{ fontSize:24,border:'none',background:'none',cursor:'pointer' }}>Back</button>
          <span style={{ fontFamily:'var(--font-heading)',fontSize:20 }}>{family.radical} {family.name}</span>
          <span style={{ fontWeight:700,fontSize:18,background:'white',padding:'6px 14px',borderRadius:16 }}>Score {score}</span>
        </div>
        <div style={{ padding:'0 16px',marginBottom:8,fontSize:15,fontWeight:600,textAlign:'center',color:'var(--bbaby-text)' }}>
          Radical: <span style={{ color:'var(--bbaby-red)',fontSize:22 }}>{family.radical}</span>
        </div>
        <div style={{ margin:'0 16px',minHeight:280,borderRadius:24,background:'linear-gradient(180deg,#E8F5E9,#C8E6C9)',padding:16 }}>
          <div style={{ textAlign:'center',marginBottom:8 }}>
            <span style={{ background:'white',borderRadius:16,padding:'6px 16px',fontSize:14,fontWeight:600 }}>
              {complete ? 'ALL FOUND!' : 'Found '+count+'/'+family.members.length}
            </span>
          </div>
          <div style={{ display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center' }}>
            <AnimatePresence>
              {family.members.map(char => (
                !found.has(char) && (
                  <motion.div key={char} initial={{ opacity:0,scale:0.5 }} animate={{ opacity:1,scale:1 }} exit={{ opacity:0,scale:1.5 }}
                    onClick={() => handleFind(char)}
                    style={{ width:56,height:76,borderRadius:16,background:'rgba(255,255,255,0.95)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:'0 4px 12px rgba(0,0,0,0.08)',fontSize:22,fontWeight:700 }}
                    whileHover={{ scale:1.1 }}>
                    {revealed === char ? char : '?'}
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
          {complete && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:'center',padding:16,marginTop:12,background:'rgba(255,255,255,0.9)',borderRadius:16 }}>
              <div style={{ fontSize:32 }}>Star</div>
              <div style={{ fontWeight:700,fontSize:16 }}>Family Complete! All share: {family.radical}</div>
              <button onClick={() => setView('map')} style={{ marginTop:10,padding:'10px 24px',borderRadius:14,border:'none',background:'var(--bbaby-red)',color:'white',fontWeight:700,cursor:'pointer' }}>Back to Forest</button>
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  // === COMPOUND CHARACTERS ===
  if (view === 'compound') {
    const handleCompound = (c: CompoundChar) => {
      if (found.has(c.result)) return
      speak(c.story); play('correct'); answerQuestion(true); addCoins(2)
      setFound(new Set([...found, c.result])); setShowConfetti(true)
    }
    return (
      <div style={{ minHeight:'100vh',paddingBottom:20 }}>
        <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px' }}>
          <button onClick={() => setView('map')} style={{ fontSize:24,border:'none',background:'none',cursor:'pointer' }}>Back</button>
          <span style={{ fontFamily:'var(--font-heading)',fontSize:20 }}>Compound</span>
          <span style={{ fontWeight:700,fontSize:18,background:'white',padding:'6px 14px',borderRadius:16 }}>Score {score}</span>
        </div>
        <div style={{ padding:'0 16px',marginBottom:8,fontSize:14,color:'#666',textAlign:'center' }}>Characters combine to form new meanings!</div>
        <div style={{ display:'flex',flexDirection:'column',gap:12,padding:'0 16px' }}>
          {COMPOUND_CHARS.map((c, i) => {
            const fnd = found.has(c.result)
            return (
              <motion.div key={i} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.1 }}
                onClick={() => handleCompound(c)}
                style={{ background:fnd?'#F1F8E9':'white',borderRadius:20,padding:20,boxShadow:fnd?'none':'var(--shadow-sm)',cursor:fnd?'default':'pointer',border:fnd?'2px solid var(--bbaby-green)':'2px solid transparent' }}>
                <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:10,flexWrap:'wrap' }}>
                  {c.parts.map((p, j) => (
                    <span key={j}>
                      <span style={{ fontSize:28,fontWeight:700,background:'#FFF3E0',borderRadius:12,padding:'4px 12px',display:'inline-block' }}>{p}</span>
                      {j < c.parts.length-1 && <span style={{ fontSize:20,color:'#999' }}>+</span>}
                    </span>
                  ))}
                  <span style={{ fontSize:24,color:'var(--bbaby-red)',fontWeight:700 }}>=</span>
                  <span style={{ fontSize:34,fontWeight:700,color:fnd?'var(--bbaby-green)':'var(--bbaby-red)',background:fnd?'#F1F8E9':'#FFF0F0',borderRadius:12,padding:'4px 14px' }}>{fnd ? c.result : '?'}</span>
                </div>
                {fnd && <motion.div initial={{ height:0,opacity:0 }} animate={{ height:'auto',opacity:1 }} style={{ marginTop:10,padding:10,background:'white',borderRadius:12,fontSize:14,color:'#666',textAlign:'center' }}>{c.story}</motion.div>}
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  // === EVOLUTION ===
  if (view === 'evolution') {
    const handleEvo = (e: EvolutionChar) => {
      if (found.has(e.modern)) return
      speak(e.modern + ': ' + e.meaning); play('correct'); answerQuestion(true); addCoins(1)
      setFound(new Set([...found, e.modern]))
    }
    return (
      <div style={{ minHeight:'100vh',paddingBottom:20 }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px' }}>
          <button onClick={() => setView('map')} style={{ fontSize:24,border:'none',background:'none',cursor:'pointer' }}>Back</button>
          <span style={{ fontFamily:'var(--font-heading)',fontSize:20 }}>Evolution</span>
          <span style={{ fontWeight:700,fontSize:18,background:'white',padding:'6px 14px',borderRadius:16 }}>Score {score}</span>
        </div>
        <div style={{ padding:'0 16px',marginBottom:8,fontSize:14,color:'#666',textAlign:'center' }}>Characters evolved from ancient pictures</div>
        <div style={{ display:'flex',flexDirection:'column',gap:14,padding:'0 16px' }}>
          {EVOLUTION_CHARS.map((e, i) => {
            const fnd = found.has(e.modern)
            return (
              <motion.div key={i} initial={{ opacity:0,x:-20 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.1 }}
                onClick={() => handleEvo(e)}
                style={{ background:fnd?'#FFF8E1':'white',borderRadius:20,padding:16,cursor:fnd?'default':'pointer',boxShadow:fnd?'none':'var(--shadow-sm)',border:fnd?'2px solid var(--bbaby-yellow)':'2px solid transparent' }}>
                <div style={{ display:'flex',alignItems:'center',justifyContent:'space-around' }}>
                  {[{ label:'Oracle',val:e.oracle },{ label:'Bronze',val:e.bronze },{ label:'Seal',val:e.seal }].map(stage => (
                    <div key={stage.label} style={{ textAlign:'center' }}>
                      <div style={{ fontSize:22 }}>{stage.val}</div>
                      <div style={{ fontSize:10,color:'#999' }}>{stage.label}</div>
                    </div>
                  ))}
                  <div style={{ fontSize:18,color:'#999' }}>Arrow</div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:30,fontWeight:700,color:fnd?'var(--bbaby-green)':'var(--bbaby-red)' }}>{fnd ? e.modern : '?'}</div>
                    <div style={{ fontSize:10,color:'#999' }}>Modern</div>
                  </div>
                </div>
                {fnd && <motion.div initial={{ height:0 }} animate={{ height:'auto' }} style={{ marginTop:6,fontSize:14,color:'#666',textAlign:'center' }}>Means: {e.meaning}</motion.div>}
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  return null
}