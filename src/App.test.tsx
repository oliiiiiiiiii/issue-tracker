import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'

const storedItems = new Map<string, string>()
const localStorageMock: Storage = {
  get length() {
    return storedItems.size
  },
  clear() {
    storedItems.clear()
  },
  getItem(key) {
    return storedItems.get(key) ?? null
  },
  key(index) {
    return Array.from(storedItems.keys())[index] ?? null
  },
  removeItem(key) {
    storedItems.delete(key)
  },
  setItem(key, value) {
    storedItems.set(key, value)
  },
}

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: localStorageMock,
  })
  window.localStorage.clear()
})

afterEach(cleanup)

function storeTasks(tasks: unknown[]) {
  window.localStorage.setItem('issue-tracker-tasks', JSON.stringify(tasks))
}

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

  it('重新載入後仍顯示已新增的任務', () => {
    const { unmount } = render(<App />)

    fireEvent.change(screen.getByRole('textbox', { name: '任務標題' }), {
      target: { value: '修正登入頁面' },
    })
    fireEvent.click(screen.getByRole('button', { name: '新增任務' }))

    expect(screen.getByRole('listitem')).toHaveTextContent('修正登入頁面')

    unmount()
    render(<App />)

    expect(screen.getByRole('listitem')).toHaveTextContent('修正登入頁面')
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

  it('新增任務時預設為待處理', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('textbox', { name: '任務標題' }), {
      target: { value: '新增搜尋' },
    })
    fireEvent.click(screen.getByRole('button', { name: '新增任務' }))

    expect(
      screen.getByRole('combobox', { name: '任務「新增搜尋」狀態' }),
    ).toHaveValue('待處理')
  })

  it('以不分英文大小寫的標題關鍵字搜尋，清除後恢復目前狀態結果', () => {
    storeTasks([
      { id: 1, title: 'Fix login bug', status: '待處理' },
      { id: 2, title: 'BUG in progress', status: '進行中' },
      { id: 3, title: 'Write documentation', status: '待處理' },
    ])
    render(<App />)

    fireEvent.change(screen.getByRole('combobox', { name: '狀態篩選' }), {
      target: { value: '待處理' },
    })
    const searchInput = screen.getByRole('searchbox', { name: '搜尋標題' })
    fireEvent.change(searchInput, { target: { value: 'BUG' } })

    expect(screen.getByText('Fix login bug')).toBeInTheDocument()
    expect(screen.queryByText('BUG in progress')).not.toBeInTheDocument()
    expect(screen.queryByText('Write documentation')).not.toBeInTheDocument()

    fireEvent.change(searchInput, { target: { value: '' } })

    expect(screen.getByText('Fix login bug')).toBeInTheDocument()
    expect(screen.getByText('Write documentation')).toBeInTheDocument()
    expect(screen.queryByText('BUG in progress')).not.toBeInTheDocument()
  })

  it('可依各狀態篩選，選擇全部時顯示所有任務', () => {
    storeTasks([
      { id: 1, title: '規劃', status: '待處理' },
      { id: 2, title: '開發', status: '進行中' },
      { id: 3, title: '上線', status: '已完成' },
    ])
    render(<App />)

    const statusFilter = screen.getByRole('combobox', { name: '狀態篩選' })

    for (const [status, visibleTitle] of [
      ['待處理', '規劃'],
      ['進行中', '開發'],
      ['已完成', '上線'],
    ]) {
      fireEvent.change(statusFilter, { target: { value: status } })
      expect(screen.getAllByRole('listitem')).toHaveLength(1)
      expect(screen.getByText(visibleTitle)).toBeInTheDocument()
    }

    fireEvent.change(statusFilter, { target: { value: '全部' } })
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('搜尋和狀態篩選採 AND，無結果時顯示明確訊息', () => {
    storeTasks([
      { id: 1, title: 'Fix bug', status: '待處理' },
      { id: 2, title: 'Ship feature', status: '已完成' },
    ])
    render(<App />)

    fireEvent.change(screen.getByRole('searchbox', { name: '搜尋標題' }), {
      target: { value: 'bug' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: '狀態篩選' }), {
      target: { value: '已完成' },
    })

    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(screen.getByText('找不到符合條件的任務')).toBeInTheDocument()
  })

  it('可切換任務狀態，重新載入後仍保留', () => {
    storeTasks([{ id: 1, title: '修正錯誤', status: '待處理' }])
    const { unmount } = render(<App />)

    fireEvent.change(
      screen.getByRole('combobox', { name: '任務「修正錯誤」狀態' }),
      { target: { value: '進行中' } },
    )

    expect(
      screen.getByRole('combobox', { name: '任務「修正錯誤」狀態' }),
    ).toHaveValue('進行中')

    unmount()
    render(<App />)

    expect(
      screen.getByRole('combobox', { name: '任務「修正錯誤」狀態' }),
    ).toHaveValue('進行中')
  })

  it('將沒有狀態的舊 localStorage 任務視為待處理並保持可用', () => {
    storeTasks([{ id: 7, title: '舊任務' }])
    render(<App />)

    expect(screen.getByText('舊任務')).toBeInTheDocument()
    expect(
      screen.getByRole('combobox', { name: '任務「舊任務」狀態' }),
    ).toHaveValue('待處理')
  })
})
