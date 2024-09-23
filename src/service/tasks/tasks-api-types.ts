export type GetTasksResponse = TaskResponse[]
export type TaskResponse = {
  addedDate: string
  completed: string
  deadline: string
  description: string
  id: string
  order: number
  priority: number
  startDate: string
  status: number
  title: string
}

export type GetTasksArgs = {
  count?: string
  id: string
  page?: string
}

export type CreateTaskArgs = { id: string } & CreateTaskModel
export type CreateTaskModel = {
  deadline: string
  description: string
  order: number
  priority: number
  startDate: string
  status: number
  title: string
}

export type UpdateTaskArgs = { id: string; taskId: string } & UpdateTaskModel

export type UpdateTaskModel = {
  deadline: string
  description: string
  order: number
  priority: number
  startDate: string
  status: number
  title: string
}

export type DeleteTaskArgs = { id: string; taskId: string }

export type DeleteTaskResponse = {
  data: string
  httpCode: number
  messages: string
  resultCode: number
}
