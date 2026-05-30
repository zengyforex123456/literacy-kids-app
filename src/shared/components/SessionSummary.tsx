import { motion } from 'framer-motion'

interface WordRow { char: string; pinyin: string }
interface Props { show: boolean; newWords: WordRow[]; reviewWords: WordRow[]; durationMin: number; onClose: () => void }

export function SessionSummary({ show, newWords, reviewWords, durationMin, onClose }: Props) {
  if (!show) return null

  return (
    <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:400,padding:16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'white',borderRadius:24,padding:24,maxWidth:380,width:'100%' }}>
        <div style={{ textAlign:'center',marginBottom:16 }}>
          <div style={{ fontSize:48 }}>Book</div>
          <h2 style={{ fontFamily:'var(--font-heading)',fontSize:22,marginTop:8 }}>Today Learning</h2>
          <p style={{ fontSize:14,color:'#666' }}>{durationMin} min - {newWords.length + reviewWords.length} chars</p>
        </div>

        <div style={{ display:'flex',gap:12,marginBottom:16 }}>
          <div style={{ flex:1,textAlign:'center',padding:12,borderRadius:14,background:'#E8F5E9' }}>
            <div style={{ fontWeight:800,fontSize:24,color:'var(--bbaby-green)' }}>{newWords.length}</div>
            <div style={{ fontSize:11,color:'#999' }}>New</div>
          </div>
          <div style={{ flex:1,textAlign:'center',padding:12,borderRadius:14,background:'#E3F2FD' }}>
            <div style={{ fontWeight:800,fontSize:24,color:'var(--bbaby-blue)' }}>{reviewWords.length}</div>
            <div style={{ fontSize:11,color:'#999' }}>Review</div>
          </div>
          <div style={{ flex:1,textAlign:'center',padding:12,borderRadius:14,background:'#F3E5F5' }}>
            <div style={{ fontWeight:800,fontSize:24,color:'var(--bbaby-purple)' }}>{durationMin}m</div>
            <div style={{ fontSize:11,color:'#999' }}>Time</div>
          </div>
        </div>

        {newWords.length > 0 && (
          <div style={{ marginBottom:12 }}>
            <div style={{ fontWeight:700,fontSize:14,marginBottom:6,color:'var(--bbaby-green)' }}>New Learned</div>
            <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
              {newWords.map(w => <span key={w.char} style={{ background:'#E8F5E9',borderRadius:8,padding:'4px 10px',fontSize:18,fontWeight:700 }}>{w.char}</span>)}
            </div>
          </div>
        )}

        {reviewWords.length > 0 && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontWeight:700,fontSize:14,marginBottom:6,color:'var(--bbaby-blue)' }}>Reviewed</div>
            <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
              {reviewWords.map(w => <span key={w.char} style={{ background:'#E3F2FD',borderRadius:8,padding:'4px 10px',fontSize:18,fontWeight:700 }}>{w.char}</span>)}
            </div>
          </div>
        )}

        <div style={{ background:'#FFF8E1',borderRadius:12,padding:12,marginBottom:16,fontSize:13,color:'#666',textAlign:'center' }}>
          Come back tomorrow! Review boosts memory by 3x.
        </div>

        <button onClick={onClose} style={{ width:'100%',padding:14,borderRadius:14,border:'none',background:'var(--bbaby-red)',color:'white',fontWeight:700,fontSize:16,cursor:'pointer' }}>
          Continue
        </button>
      </div>
    </div>
  )
}
