import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  name: string
  avatar: string
  coins: number
  streak: number
  lastPlayDate: string | null
  setAvatar: (avatar: string) => void
  addCoins: (n: number) => void
  checkStreak: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      name: '小探险家',
      avatar: '🐻',
      coins: 0,
      streak: 0,
      lastPlayDate: null,

      setAvatar: (avatar) => set({ avatar }),
      addCoins: (n) => set((s) => ({ coins: s.coins + n })),
      checkStreak: () => {
        const today = new Date().toISOString().slice(0, 10)
        const { lastPlayDate, streak } = get()
        if (lastPlayDate === today) return
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
        set({
          streak: lastPlayDate === yesterday ? streak + 1 : 1,
          lastPlayDate: today,
        })
      },
    }),
    { name: 'user-store' }
  )
)
