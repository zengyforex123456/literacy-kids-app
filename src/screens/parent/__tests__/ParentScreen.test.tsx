import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ParentScreen } from '../ParentScreen'

describe('ParentScreen', () => {
  it('should show PIN gate initially', () => {
    render(
      <MemoryRouter>
        <ParentScreen />
      </MemoryRouter>
    )
    expect(screen.getByText('请输入家长密码')).toBeDefined()
  })

  it('should have numeric keypad', () => {
    render(
      <MemoryRouter>
        <ParentScreen />
      </MemoryRouter>
    )
    expect(screen.getByText('1')).toBeDefined()
    expect(screen.getByText('5')).toBeDefined()
    expect(screen.getByText('9')).toBeDefined()
  })
})
