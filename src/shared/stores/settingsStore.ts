import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  dailyLimitMinutes: number
  difficulty: 1 | 2 | 3
  eyeCare: boolean
  reminder: boolean
  reminderTime: string
  music: boolean
  parentPin: string
  setDifficulty: (d: 1 | 2 | 3) => void
  setDailyLimit: (m: number) => void
  toggleEyeCare: () => void
  toggleReminder: () => void
  setReminderTime: (t: string) => void
  toggleMusic: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      dailyLimitMinutes: 30,
      difficulty: 1,
      eyeCare: true,
      reminder: false,
      reminderTime: '18:00',
      music: true,
      parentPin: '1234',

      setDifficulty: (d) => set({ difficulty: d }),
      setDailyLimit: (m) => set({ dailyLimitMinutes: m }),
      toggleEyeCare: () => set((s) => ({ eyeCare: !s.eyeCare })),
      toggleReminder: () => set((s) => ({ reminder: !s.reminder })),
      setReminderTime: (t) => set({ reminderTime: t }),
      toggleMusic: () => set((s) => ({ music: !s.music })),
    }),
    { name: 'settings-store' }
  )
)
