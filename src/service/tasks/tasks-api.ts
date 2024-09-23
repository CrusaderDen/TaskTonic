import { appApi } from '@/service/app-api'
import {
  CreateTaskArgs,
  CreateTaskModel,
  DeleteTaskArgs,
  DeleteTaskResponse,
  GetTasksResponse,
  UpdateTaskArgs,
} from '@/service/tasks/tasks-api-types'
import {
  createTodolistArgs,
  createTodolistResponse,
  deleteTodolistArgs,
  deleteTodolistResponse,
  getTodolistsResponse,
  updateTodolistArgs,
  updateTodolistResponse,
} from '@/service/todolists/todolists-api-types'

export const tasksApi = appApi.injectEndpoints({
  endpoints: builder => {
    return {
      createTask: builder.mutation<CreateTaskModel, CreateTaskArgs>({
        invalidatesTags: ['tasks'],
        query: args => {
          const { id, ...model } = args

          return {
            body: model,
            method: 'POST',
            url: `/todo-lists/${id}/tasks`,
          }
        },
      }),
      deleteTask: builder.mutation<DeleteTaskResponse, DeleteTaskArgs>({
        invalidatesTags: ['tasks'],
        query: args => {
          return {
            method: 'DELETE',
            url: `/todo-lists/${args.id}/tasks/${args.taskId}`,
          }
        },
      }),
      getTasks: builder.query<GetTasksResponse, string>({
        providesTags: ['tasks'],
        query: arg => `/todo-lists/${arg}/tasks`,
      }),
      updateTask: builder.mutation<updateTodolistResponse, UpdateTaskArgs>({
        invalidatesTags: ['tasks'],
        query: args => {
          const { id, taskId, ...model } = args

          return {
            body: model,
            method: 'PUT',
            url: `/todo-lists/${args.id}/tasks/${args.taskId}`,
          }
        },
      }),
    }
  },
})

export const { useCreateTaskMutation, useDeleteTaskMutation, useGetTasksQuery, useUpdateTaskMutation } = tasksApi
