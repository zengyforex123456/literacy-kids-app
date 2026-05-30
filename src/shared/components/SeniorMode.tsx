import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Senior mode store — large fonts, voice-only, simplified UI
interface SeniorState {
  enabled: boolean
  fontSize: number      // base font size multiplier
  voiceOnly: boolean    // hide text, show only icons+voice
  toggle: () => void
}

export const useSeniorMode = create<SeniorState>()(
  persist(
    (set) => ({
      enabled: false,
      fontSize: 1,
      voiceOnly: false,
      toggle: () => set(s => ({
        enabled: !s.enabled,
        fontSize: s.enabled ? 1 : 1.8,
        voiceOnly: s.enabled ? false : true,
      })),
    }),
    { name: 'senior-mode' }
  )
)

// Senior mode toggle button
export function SeniorModeToggle() {
  const { enabled, toggle } = useSeniorMode()
  return (
    <button
      onClick={toggle}
      style={{
        position: 'fixed', bottom: 100, right: 16, zIndex: 200,
        width: 56, height: 56, borderRadius: '50%',
        background: enabled ? 'var(--bbaby-red)' : 'white',
        border: '2px solid ' + (enabled ? 'var(--bbaby-red)' : '#DDD'),
        fontSize: 28, cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      title={enabled ? '退出长辈模式' : '长辈模式'}
    >
      {enabled ? '👓' : '👵'}
    </button>
  )
}
