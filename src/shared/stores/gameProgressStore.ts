import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CharRecord { char: string; learnedAt: number; reviewCount: number; lastReviewed: number; nextReview: number }
interface GameProgress { currentLevel: number; unlockedLevels: number[]; completedLevels: number[]; totalScore: number; stars: Record<number,number>; learnedChars: CharRecord[]; lastPlayedAt: string|null }
interface ProgressState extends GameProgress {
  addLearnedChars: (chars: string[]) => void
  getReviewChars: (count: number) => string[]
  getNewChars: (count: number, allChars: string[]) => string[]
  getMixedChars: (newCount: number, reviewCount: number, allChars: string[]) => string[]
  isLevelUnlocked: (level: number) => boolean
  completeLevel: (level: number, score: number, stars: number) => void
  resetProgress: () => void
}

const DEFAULT: GameProgress = { currentLevel:1, unlockedLevels:[1], completedLevels:[], totalScore:0, stars:{}, learnedChars:[], lastPlayedAt:null }

// Spaced repetition intervals (hours): 1h, 1d, 3d, 7d, 30d
const INTERVALS = [1, 24, 72, 168, 720]

export const useGameProgressStore = create<ProgressState>()(persist((set, get) => ({
  ...DEFAULT,

  addLearnedChars: (chars) => set(s => {
    const now = Date.now()
    const updated = s.learnedChars.map(c => {
      if (chars.includes(c.char)) {
        const nextIdx = Math.min(c.reviewCount + 1, INTERVALS.length - 1)
        return { ...c, reviewCount: c.reviewCount + 1, lastReviewed: now, nextReview: now + INTERVALS[nextIdx] * 3600000 }
      }
      return c
    })
    const existing = updated.map(c => c.char)
    const newChars = chars.filter(c => !existing.includes(c)).map(c => ({ char:c, learnedAt:now, reviewCount:0, lastReviewed:now, nextReview:now + INTERVALS[0] * 3600000 }))
    return { learnedChars: [...updated, ...newChars], totalScore: s.totalScore + chars.length * 10, lastPlayedAt: new Date().toISOString() }
  }),

  getReviewChars: (count) => {
    const now = Date.now()
    const due = get().learnedChars.filter(c => c.nextReview <= now).sort((a,b) => a.nextReview - b.nextReview)
    return due.slice(0, count).map(c => c.char)
  },

  getNewChars: (count, allChars) => {
    const learned = new Set(get().learnedChars.map(c => c.char))
    const unlearned = allChars.filter(c => !learned.has(c))
    return [...unlearned].sort(() => Math.random() - 0.5).slice(0, count)
  },

  getMixedChars: (newCount, reviewCount, allChars) => {
    const reviews = get().getReviewChars(reviewCount)
    const news = get().getNewChars(newCount, allChars)
    if (reviews.length < reviewCount) {
      const extra = allChars.filter(c => !reviews.includes(c)).sort(() => Math.random()-0.5).slice(0, reviewCount - reviews.length)
      return [...new Set([...reviews, ...news, ...extra])]
    }
    return [...new Set([...reviews, ...news])]
  },

  isLevelUnlocked: (level) => get().unlockedLevels.includes(level),
  completeLevel: (level, score, stars) => {
    const s = get()
    const next = level + 1
    const unlocked = s.unlockedLevels.includes(next) ? s.unlockedLevels : [...s.unlockedLevels, next]
    const completed = s.completedLevels.includes(level) ? s.completedLevels : [...s.completedLevels, level]
    const newStars = { ...s.stars, [level]: Math.max(s.stars[level]||0, stars) }
    set({ unlockedLevels:unlocked, completedLevels:completed, stars:newStars, totalScore:s.totalScore+score, currentLevel:next })
  },
  resetProgress: () => set(DEFAULT),
}), { name: 'game-progress-store' }))