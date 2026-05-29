import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RewardsScreen } from '../RewardsScreen'

describe('RewardsScreen', () => {
  it('should render achievement badges', () => {
    render(<MemoryRouter><RewardsScreen /></MemoryRouter>)
    expect(screen.getByText('初学者')).toBeDefined()
    expect(screen.getByText('进阶者')).toBeDefined()
    expect(screen.getByText('大师')).toBeDefined()
  })

  it('should render stickers', () => {
    render(<MemoryRouter><RewardsScreen /></MemoryRouter>)
    expect(screen.getByText('初识汉字')).toBeDefined()
    expect(screen.getByText('动物专家')).toBeDefined()
  })

  it('should render streak info', () => {
    render(<MemoryRouter><RewardsScreen /></MemoryRouter>)
    expect(screen.getByText(/连续打卡/)).toBeDefined()
  })
})
