import { useEffect, useState } from 'react'

import { CreateTodolist } from '@/components/create-todolist/create-todolist'
import { Loader } from '@/components/loader/loader'
import { Todolist } from '@/components/todolist/todolist'
import { useLogoutMutation } from '@/service/auth/auth-api'
import { useGetTodoListsQuery } from '@/service/todolists/todolists-api'
import { Button } from '@/shared/lib/ui/button/button'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'

import s from './index.module.scss'

export default function Todolists() {
  const router = useRouter()
  const [getLogout, { isLoading: isLogoutLoading }] = useLogoutMutation()
  const { data: todolists, isLoading: isTodoLoading } = useGetTodoListsQuery()
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const handleLogout = async () => {
    await getLogout()
      .unwrap()
      .then(() => void router.push('/login'))
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <select className={s.themeSelector} onChange={e => setTheme(e.target.value)} value={theme}>
        <option value={'light'}>Светлая</option>
        <option value={'gray'}>Серая</option>
        <option value={'dark'}>Темная</option>
      </select>
      {(isLogoutLoading || isTodoLoading) && <Loader />}
      <Button className={s.logout} onClick={handleLogout} variant={'outlined'}>
        Logout
      </Button>
      <div className={s.createTodoWrapper}>
        <h1>Тудулисты:</h1>
        <CreateTodolist />
      </div>
      <div className={s.todolists}>
        {todolists?.map(todo => <Todolist id={todo.id} key={todo.id} title={todo.title} />)}
      </div>
    </>
  )
}
