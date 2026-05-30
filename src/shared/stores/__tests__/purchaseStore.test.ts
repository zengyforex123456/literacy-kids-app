import { describe, it, expect, beforeEach } from 'vitest'
import { usePurchaseStore } from '../purchaseStore'

describe('purchaseStore', () => {
  beforeEach(() => {
    usePurchaseStore.setState({
      token: null, status: 'free', unlockedProducts: [], verifyFailCount: 0,
    })
  })

  it('starts in free mode', () => {
    expect(usePurchaseStore.getState().status).toBe('free')
  })

  it('can access first 100 chars in free mode', () => {
    expect(usePurchaseStore.getState().canAccessChar(50)).toBe(true)
    expect(usePurchaseStore.getState().canAccessChar(99)).toBe(true)
  })

  it('cannot access chars beyond 100 in free mode', () => {
    expect(usePurchaseStore.getState().canAccessChar(100)).toBe(false)
    expect(usePurchaseStore.getState().canAccessChar(150)).toBe(false)
  })

  it('unlocks all chars after full purchase', () => {
    usePurchaseStore.getState().unlockProduct('full_unlock')
    expect(usePurchaseStore.getState().canAccessChar(150)).toBe(true)
    expect(usePurchaseStore.getState().canAccessChar(199)).toBe(true)
    expect(usePurchaseStore.getState().status).toBe('unlocked')
  })

  it('degrades to free after 3 failed verifications', () => {
    const store = usePurchaseStore.getState()
    store.incrementFailCount()
    store.incrementFailCount()
    store.incrementFailCount()
    expect(usePurchaseStore.getState().status).toBe('degraded')
    expect(usePurchaseStore.getState().verifyFailCount).toBe(3)
  })

  it('sets token and unlocks', () => {
    usePurchaseStore.getState().setToken('test-token-abc')
    expect(usePurchaseStore.getState().token).toBe('test-token-abc')
    expect(usePurchaseStore.getState().status).toBe('unlocked')
  })
})
