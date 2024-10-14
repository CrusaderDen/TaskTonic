import { appApi } from '@/service/app-api'
import { LoginArgs, LoginResponse, UserArgs, UserResponse, verifyEmailResponse } from '@/service/auth/auth-api-types'

export const authApi = appApi.injectEndpoints({
  endpoints: builder => ({
    createUser: builder.mutation<UserResponse, UserArgs>({
      query: args => {
        return {
          body: args,
          method: 'POST',
          url: '/user',
        }
      },
    }),
    login: builder.mutation<LoginResponse, LoginArgs>({
      query: args => {
        return {
          body: args,
          method: 'POST',
          url: '/login',
        }
      },
    }),
    logout: builder.mutation<LoginResponse, void>({
      query: () => {
        return {
          method: 'POST',
          url: '/logout',
        }
      },
    }),
    me: builder.query<void, void>({ query: () => '/me' }),
    verifyEmail: builder.mutation<verifyEmailResponse, string>({
      query: key => {
        return {
          method: 'POST',
          url: `/verifyEmail/${key}`,
        }
      },
    }),
  }),
})

export const {
  useCreateUserMutation,
  useLazyMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useVerifyEmailMutation,
} = authApi
