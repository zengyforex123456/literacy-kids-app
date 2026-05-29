import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ReportScreen } from '../ReportScreen'

describe('ReportScreen', () => {
  it('should render weekly summary', () => {
    render(<MemoryRouter><ReportScreen /></MemoryRouter>)
    expect(screen.getByText(/本周学习总结/)).toBeDefined()
  })

  it('should render weak areas', () => {
    render(<MemoryRouter><ReportScreen /></MemoryRouter>)
    expect(screen.getByText(/需要加强/)).toBeDefined()
    expect(screen.getByText('动物')).toBeDefined()
  })

  it('should render suggestions', () => {
    render(<MemoryRouter><ReportScreen /></MemoryRouter>)
    expect(screen.getByText(/建议复习/)).toBeDefined()
    expect(screen.getByText(/elephant/)).toBeDefined()
  })
})
