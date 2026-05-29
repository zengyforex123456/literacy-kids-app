import { describe, it, expect, vi } from 'vitest'
import { EventBus } from '../EventBus'

describe('EventBus', () => {
  it('should register and emit events', () => {
    const bus = new EventBus()
    const fn = vi.fn()
    bus.on('test', fn)
    bus.emit('test', 'a', 1)
    expect(fn).toHaveBeenCalledWith('a', 1)
  })

  it('should support multiple listeners', () => {
    const bus = new EventBus()
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    bus.on('test', fn1)
    bus.on('test', fn2)
    bus.emit('test')
    expect(fn1).toHaveBeenCalled()
    expect(fn2).toHaveBeenCalled()
  })

  it('should unsubscribe via returned function', () => {
    const bus = new EventBus()
    const fn = vi.fn()
    const unsub = bus.on('test', fn)
    unsub()
    bus.emit('test')
    expect(fn).not.toHaveBeenCalled()
  })

  it('should off specific listeners', () => {
    const bus = new EventBus()
    const fn = vi.fn()
    bus.on('test', fn)
    bus.off('test', fn)
    bus.emit('test')
    expect(fn).not.toHaveBeenCalled()
  })

  it('should clear all listeners', () => {
    const bus = new EventBus()
    bus.on('a', vi.fn())
    bus.on('b', vi.fn())
    bus.clear()
    // After clear, events should have no listeners
    expect((bus as any).listeners.size).toBe(0)
  })
})
