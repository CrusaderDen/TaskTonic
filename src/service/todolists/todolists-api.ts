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
        invalidatesTags: ['editor'],
        query: args => {
          return {
            body: args,
            method: 'POST',
            url: '/todo-lists',
          }
        },
      }),
      deleteTodolist: builder.mutation<deleteTodolistResponse, deleteTodolistArgs>({
        invalidatesTags: ['editor'],
        query: args => {
          return {
            method: 'DELETE',
            url: `/todo-lists/${args}`,
          }
        },
      }),
      getTodoLists: builder.query<getTodolistsResponse, void>({
        providesTags: ['editor'],
        query: () => '/todo-lists',
      }),
      updateTodolist: builder.mutation<updateTodolistResponse, updateTodolistArgs>({
        invalidatesTags: ['editor'],
        query: args => {
          return {
            body: args,
            method: 'PUT',
            url: `/todo-lists/${args.id}`,
          }
        },
      }),
    }
  },
})

export const {
  useCreateTodolistMutation,
  useDeleteTodolistMutation,
  useGetTodoListsQuery,
  useLazyGetTodoListsQuery,
  useUpdateTodolistMutation,
} = todolistsApi
