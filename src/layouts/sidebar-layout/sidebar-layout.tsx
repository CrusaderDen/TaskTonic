import { PropsWithChildren, ReactElement, useEffect, useState } from 'react'

import { Loader } from '@/components/loader/loader'
import { useLogoutMutation } from '@/service/auth/auth-api'
import { Button } from '@/shared/lib/ui/button/button'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'

import s from './sidebar-layout.module.scss'

export const SidebarLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter()
  const [getLogout, { isLoading: isLogoutLoading }] = useLogoutMutation()
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleLogout = async () => {
    await getLogout()
      .unwrap()
      .then(() => void router.push('/login'))
  }

  return (
    <>
      {isLogoutLoading && <Loader />}
      <div className={s.main}>
        <nav className={s.navbar}>
          <select className={s.themeSelector} onChange={e => setTheme(e.target.value)} value={theme}>
            <option value={'light'}>Светлая</option>
            <option value={'gray'}>Серая</option>
            <option value={'dark'}>Темная</option>
          </select>
          <ul className={s.navList}>
            <li>
              <Link href={'/todolists'}>Задачи</Link>
            </li>
            <li>
              <Link href={'/planning'}>Планирование</Link>
            </li>
          </ul>
          <Button className={s.logout} onClick={handleLogout} variant={'outlined'}>
            Logout
          </Button>
        </nav>
        {children}
      </div>
    </>
  )
}

export const getSidebarLayout = (page: ReactElement) => <SidebarLayout>{page}</SidebarLayout>
