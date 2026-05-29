import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HomeScreen } from '../HomeScreen'

function renderHome() {
  return render(<MemoryRouter><HomeScreen /></MemoryRouter>)
}

describe('HomeScreen', () => {
  it('should render the main title', () => {
    renderHome()
    expect(screen.getByText(/识字乐园/)).toBeDefined()
  })

  it('should render all 4 game cards', () => {
    renderHome()
    expect(screen.getByText('汉字森林')).toBeDefined()
    expect(screen.getByText('泡泡大战')).toBeDefined()
    expect(screen.getByText('配对闯关')).toBeDefined()
    expect(screen.getByText('书写描红')).toBeDefined()
  })

  it('should render navigation tabs', () => {
    renderHome()
    expect(screen.getByText('首页')).toBeDefined()
    expect(screen.getByText('贴纸')).toBeDefined()
    expect(screen.getByText('成就')).toBeDefined()
    expect(screen.getByText('家长')).toBeDefined()
  })

  it('should display coin section', () => {
    renderHome()
    const elements = screen.getAllByText(/⭐/)
    expect(elements.length).toBeGreaterThan(0)
  })

  it('should display streak', () => {
    renderHome()
    expect(screen.getByText(/连续/)).toBeDefined()
  })
})
