import { describe, it, expect, beforeEach } from 'vitest'
import { useUserStore } from '../userStore'

describe('userStore', () => {
  beforeEach(() => {
    useUserStore.setState({ name: 'test', avatar: '🐻', coins: 0, streak: 0, lastPlayDate: null })
  })

  it('should add coins', () => {
    useUserStore.getState().addCoins(5)
    expect(useUserStore.getState().coins).toBe(5)
    useUserStore.getState().addCoins(3)
    expect(useUserStore.getState().coins).toBe(8)
  })

  it('should set avatar', () => {
    useUserStore.getState().setAvatar('🐱')
    expect(useUserStore.getState().avatar).toBe('🐱')
  })

  it('should check streak for first day', () => {
    useUserStore.getState().checkStreak()
    const state = useUserStore.getState()
    expect(state.streak).toBe(1)
    expect(state.lastPlayDate).toBeTruthy()
  })

  it('should check streak for consecutive days', () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    useUserStore.setState({ lastPlayDate: yesterday, streak: 3 })
    useUserStore.getState().checkStreak()
    expect(useUserStore.getState().streak).toBe(4)
  })

  it('should reset streak for non-consecutive day', () => {
    const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().slice(0, 10)
    useUserStore.setState({ lastPlayDate: twoDaysAgo, streak: 5 })
    useUserStore.getState().checkStreak()
    expect(useUserStore.getState().streak).toBe(1)
  })
})
