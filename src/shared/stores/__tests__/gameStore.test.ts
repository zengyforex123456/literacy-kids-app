import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '../gameStore'

describe('gameStore', () => {
  beforeEach(() => {
    useGameStore.setState({
      currentGame: null, score: 0, questionsAnswered: 0,
      correctAnswers: 0, isPlaying: false,
    })
  })

  it('should start a game', () => {
    useGameStore.getState().startGame('bubble-pop')
    const state = useGameStore.getState()
    expect(state.currentGame).toBe('bubble-pop')
    expect(state.isPlaying).toBe(true)
    expect(state.score).toBe(0)
  })

  it('should end a game', () => {
    useGameStore.getState().startGame('matching')
    useGameStore.getState().endGame()
    expect(useGameStore.getState().isPlaying).toBe(false)
  })

  it('should track correct answers', () => {
    useGameStore.getState().startGame('treasure-hunt')
    useGameStore.getState().answerQuestion(true)
    useGameStore.getState().answerQuestion(true)
    useGameStore.getState().answerQuestion(false)
    const state = useGameStore.getState()
    expect(state.score).toBe(2)
    expect(state.questionsAnswered).toBe(3)
    expect(state.correctAnswers).toBe(2)
  })
})
