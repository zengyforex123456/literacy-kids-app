import { describe, it, expect } from 'vitest'
import { getAllFamilies, getFamilyByRadical, getRadicalOfChar, getSiblingsOfChar, searchFamilies } from '../radicalQuery'

describe('radicalQuery', () => {
  it('returns all 20 families', () => {
    expect(getAllFamilies().length).toBe(20)
  })

  it('finds family by radical mu', () => {
    const f = getFamilyByRadical('木')
    expect(f).toBeDefined()
    expect(f!.members).toContain('林')
    expect(f!.members).toContain('林')
  })

  it('finds radical of char', () => {
    expect(getRadicalOfChar('林')).toBe('木')
    expect(getRadicalOfChar('妈')).toBe('女')
  })

  it('finds siblings', () => {
    const s = getSiblingsOfChar('林')
    expect(s.length).toBeGreaterThan(2)
    expect(s).not.toContain('林')
  })

  it('returns undefined for unknown', () => {
    expect(getRadicalOfChar('X')).toBeUndefined()
  })

  it('searches families', () => {
    expect(searchFamilies('水').length).toBeGreaterThan(0)
  })
})
