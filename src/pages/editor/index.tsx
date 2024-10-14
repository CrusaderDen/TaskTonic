import { CreateTodolist } from '@/components/create-todolist/create-todolist'
import { Loader } from '@/components/loader/loader'
import { Todolist } from '@/components/todolist/todolist'
import { getSidebarLayout } from '@/layouts/sidebar-layout/sidebar-layout'
import { useGetTodoListsQuery, useUpdateTodolistMutation } from '@/service/todolists/todolists-api'
import { getTodolistsResponse, todolistServerType } from '@/service/todolists/todolists-api-types'
import { Button } from '@/shared/lib/ui/button/button'
import { dateFormatter } from '@/shared/utils/dateFormatter'
import { dateSorter } from '@/shared/utils/dateSorter'
import { clsx } from 'clsx'

import s from './index.module.scss'

function Todolists() {
  const { data: todolists, isLoading: isTodoLoading } = useGetTodoListsQuery()
  const [updateTodolist] = useUpdateTodolistMutation()
  const handleUpdateTodolistStatus = async (todo: any) => {
    if (!confirm('Отметить задачу как выполненную?')) {
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

  const renderNewTodolists = (todolists: getTodolistsResponse | undefined) => {
    const todosForRender = todolists ? todolists?.filter(todo => !todo.endDate && todo.status === 0) : []

    return todosForRender.map(todo => <Todolist key={todo.id} todo={todo} />)
  }

  const renderPlanningTodolists = (todolists: getTodolistsResponse | undefined) => {
    const todosForRender = todolists
      ? todolists
          .filter((todo: todolistServerType) => todo.endDate && todo.status === 0)
          .sort((a, b) => dateSorter({ a: a.endDate, b: b.endDate, sortType: 'asc' }))
      : []

    return todosForRender.map(todo => (
      <div key={todo.id} style={{ alignItems: 'center', display: 'flex', gap: '20px' }}>
        <Todolist todo={todo} />
        <span style={{ padding: '0 15px' }}>{dateFormatter(todo.endDate)}</span>
        <Button onClick={() => handleUpdateTodolistStatus(todo)} variant={'secondary'}>
          В выполненные
        </Button>
      </div>
    ))
  }

  return (
    <div>
      {isTodoLoading && <Loader />}
      <div className={s.createTodoWrapper}>
        <CreateTodolist />
      </div>
      <h2 style={{ margin: '50px 0 20px 20px' }}>Новые задачи:</h2>
      <div className={s.todolists}>{renderNewTodolists(todolists)}</div>
      <h2 style={{ margin: '50px 0 20px 20px' }}>Запланированные задачи (по срочности):</h2>
      <div className={clsx(s.todolists, s.todolistsPlanned)}>{renderPlanningTodolists(todolists)}</div>
    </div>
  )
}

Todolists.getLayout = getSidebarLayout
export default Todolists
