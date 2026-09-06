import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'

afterEach(cleanup)

describe('App', () => {
  it('顯示首頁標題與空狀態', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Issue Tracker' })).toBeInTheDocument()
    expect(screen.getByText('目前沒有任務')).toBeInTheDocument()
  })

  it('讓使用者輸入任務標題', () => {
    render(<App />)

    const titleInput = screen.getByRole('textbox', { name: '任務標題' })
    fireEvent.change(titleInput, { target: { value: '撰寫測試' } })

    expect(titleInput).toHaveValue('撰寫測試')
  })

  it('新增去除前後空白的任務並清空輸入欄位', () => {
    render(<App />)

    const titleInput = screen.getByRole('textbox', { name: '任務標題' })
    fireEvent.change(titleInput, { target: { value: '  修正登入頁面  ' } })
    fireEvent.click(screen.getByRole('button', { name: '新增任務' }))

    expect(screen.getByRole('list', { name: '任務清單' })).toBeInTheDocument()
    expect(screen.getByRole('listitem')).toHaveTextContent('修正登入頁面')
    expect(screen.queryByText('目前沒有任務')).not.toBeInTheDocument()
    expect(titleInput).toHaveValue('')
  })

  it('拒絕空白標題並顯示可理解的驗證訊息', () => {
    render(<App />)

    const titleInput = screen.getByRole('textbox', { name: '任務標題' })
    fireEvent.change(titleInput, { target: { value: '   ' } })
    fireEvent.click(screen.getByRole('button', { name: '新增任務' }))

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    expect(screen.getByText('目前沒有任務')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('請輸入任務標題')
  })
})
