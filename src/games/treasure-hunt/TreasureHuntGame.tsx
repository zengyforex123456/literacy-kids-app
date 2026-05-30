import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useVoice } from '../../shared/hooks/useVoice'
import { useSound } from '../../shared/hooks/useSound'
import { useGameStore } from '../../shared/stores/gameStore'
import { useUserStore } from '../../shared/stores/userStore'
import { getAllFamilies } from '../../shared/utils/radicalQuery'
import { COMPOUND_CHARS, EVOLUTION_CHARS } from './data'

// Pet character
const PET = { name:'小兔', emoji:'🐰', color:'#FFE0B2' }

// Map a char to a simple emoji based on meaning
const CHAR_EMOJI: Record<string,string> = {
  '口':'👄','木':'🌳','水':'💧','火':'🔥','人':'🧍','女':'👧','心':'❤️','手':'✋',
  '目':'👁️','日':'☀️','月':'🌙','山':'⛰️','石':'🪨','金':'🪙','言':'💬','虫':'🐛',
  '鱼':'🐟','鸟':'🐦','马':'🐴','王':'👑','贝':'🐚','车':'🚗','足':'🦶','米':'🍚',
  '田':'🌾','力':'💪','子':'👶','门':'🚪','草':'🌿','竹':'🎋','雨':'🌧️','禾':'🌾',
  '走':'🚶','犬':'🐕','示':'🙏','衣':'👕','食':'🍽️','丝':'🧵','刀':'🔪','冰':'🧊',
}

type View = 'story' | 'map' | 'cards' | 'compound' | 'evolution'

export function TreasureHuntGame() {
  const nav = useNavigate()
  const { speak } = useVoice()
  const { play } = useSound()
  const addCoins = useUserStore(s => s.addCoins)
  const { startGame, endGame } = useGameStore()

  const [view, setView] = useState<View>('story')
  const [familyIdx, setFamilyIdx] = useState(0)
  const [found, setFound] = useState<Set<string>>(new Set())
  const [showConfetti, setShowConfetti] = useState(false)
  const [revealed, setRevealed] = useState<string | null>(null)
  const [sparkles, setSparkles] = useState<{x:number;y:number}[]>([])
  const [hint, setHint] = useState('')

  const families = getAllFamilies()
  const totalFound = found.size

  useEffect(() => { startGame('treasure-hunt'); return () => endGame() }, [])

  const handleFind = (char: string, x: number, y: number) => {
    if (found.has(char)) return
    setRevealed(char)
    play('correct')
    speak(char)
    addCoins(1)
    setFound(new Set([...found, char]))
    setSparkles(Array.from({length:8}, (_,i)=>({x:x+(Math.random()-0.5)*80,y:y+(Math.random()-0.5)*80})))
    setShowConfetti(true)
    setHint('太棒了! +1⭐')
    setTimeout(() => { setHint(''); setSparkles([]) }, 1500)
  }

  const petMessage = totalFound === 0 ? '帮我找汉字宝藏吧!' :
    totalFound < 5 ? '还差一点!' : totalFound < 10 ? '快找到了!加油!' : '太厉害了!'

  // === STORY INTRO ===
  if (view === 'story') {
    return (
      <div onClick={() => { setView('map'); speak('帮我找到森林里藏起来的汉字吧!') }}
        style={{ minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
          background:'linear-gradient(180deg,#A5D6A7,#81C784,#4CAF50)',cursor:'pointer',gap:16,padding:32 }}>
        <motion.div animate={{ y:[0,-20,0],scale:[1,1.1,1] }} transition={{ repeat:Infinity,duration:2 }} style={{ fontSize:80 }}>🐰</motion.div>
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} style={{ textAlign:'center',color:'white' }}>
          <h1 style={{ fontFamily:'var(--font-heading)',fontSize:28,marginBottom:8 }}>汉字森林探险!</h1>
          <p style={{ fontSize:16,opacity:0.9 }}>小兔子的汉字宝藏藏在森林里</p>
          <p style={{ fontSize:16,opacity:0.9 }}>帮它找出来吧!</p>
        </motion.div>
        <motion.div animate={{ scale:[1,1.05,1] }} transition={{ repeat:Infinity,duration:1.5 }}
          style={{ marginTop:20,padding:'14px 40px',background:'white',borderRadius:28,fontWeight:700,fontSize:18,color:'#2E7D32' }}>
          点击开始 →
        </motion.div>
      </div>
    )
  }

  // === FOREST MAP ===
  if (view === 'map') {
    const COLORS = ['#FF6B6B','#4ECDC4','#FFE66D','#A66CFF','#FF9F43','#6BCB77','#FF9FF3','#42A5F5','#EF5350','#66BB6A']
    return (
      <div style={{ minHeight:'100vh',position:'relative',overflow:'hidden',
        background:'linear-gradient(180deg,#C8E6C9 0%,#A5D6A7 30%,#81C784 60%,#4CAF50 100%)' }}>
        
        {/* Sky sparkles */}
        {[...Array(8)].map((_,i)=>(<div key={i} className="sparkle-dot" style={{top:5+Math.random()*30+'%',left:5+Math.random()*90+'%',animationDelay:i*0.3+'s'}} />))}

        {/* Pet bunny */}
        <motion.div animate={{ y:[0,-8,0] }} transition={{ repeat:Infinity,duration:2 }}
          style={{ position:'absolute',top:12,right:16,zIndex:10,textAlign:'center' }}>
          <div style={{ fontSize:44 }}>{PET.emoji}</div>
          <div style={{ background:'white',borderRadius:12,padding:'4px 10px',fontSize:12,fontWeight:600,color:'#2E7D32',maxWidth:120 }}>
            {petMessage}
          </div>
        </motion.div>

        {/* Hint toast */}
        <AnimatePresence>
          {hint && (
            <motion.div initial={{ opacity:0,y:-20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
              style={{ position:'absolute',top:'30%',left:'50%',transform:'translateX(-50%)',zIndex:20,
                background:'#FFD700',color:'#2E7D32',padding:'10px 24px',borderRadius:20,fontWeight:700,fontSize:18 }}>
              {hint}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trees */}
        <div style={{ padding:'60px 16px 20px' }}>
          <div style={{ textAlign:'center',marginBottom:16 }}>
            <span style={{ background:'rgba(255,255,255,0.9)',borderRadius:16,padding:'6px 16px',fontSize:14,fontWeight:600 }}>
              找到 {totalFound} 个汉字宝藏 ✨
            </span>
          </div>
          <div style={{ display:'flex',flexWrap:'wrap',gap:12,justifyContent:'center' }}>
            {families.map((f,i) => {
              const learned = f.members.filter(m=>found.has(m)).length
              const complete = learned >= f.members.length
              return (
                <motion.div key={f.radical}
                  whileHover={{ scale:1.08 }} whileTap={{ scale:0.95 }}
                  onClick={() => { setFamilyIdx(i); setView('cards'); speak(f.name) }}
                  style={{
                    background:complete ? COLORS[i%COLORS.length] : 'rgba(255,255,255,0.85)',
                    borderRadius:18,padding:'14px 16px',cursor:'pointer',textAlign:'center',
                    minWidth:80,boxShadow:'0 4px 16px rgba(0,0,0,0.1)',
                    border:complete ? '2px solid rgba(255,255,255,0.5)' : '2px solid rgba(255,255,255,0.3)',
                  }}>
                  <div style={{ fontSize:28,fontWeight:700,color:complete?'white':'#37474F' }}>{f.radical}</div>
                  <div style={{ fontSize:12,fontWeight:600,color:complete?'white':'#666',marginTop:2 }}>{f.name}</div>
                  <div style={{ fontSize:11,color:complete?'rgba(255,255,255,0.8)':'#999' }}>{learned}/{f.members.length}</div>
                  {complete && <div style={{ fontSize:16,marginTop:2 }}>✅</div>}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Bottom tabs */}
        <div style={{ position:'fixed',bottom:20,left:'50%',transform:'translateX(-50%)',display:'flex',gap:8 }}>
          {[
            { label:'🐰故事',view:'story' as View },
            { label:'🔮会意',view:'compound' as View },
            { label:'📜演变',view:'evolution' as View },
          ].map(t=>(<button key={t.label} onClick={()=>setView(t.view)}
            style={{ padding:'8px 16px',borderRadius:20,border:'none',background:'rgba(255,255,255,0.9)',fontWeight:600,fontSize:14,cursor:'pointer',boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
            {t.label}</button>))}
        </div>
      </div>
    )
  }

  // === CARD SEARCH (family cards) ===
  if (view === 'cards') {
    const family = families[familyIdx]
    return (
      <div style={{ minHeight:'100vh',background:'linear-gradient(180deg,#E8F5E9,#C8E6C9)',position:'relative' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px' }}>
          <button onClick={()=>setView('map')} style={{ fontSize:20,border:'none',background:'white',cursor:'pointer',padding:'8px 16px',borderRadius:14 }}>← 返回</button>
          <span style={{ fontFamily:'var(--font-heading)',fontSize:18,fontWeight:700 }}>{family.radical} {family.name}</span>
          <span style={{ background:'white',padding:'6px 14px',borderRadius:16,fontWeight:700,fontSize:14 }}>⭐ {totalFound}</span>
        </div>

        <div style={{ textAlign:'center',marginBottom:8,fontSize:14,color:'#666' }}>
          这些字都有 <b style={{ color:'#E53935',fontSize:20 }}>{family.radical}</b> 偏旁! 点击卡片翻开
        </div>

        {/* Sparkles */}
        {sparkles.map((s,i)=>(<div key={i} style={{position:'absolute',left:s.x,top:s.y,fontSize:16,pointerEvents:'none',zIndex:30,animation:'star-burst 1s ease-out forwards'}}>✨</div>))}

        <div style={{ display:'flex',flexWrap:'wrap',gap:12,justifyContent:'center',padding:'0 16px' }}>
          {family.members.map(char=>{
            const isFound = found.has(char)
            return (
              <motion.div key={char}
                whileHover={!isFound?{scale:1.1}:{}}
                onClick={(e)=>{if(!isFound){const rect=(e.target as HTMLElement).getBoundingClientRect();handleFind(char,rect.left+30,rect.top)}}}
                style={{
                  width:72,height:96,borderRadius:18,
                  background:isFound?'#C8E6C9':'white',
                  display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
                  cursor:isFound?'default':'pointer',
                  boxShadow:isFound?'none':'0 6px 20px rgba(0,0,0,0.1)',
                  border:isFound?'2px solid #66BB6A':'2px solid rgba(0,0,0,0.06)',
                  opacity:isFound?0.6:1,
                  transition:'all 0.2s',
                }}>
                {!isFound && <div style={{ fontSize:22,color:'#BDBDBD' }}>?</div>}
                {isFound && <>
                  <div style={{ fontSize:24,fontWeight:700,color:'#2E7D32' }}>{char}</div>
                  <div style={{ fontSize:14 }}>{CHAR_EMOJI[char]||'📝'}</div>
                </>}
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  // === COMPOUND ===
  if (view === 'compound') return (
    <div style={{ minHeight:'100vh',background:'linear-gradient(180deg,#FFF8E1,#FFE082)',paddingBottom:20 }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px' }}>
        <button onClick={()=>setView('map')} style={{ fontSize:20,border:'none',background:'white',cursor:'pointer',padding:'8px 16px',borderRadius:14 }}>← 返回</button>
        <span style={{ fontFamily:'var(--font-heading)',fontSize:18 }}>🔮 会意字揭秘</span><span>⭐ {totalFound}</span>
      </div>
      <div style={{ textAlign:'center',fontSize:14,color:'#666',marginBottom:12 }}>两个汉字组合 = 新字!</div>
      <div style={{ display:'flex',flexDirection:'column',gap:12,padding:'0 16px' }}>
        {COMPOUND_CHARS.map((c,i)=>{
          const fnd = found.has(c.result)
          return (
            <motion.div key={i} initial={{ opacity:0,x:-20 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.1 }}
              onClick={()=>{if(!fnd){speak(c.story);play('correct');setFound(new Set([...found,c.result]));setShowConfetti(true)}}}
              style={{ background:fnd?'#F1F8E9':'white',borderRadius:20,padding:20,cursor:fnd?'default':'pointer',boxShadow:'0 4px 16px rgba(0,0,0,0.08)',border:fnd?'2px solid #66BB6A':'2px solid transparent' }}>
              <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8,flexWrap:'wrap' }}>
                {c.parts.map((p,j)=>(<span key={j}><span style={{ fontSize:34,fontWeight:700,background:'#FFF3E0',borderRadius:14,padding:'4px 14px' }}>{p}</span>{j<c.parts.length-1&&<span style={{fontSize:22,color:'#999'}}>+</span>}</span>))}
                <span style={{fontSize:24,color:'#E53935',fontWeight:700}}>=</span>
                <span style={{fontSize:40,fontWeight:700,color:fnd?'#66BB6A':'#E53935',background:fnd?'#F1F8E9':'#FFF0F0',borderRadius:14,padding:'4px 16px'}}>{fnd?c.result:'?'}</span>
              </div>
              {fnd&&<motion.div initial={{height:0}} animate={{height:'auto'}} style={{marginTop:10,textAlign:'center',fontSize:14,color:'#666'}}>{c.story}</motion.div>}
            </motion.div>
          )
        })}
      </div>
    </div>
  )

  // === EVOLUTION ===
  if (view === 'evolution') return (
    <div style={{ minHeight:'100vh',background:'linear-gradient(180deg,#F3E5F5,#E1BEE7)',paddingBottom:20 }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px' }}>
        <button onClick={()=>setView('map')} style={{ fontSize:20,border:'none',background:'white',cursor:'pointer',padding:'8px 16px',borderRadius:14 }}>← 返回</button>
        <span style={{ fontFamily:'var(--font-heading)',fontSize:18 }}>📜 字形演变</span><span>⭐ {totalFound}</span>
      </div>
      <div style={{ textAlign:'center',fontSize:14,color:'#666',marginBottom:12 }}>汉字从古代图画变成现在的样子</div>
      <div style={{ display:'flex',flexDirection:'column',gap:14,padding:'0 16px' }}>
        {EVOLUTION_CHARS.map((e,i)=>{
          const fnd = found.has(e.modern)
          return (
            <motion.div key={i} initial={{ opacity:0,x:-20 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.1 }}
              onClick={()=>{if(!fnd){speak(e.modern+': '+e.meaning);play('correct');setFound(new Set([...found,e.modern]))}}}
              style={{ background:fnd?'#FFF8E1':'white',borderRadius:20,padding:16,cursor:fnd?'default':'pointer',boxShadow:'0 4px 16px rgba(0,0,0,0.08)',border:fnd?'2px solid #FFC107':'2px solid transparent' }}>
              <div style={{ display:'flex',alignItems:'center',justifyContent:'space-around' }}>
                {[{label:'甲骨文',val:e.oracle},{label:'金文',val:e.bronze},{label:'篆书',val:e.seal}].map(s=>(<div key={s.label} style={{textAlign:'center'}}><div style={{fontSize:24}}>{s.val}</div><div style={{fontSize:10,color:'#999'}}>{s.label}</div></div>))}
                <div style={{fontSize:20,color:'#999'}}>→</div>
                <div style={{textAlign:'center'}}><div style={{fontSize:32,fontWeight:700,color:fnd?'#66BB6A':'#E53935'}}>{fnd?e.modern:'?'}</div><div style={{fontSize:10,color:'#999'}}>楷书</div></div>
              </div>
              {fnd&&<motion.div initial={{height:0}} animate={{height:'auto'}} style={{marginTop:6,textAlign:'center',fontSize:14,color:'#666'}}>意思是: {e.meaning}</motion.div>}
            </motion.div>
          )
        })}
      </div>
    </div>
  )

  return null
}