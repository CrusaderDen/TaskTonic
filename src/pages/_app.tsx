import type { AppProps } from 'next/app'

import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import { store } from '@/service/store'
import { ThemeProvider } from 'next-themes'

import '@/styles/_colors.scss'
import '@/styles/_typography.scss'
import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <ThemeProvider themes={['light', 'dark', 'gray']}>
          <Component {...pageProps} />
        </ThemeProvider>
      </Provider>
      <ToastContainer />
    </>
  )
}
