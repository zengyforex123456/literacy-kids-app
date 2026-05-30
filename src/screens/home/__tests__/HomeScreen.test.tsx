import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HomeScreen } from '../HomeScreen'

function renderHome() { return render(<MemoryRouter><HomeScreen /></MemoryRouter>) }

describe('HomeScreen', () => {
  it('renders title', () => {
    renderHome()
    expect(screen.getByText(/魔法森林/)).toBeDefined()
  })
  it('renders game cards', () => {
    renderHome()
    expect(screen.getByText('汉字森林')).toBeDefined()
    expect(screen.getByText('泡泡大战')).toBeDefined()
  })
  it('renders pairing and writing', () => {
    renderHome()
    expect(screen.getByText('配对闯关')).toBeDefined()
    expect(screen.getByText('书写描红')).toBeDefined()
  })
  it('renders quiz card', () => {
    renderHome()
    expect(screen.getByText('小测验')).toBeDefined()
  })
})
