export type getTodolistsResponse = todolistServerType[]
export type todolistServerType = {
  addedDate: string
  id: string
  order: number
  title: string
}

export type createTodolistArgs = {
  order: number
  title: string
}
export type createTodolistResponse = {
  data: string
  httpCode: number
  messages: string
  resultCode: number
}
export type updateTodolistArgs = {
  id: string
  order: number
  title: string
}
export type updateTodolistResponse = {
  id: string
  order: number
  title: string
}

export type deleteTodolistArgs = string

export type deleteTodolistResponse = {
  data: string
  httpCode: number
  messages: string
  resultCode: number
}
