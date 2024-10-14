import { Todolist } from '@/components/todolist/todolist'
import { getSidebarLayout } from '@/layouts/sidebar-layout/sidebar-layout'
import { useGetTodoListsQuery, useUpdateTodolistMutation } from '@/service/todolists/todolists-api'
import { Button } from '@/shared/lib/ui/button/button'
import { dateFormatter } from '@/shared/utils/dateFormatter'
import { dateSorter } from '@/shared/utils/dateSorter'
import { clsx } from 'clsx'

import s from './completed.module.scss'

const CompletedPage = () => {
  const { data: todolists } = useGetTodoListsQuery()
  const [updateTodolist] = useUpdateTodolistMutation()
  const handleUpdateTodolistStatus = async (todo: any) => {
    if (!confirm('Отметить задачу как не выполненную?')) {
      return
    }
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

  const filteredTodo = todolists
    ?.filter(todo => todo.status === 1)
    .sort((a, b) => dateSorter({ a: a.endDate, b: b.endDate, sortType: 'desc' }))

  return (
    <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ margin: '20px 0 20px 20px' }}>Выполненные задачи:</h2>
      <div className={clsx(s.todolists)}>
        {filteredTodo?.map(todo => {
          return (
            <div key={todo.id} style={{ alignItems: 'center', display: 'flex', gap: '20px' }}>
              <div style={{ flex: '0 0 600px' }}>
                <Todolist hideCalendar key={todo.id} todo={todo} />
              </div>
              <div style={{ flex: '0 0 100px', textAlign: 'center' }}>{dateFormatter(todo.endDate)}</div>
              <div style={{ flex: '0 0 200px', textAlign: 'center' }}>
                <Button onClick={() => handleUpdateTodolistStatus(todo)} variant={'secondary'}>
                  Вернуть в работу
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

CompletedPage.getLayout = getSidebarLayout
export default CompletedPage
