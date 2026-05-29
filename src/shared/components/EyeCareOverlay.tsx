import { useEyeCare } from '../hooks/useEyeCare'

export function EyeCareOverlay() {
  const { showRest, countdown } = useEyeCare()

  if (!showRest) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#2D3436',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', zIndex: 300, color: 'white', gap: 16,
    }}>
      <div style={{ fontSize: 64 }}>👀</div>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 32 }}>休息一下!</div>
      <div style={{ fontSize: 72, fontWeight: 800 }}>{countdown}</div>
      <div style={{ fontSize: 18, opacity: 0.7 }}>看看远处的绿色吧 🌿</div>
    </div>
  )
}
