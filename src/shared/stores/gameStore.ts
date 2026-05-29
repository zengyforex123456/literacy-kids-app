import { create } from 'zustand'

interface GameState {
  currentGame: string | null
  score: number
  questionsAnswered: number
  correctAnswers: number
  isPlaying: boolean
  startGame: (game: string) => void
  endGame: () => void
  answerQuestion: (correct: boolean) => void
}

export const useGameStore = create<GameState>()((set) => ({
  currentGame: null,
  score: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  isPlaying: false,

  startGame: (game) => set({
    currentGame: game, score: 0, questionsAnswered: 0,
    correctAnswers: 0, isPlaying: true,
  }),
  endGame: () => set({ isPlaying: false }),
  answerQuestion: (correct) => set((s) => ({
    score: s.score + (correct ? 1 : 0),
    questionsAnswered: s.questionsAnswered + 1,
    correctAnswers: s.correctAnswers + (correct ? 1 : 0),
  })),
}))
