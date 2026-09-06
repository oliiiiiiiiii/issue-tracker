import { FormEvent, useEffect, useRef, useState } from 'react'
import { loadTasks, saveTasks, Task } from './taskStorage'

export default function App() {
  const [title, setTitle] = useState('')
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [error, setError] = useState('')
  const nextTaskId = useRef(Math.max(0, ...tasks.map((task) => task.id)) + 1)

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
      { id: nextTaskId.current, title: trimmedTitle },
    ])
    nextTaskId.current += 1
    setTitle('')
    setError('')
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

      {tasks.length === 0 ? (
        <p>目前沒有任務</p>
      ) : (
        <ul aria-label="任務清單">
          {tasks.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      )}
    </main>
  )
}
