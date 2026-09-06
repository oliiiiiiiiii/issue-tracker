export type Task = {
  id: number
  title: string
}

const TASKS_STORAGE_KEY = 'issue-tracker-tasks'

export function loadTasks(): Task[] {
  const storedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY)

  if (!storedTasks) {
    return []
  }

  try {
    const parsedTasks: unknown = JSON.parse(storedTasks)

    return Array.isArray(parsedTasks) ? parsedTasks : []
  } catch {
    return []
  }
}

export function saveTasks(tasks: Task[]) {
  window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
}
