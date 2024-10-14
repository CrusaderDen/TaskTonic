import { PropsWithChildren, ReactElement, useEffect, useState } from 'react'

import { Loader } from '@/components/loader/loader'
import { useLogoutMutation } from '@/service/auth/auth-api'
import { Button } from '@/shared/lib/ui/button/button'
import { clsx } from 'clsx'
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
      <main className={s.main}>
        <aside className={s.aside}>
          <nav className={s.navbar}>
            <ul className={s.navList}>
              <li className={router.pathname === '/editor' ? clsx(s.listItemActive, s.listItem) : s.listItem}>
                <Link
                  className={router.pathname === '/editor' ? clsx(s.linkActive, s.linkBtn) : s.linkBtn}
                  href={'/editor'}
                >
                  Редактор задач
                </Link>
              </li>
              <li className={router.pathname === '/tasks-board' ? clsx(s.listItemActive, s.listItem) : s.listItem}>
                <Link
                  className={router.pathname === '/tasks-board' ? clsx(s.linkActive, s.linkBtn) : s.linkBtn}
                  href={'/tasks-board'}
                >
                  Доска задач
                </Link>
              </li>
              <li className={router.pathname === '/completed' ? clsx(s.listItemActive, s.listItem) : s.listItem}>
                <Link
                  className={router.pathname === '/completed' ? clsx(s.linkActive, s.linkBtn) : s.linkBtn}
                  href={'/completed'}
                >
                  Выполненные <br />
                  задачи
                </Link>
              </li>
            </ul>
          </nav>
          <div className={s.lowGroup}>
            <select className={s.selector} onChange={e => setTheme(e.target.value)} value={theme}>
              <option value={'light'}>Светлая</option>
              <option value={'dark'}>Темная</option>
            </select>
            <Button className={s.logout} onClick={handleLogout} variant={'outlined'}>
              Выйти
            </Button>
          </div>
        </aside>
        {children}
      </main>
    </>
  )
}

export const getSidebarLayout = (page: ReactElement) => <SidebarLayout>{page}</SidebarLayout>
