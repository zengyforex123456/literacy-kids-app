import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVoice } from '../../shared/hooks/useVoice'
import { useSound } from '../../shared/hooks/useSound'
import { useGameStore } from '../../shared/stores/gameStore'
import { useUserStore } from '../../shared/stores/userStore'

const CHARS = ['一', '二', '三', '大', '小', '人', '天', '日', '月']

export function WritingGame() {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { speak } = useVoice()
  const { play } = useSound()
  const { startGame, endGame, answerQuestion } = useGameStore()
  const addCoins = useUserStore(s => s.addCoins)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  const currentChar = CHARS[currentIdx]

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#FFF8F0'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // Guide stroke
    ctx.font = '120px serif'
    ctx.fillStyle = 'rgba(0,0,0,0.08)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(currentChar, canvas.width / 2, canvas.height / 2)
  }, [currentChar])

  useEffect(() => {
    startGame('writing')
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(2, 2)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#FF6B6B'
    ctx.lineWidth = 8
    ctxRef.current = ctx
    clearCanvas()
    speak(`请写${currentChar}`)
    return () => endGame()
  }, [])

  useEffect(() => { clearCanvas(); setHasDrawn(false); speak(`请写${currentChar}`) }, [currentIdx])

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    if ('touches' in e) {
      const t = e.touches[0] || e.changedTouches[0]
      return { x: t.clientX - rect.left, y: t.clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const pos = getPos(e)
    ctxRef.current?.beginPath()
    ctxRef.current?.moveTo(pos.x, pos.y)
    setIsDrawing(true)
    setHasDrawn(true)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawing) return
    const pos = getPos(e)
    ctxRef.current?.lineTo(pos.x, pos.y)
    ctxRef.current?.stroke()
  }

  const endDraw = () => { setIsDrawing(false) }

  const handleSubmit = () => {
    play('correct')
    answerQuestion(true)
    addCoins(1)
    speak(`写得真棒！${currentChar}`)
    if (currentIdx < CHARS.length - 1) {
      setCurrentIdx(i => i + 1)
    } else {
      setCurrentIdx(-1)
    }
  }

  if (currentIdx === -1) {
    return (
      <div style={{ padding: 60, textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <div style={{ fontSize: 72 }}>✍️</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32 }}>全部完成!</h1>
        <button onClick={() => navigate('/')} style={{
          padding: '16px 48px', fontSize: 20, fontWeight: 700, border: 'none',
          borderRadius: 20, background: 'var(--primary)', color: 'white', cursor: 'pointer',
        }}>回到主页</button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
        <button onClick={() => navigate('/')} style={{ fontSize: 24, border: 'none', background: 'none', cursor: 'pointer' }}>←</button>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20 }}>✍️ 书写描红</span>
        <span style={{ fontSize: 14, color: '#999' }}>{currentIdx + 1}/{CHARS.length}</span>
      </div>

      <div style={{ textAlign: 'center', margin: '16px 0 8px' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 40 }}>{currentChar}</span>
        <button onClick={() => speak(currentChar)} style={{ marginLeft: 8, border: 'none', background: 'var(--secondary)', borderRadius: 12, padding: '6px 10px', cursor: 'pointer', fontSize: 20 }}>🔊</button>
      </div>

      <div style={{
        margin: '0 16px', border: '4px dashed #DDD', borderRadius: 'var(--radius)',
        height: 250, overflow: 'hidden', touchAction: 'none',
      }}>
        <canvas ref={canvasRef}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
          style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
        />
      </div>

      <div style={{ display: 'flex', gap: 12, padding: '12px 16px', justifyContent: 'center' }}>
        <button onClick={clearCanvas} style={{
          padding: '12px 32px', borderRadius: 16, border: '2px solid #DDD',
          background: 'white', fontWeight: 700, fontSize: 16, cursor: 'pointer',
        }}>清除</button>
        <button onClick={handleSubmit} disabled={!hasDrawn} style={{
          padding: '12px 32px', borderRadius: 16, border: 'none',
          background: hasDrawn ? 'var(--primary)' : '#CCC',
          color: 'white', fontWeight: 700, fontSize: 16, cursor: hasDrawn ? 'pointer' : 'not-allowed',
        }}>完成 ✓</button>
      </div>
    </div>
  )
}
