import { describe, it, expect } from 'vitest'
import { createEntity } from '../Entity'

describe('createEntity', () => {
  it('should create an entity with correct properties', () => {
    const entity = createEntity('card', 100, 200, 50, 50, { word: 'test' })
    expect(entity.type).toBe('card')
    expect(entity.x).toBe(100)
    expect(entity.y).toBe(200)
    expect(entity.width).toBe(50)
    expect(entity.height).toBe(50)
    expect(entity.active).toBe(true)
    expect(entity.data.word).toBe('test')
    expect(entity.id).toBeTruthy()
  })

  it('should generate unique IDs', () => {
    const e1 = createEntity('a', 0, 0, 10, 10)
    const e2 = createEntity('a', 0, 0, 10, 10)
    expect(e1.id).not.toBe(e2.id)
  })

  it('should initialize with empty components map', () => {
    const entity = createEntity('test', 0, 0, 10, 10)
    expect(entity.components.size).toBe(0)
  })
})
