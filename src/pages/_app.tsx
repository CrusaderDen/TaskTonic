import type { AppProps } from 'next/app'

import { ReactElement, ReactNode } from 'react'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import { store } from '@/service/store'
import { NextPage } from 'next'
import { ThemeProvider } from 'next-themes'

import '@/styles/_colors.scss'
import '@/styles/_typography.scss'
import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-datepicker/dist/react-datepicker.css'

export type NextPageWithLayout<P = {}, IP = P> = {
  getLayout?: (page: ReactElement) => ReactNode
} & NextPage<P, IP>

type AppPropsWithLayout = {
  Component: NextPageWithLayout
} & AppProps

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page)

  return (
    <>
      <Provider store={store}>
        <ThemeProvider defaultTheme={'dark'} themes={['light', 'dark']}>
          <ToastContainer />
          {getLayout(<Component {...pageProps} />)}
        </ThemeProvider>
      </Provider>
    </>
  )
}
