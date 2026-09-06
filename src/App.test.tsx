import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('顯示首頁標題與空狀態', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Issue Tracker' })).toBeInTheDocument()
    expect(screen.getByText('目前沒有任務')).toBeInTheDocument()
  })
})
