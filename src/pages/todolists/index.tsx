import { CreateTodolist } from '@/components/create-todolist/create-todolist'
import { Todolist } from '@/components/todolist/todolist'
import { useLogoutMutation } from '@/service/auth/auth-api'
import { useGetTodoListsQuery } from '@/service/todolists/todolists-api'
import { Button } from '@/shared/lib/ui/button/button'
import { useRouter } from 'next/router'

import s from './index.module.scss'

export default function Todolists() {
  const router = useRouter()
  const [getLogout] = useLogoutMutation()
  const { data: todolists } = useGetTodoListsQuery()

  const handleLogout = async () => {
    await getLogout()
      .unwrap()
      .then(() => void router.push('/login'))
  }

  return (
    <>
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
