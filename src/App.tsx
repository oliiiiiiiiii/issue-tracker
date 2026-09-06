import { FormEvent, useEffect, useRef, useState } from 'react'
import {
  loadTasks,
  saveTasks,
  Task,
  TaskStatus,
  taskStatuses,
} from './taskStorage'

type StatusFilter = '全部' | TaskStatus

export default function App() {
  const [title, setTitle] = useState('')
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('全部')
  const nextTaskId = useRef(Math.max(0, ...tasks.map((task) => task.id)) + 1)

  const normalizedQuery = searchQuery.toLocaleLowerCase()
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLocaleLowerCase().includes(normalizedQuery) &&
      (statusFilter === '全部' || task.status === statusFilter),
  )

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      setError('請輸入任務標題')
      return
    }

    setTasks((currentTasks) => [
      ...currentTasks,
      { id: nextTaskId.current, title: trimmedTitle, status: '待處理' },
    ])
    nextTaskId.current += 1
    setTitle('')
    setError('')
  }

  function updateTaskStatus(taskId: number, status: TaskStatus) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status } : task,
      ),
    )
  }

  function deleteTask(task: Task) {
    if (!window.confirm(`確定要刪除任務「${task.title}」嗎？`)) {
      return
    }

    setTasks((currentTasks) =>
      currentTasks.filter((currentTask) => currentTask.id !== task.id),
    )
  }

  return (
    <main>
      <h1>Issue Tracker</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="task-title">任務標題</label>
        <div className="task-entry">
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              setError('')
            }}
            aria-describedby={error ? 'task-title-error' : undefined}
            aria-invalid={Boolean(error)}
          />
          <button type="submit">新增任務</button>
        </div>
        {error && (
          <p id="task-title-error" className="error" role="alert">
            {error}
          </p>
        )}
      </form>

      <section className="list-controls" aria-label="任務清單篩選">
        <div>
          <label htmlFor="task-search">搜尋標題</label>
          <input
            id="task-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="status-filter">狀態篩選</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
          >
            <option value="全部">全部</option>
            {taskStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </section>

      {tasks.length === 0 ? (
        <p>目前沒有任務</p>
      ) : filteredTasks.length === 0 ? (
        <p>找不到符合條件的任務</p>
      ) : (
        <ul aria-label="任務清單">
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <span>{task.title}</span>
              <div className="task-actions">
                <label>
                  <span className="visually-hidden">任務「{task.title}」狀態</span>
                  <select
                    value={task.status}
                    onChange={(event) =>
                      updateTaskStatus(task.id, event.target.value as TaskStatus)
                    }
                  >
                    {taskStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="delete-button"
                  type="button"
                  onClick={() => deleteTask(task)}
                  aria-label={`刪除任務「${task.title}」`}
                >
                  刪除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
