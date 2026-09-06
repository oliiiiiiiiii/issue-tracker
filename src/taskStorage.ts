export const taskStatuses = ['待處理', '進行中', '已完成'] as const

export type TaskStatus = (typeof taskStatuses)[number]

export type Task = {
  id: number
  title: string
  status: TaskStatus
}

const TASKS_STORAGE_KEY = 'issue-tracker-tasks'

export function loadTasks(): Task[] {
  const storedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY)

  if (!storedTasks) {
    return []
  }

  try {
    const parsedTasks: unknown = JSON.parse(storedTasks)

    if (!Array.isArray(parsedTasks)) {
      return []
    }

    return parsedTasks.flatMap((task) => {
      if (
        typeof task !== 'object' ||
        task === null ||
        !('id' in task) ||
        typeof task.id !== 'number' ||
        !('title' in task) ||
        typeof task.title !== 'string'
      ) {
        return []
      }

      const status =
        'status' in task &&
        taskStatuses.includes(task.status as TaskStatus)
          ? (task.status as TaskStatus)
          : '待處理'

      return [{ id: task.id, title: task.title, status }]
    })
  } catch {
    return []
  }
}

export function saveTasks(tasks: Task[]) {
  window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
}
