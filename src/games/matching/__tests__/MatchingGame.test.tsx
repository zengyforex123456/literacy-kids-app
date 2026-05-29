import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MatchingGame } from '../MatchingGame'

describe('MatchingGame', () => {
  it('should render game title', () => {
    render(
      <MemoryRouter>
        <MatchingGame />
      </MemoryRouter>
    )
    expect(screen.getByText(/配对大闯关/)).toBeDefined()
  })

  it('should render back button', () => {
    render(
      <MemoryRouter>
        <MatchingGame />
      </MemoryRouter>
    )
    expect(screen.getByText('←')).toBeDefined()
  })
})
