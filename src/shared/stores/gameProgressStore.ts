import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameProgress {
  currentLevel: number
  unlockedLevels: number[]
  completedLevels: number[]
  totalScore: number
  stars: Record<number, number>
  learnedChars: string[]
  lastPlayedAt: string | null
}

interface ProgressState extends GameProgress {
  completeLevel: (level: number, score: number, stars: number) => number
  isLevelUnlocked: (level: number) => boolean
  addLearnedChars: (chars: string[]) => void
  resetProgress: () => void
}

const DEFAULT: GameProgress = {
  currentLevel: 1,
  unlockedLevels: [1],
  completedLevels: [],
  totalScore: 0,
  stars: {},
  learnedChars: [],
  lastPlayedAt: null,
}

export const useGameProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...DEFAULT,

      completeLevel: (level, score, stars) => {
        const state = get()
        const nextLevel = level + 1
        const unlocked = state.unlockedLevels.includes(nextLevel)
          ? state.unlockedLevels
          : [...state.unlockedLevels, nextLevel]
        return nextLevel
      },

      isLevelUnlocked: (level) => get().unlockedLevels.includes(level),

      addLearnedChars: (chars) => set(s => {
        const newChars = chars.filter(c => !s.learnedChars.includes(c))
        if (newChars.length === 0) return s
        return {
          learnedChars: [...s.learnedChars, ...newChars],
          totalScore: s.totalScore + newChars.length * 10,
          lastPlayedAt: new Date().toISOString(),
        }
      }),

      resetProgress: () => set(DEFAULT),
    }),
    { name: 'game-progress-store' }
  )
)
