import { appApi } from '@/service/app-api'
import { authApi } from '@/service/auth/auth-api'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(appApi.middleware),
  reducer: {
    [appApi.reducerPath]: appApi.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
