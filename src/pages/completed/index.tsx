import { Todolist } from '@/components/todolist/todolist'
import { getSidebarLayout } from '@/layouts/sidebar-layout/sidebar-layout'
import { useGetTodoListsQuery, useUpdateTodolistMutation } from '@/service/todolists/todolists-api'
import { Button } from '@/shared/lib/ui/button/button'
import { clsx } from 'clsx'

import s from './index.module.scss'

const CompletedPage = () => {
  const { data: todolists } = useGetTodoListsQuery()
  const [updateTodolist] = useUpdateTodolistMutation()
  const handleUpdateTodolistStatus = async (todo: any) => {
    let data

    switch (todo.status) {
      case 0:
        data = { ...todo, status: 1 }
        break
      case 1:
        data = { ...todo, status: 0 }
        break
      default:
        return
    }

    await updateTodolist(data).unwrap()
  }

  return (
    <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ margin: '20px 0 20px 20px' }}>Выполненные задачи:</h2>
      <div className={clsx(s.todolists)}>
        {todolists
          ?.filter(todo => todo.status === 1)
          .map(todo => {
            return (
              <div key={todo.id} style={{ alignItems: 'center', display: 'flex', gap: '20px' }}>
                <Todolist key={todo.id} todo={todo} />
                <Button onClick={() => handleUpdateTodolistStatus(todo)}>Не сделал!</Button>
              </div>
            )
          })}
      </div>
    </div>
  )
}

CompletedPage.getLayout = getSidebarLayout
export default CompletedPage
