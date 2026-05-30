import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HomeScreen } from '../HomeScreen'

function renderHome() { return render(<MemoryRouter><HomeScreen /></MemoryRouter>) }

describe('HomeScreen', () => {
  it('renders title', () => {
    renderHome()
    expect(screen.getByText(/Magic Forest/)).toBeDefined()
  })
  it('renders game cards', () => {
    renderHome()
    expect(screen.getByText('Forest Quest')).toBeDefined()
    expect(screen.getByText('Bubble Pop')).toBeDefined()
  })
  it('renders nav items', () => {
    renderHome()
    const homes = screen.getAllByText('Home')
    expect(homes.length).toBeGreaterThanOrEqual(1)
  })
  it('shows streak', () => {
    renderHome()
    expect(screen.getByText(/Fire/)).toBeDefined()
  })
})
