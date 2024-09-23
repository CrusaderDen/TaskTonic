import { appApi } from '@/service/app-api'
import {
  createTodolistArgs,
  createTodolistResponse,
  deleteTodolistArgs,
  deleteTodolistResponse,
  getTodolistsResponse,
  updateTodolistArgs,
  updateTodolistResponse,
} from '@/service/todolists/todolists-api-types'

export const todolistsApi = appApi.injectEndpoints({
  endpoints: builder => {
    return {
      createTodolist: builder.mutation<createTodolistResponse, createTodolistArgs>({
        invalidatesTags: ['todolists'],
        query: args => {
          return {
            body: args,
            method: 'POST',
            url: '/todo-lists',
          }
        },
      }),
      deleteTodolist: builder.mutation<deleteTodolistResponse, deleteTodolistArgs>({
        invalidatesTags: ['todolists'],
        query: args => {
          return {
            method: 'DELETE',
            url: `/todo-lists/${args}`,
          }
        },
      }),
      getTodoLists: builder.query<getTodolistsResponse, void>({
        providesTags: ['todolists'],
        query: () => '/todo-lists',
      }),
      updateTodolist: builder.mutation<updateTodolistResponse, updateTodolistArgs>({
        invalidatesTags: ['todolists'],
        query: args => {
          return {
            body: { order: args.order, title: args.title },
            method: 'PUT',
            url: `/todo-lists/${args.id}`,
          }
        },
      }),
    }
  },
})

export const { useCreateTodolistMutation, useDeleteTodolistMutation, useGetTodoListsQuery, useUpdateTodolistMutation } =
  todolistsApi
