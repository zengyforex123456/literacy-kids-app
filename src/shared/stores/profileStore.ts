import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ChildProfile {
  id: string
  name: string
  avatar: string
  age: number
  coins: number
  streak: number
  learnedChars: string[]
  lastPlayDate: string | null
}

interface ProfileState {
  profiles: ChildProfile[]
  activeProfileId: string | null
  addProfile: (name: string, age: number) => void
  switchProfile: (id: string) => void
  getActiveProfile: () => ChildProfile | undefined
  updateProfile: (id: string, updates: Partial<ChildProfile>) => void
}

const DEFAULT_PROFILE: ChildProfile = {
  id: 'child_1',
  name: '大宝',
  avatar: '🐻',
  age: 5,
  coins: 0,
  streak: 0,
  learnedChars: [],
  lastPlayDate: null,
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: [DEFAULT_PROFILE],
      activeProfileId: 'child_1',

      addProfile: (name, age) => {
        const id = 'child_' + Date.now()
        set(s => ({
          profiles: [...s.profiles, {
            id, name,
            avatar: ['🐻','🐰','🦊','🐱'][s.profiles.length % 4],
            age, coins: 0, streak: 0,
            learnedChars: [], lastPlayDate: null,
          }],
        }))
      },

      switchProfile: (id) => set({ activeProfileId: id }),

      getActiveProfile: () => {
        const { profiles, activeProfileId } = get()
        return profiles.find(p => p.id === activeProfileId)
      },

      updateProfile: (id, updates) => set(s => ({
        profiles: s.profiles.map(p => p.id === id ? { ...p, ...updates } : p),
      })),
    }),
    { name: 'profile-store' }
  )
)
