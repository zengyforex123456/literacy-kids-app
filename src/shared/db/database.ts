import Dexie, { type EntityTable } from 'dexie'

export interface Word {
  id?: number
  chinese: string
  english: string
  pinyin: string
  category: string
  imageUrl: string
  difficulty: 1 | 2 | 3
  learned: boolean
  mastered: boolean
  learnedAt?: number
  reviewCount: number
  correctCount: number
}

export interface Progress {
  id?: number
  date: string
  wordsLearned: number
  gamesPlayed: number
  correctRate: number
  durationMinutes: number
}

export interface Sticker {
  id?: number
  name: string
  emoji: string
  earned: boolean
  earnedAt?: number
}

export interface Achievement {
  id?: number
  name: string
  level: 1 | 2 | 3
  description: string
  earned: boolean
  earnedAt?: number
}

export interface Settings {
  id?: number
  dailyLimitMinutes: number
  difficulty: 1 | 2 | 3
  eyeCare: boolean
  reminder: boolean
  reminderTime: string
  music: boolean
  parentPin: string
}

const db = new Dexie('LiteracyAppDB') as Dexie & {
  words: EntityTable<Word, 'id'>
  progress: EntityTable<Progress, 'id'>
  stickers: EntityTable<Sticker, 'id'>
  achievements: EntityTable<Achievement, 'id'>
  settings: EntityTable<Settings, 'id'>
}

db.version(1).stores({
  words: '++id, category, difficulty, learned, mastered',
  progress: '++id, date',
  stickers: '++id, earned',
  achievements: '++id, level, earned',
  settings: '++id',
})

export { db }
