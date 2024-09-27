import { CreateTodolist } from '@/components/create-todolist/create-todolist'
import { Loader } from '@/components/loader/loader'
import { Todolist } from '@/components/todolist/todolist'
import { getSidebarLayout } from '@/layouts/sidebar-layout/sidebar-layout'
import { useGetTodoListsQuery } from '@/service/todolists/todolists-api'
import { clsx } from 'clsx'
import { format, parseISO } from 'date-fns'

import s from './index.module.scss'

function Todolists() {
  const { data: todolists, isLoading: isTodoLoading } = useGetTodoListsQuery()

  return (
    <div>
      {isTodoLoading && <Loader />}
      <div className={s.createTodoWrapper}>
        <CreateTodolist />
      </div>
      <h2 style={{ margin: '20px 0 20px 20px' }}>Новые задачи:</h2>
      <div className={s.todolists}>
        {todolists?.filter(todo => !todo.endDate).map(todo => <Todolist key={todo.id} todo={todo} />)}
      </div>
      <h2 style={{ margin: '20px 0 20px 20px' }}>Запланированные задачи (по срочности):</h2>
      <div className={clsx(s.todolists, s.todolistsPlanned)}>
        {todolists
          ?.filter(todo => todo.endDate)
          .sort((a, b) => {
            const endDateA = a.endDate ? new Date(a.endDate).getTime() : 0
            const endDateB = b.endDate ? new Date(b.endDate).getTime() : 0

            return endDateA - endDateB
          })
          .map(todo => {
            let formattedDate

            if (todo.endDate) {
              const dateObject = parseISO(todo.endDate)

              formattedDate = format(dateObject, 'dd-MM-yyyy (HH:mm)')
            }

            return (
              <div key={todo.id} style={{ alignItems: 'center', display: 'flex', gap: '20px' }}>
                <Todolist endDate={formattedDate} todo={todo} />
                <span>{formattedDate}</span>
              </div>
            )
          })}
      </div>
      <h2 style={{ margin: '20px 0 20px 20px' }}>Выполненные задачи:</h2>
    </div>
  )
}

Todolists.getLayout = getSidebarLayout
export default Todolists
