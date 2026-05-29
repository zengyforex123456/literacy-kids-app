import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BubblePopGame } from '../BubblePopGame'

describe('BubblePopGame', () => {
  it('should render game title', () => {
    render(
      <MemoryRouter>
        <BubblePopGame />
      </MemoryRouter>
    )
    expect(screen.getByText(/泡泡大作战/)).toBeDefined()
  })

  it('should render back button', () => {
    render(
      <MemoryRouter>
        <BubblePopGame />
      </MemoryRouter>
    )
    expect(screen.getByText('←')).toBeDefined()
  })

  it('should show score', () => {
    render(
      <MemoryRouter>
        <BubblePopGame />
      </MemoryRouter>
    )
    const elements = screen.getAllByText(/⭐/)
    expect(elements.length).toBeGreaterThan(0)
  })
})
