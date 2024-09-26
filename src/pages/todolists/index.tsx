import { CreateTodolist } from '@/components/create-todolist/create-todolist'
import { Loader } from '@/components/loader/loader'
import { Todolist } from '@/components/todolist/todolist'
import { getSidebarLayout } from '@/layouts/sidebar-layout/sidebar-layout'
import { useGetTodoListsQuery } from '@/service/todolists/todolists-api'

import s from './index.module.scss'

function Todolists() {
  const { data: todolists, isLoading: isTodoLoading } = useGetTodoListsQuery()

  return (
    <div>
      {isTodoLoading && <Loader />}
      <div className={s.createTodoWrapper}>
        <CreateTodolist />
      </div>
      <h2 style={{ margin: '20px 0 20px 20px' }}>Незапланированные задачи:</h2>
      <div className={s.todolists}>
        {todolists?.map(todo => <Todolist id={todo.id} key={todo.id} title={todo.title} />)}
      </div>
      <h2 style={{ margin: '20px 0 20px 20px' }}>Запланированные задачи:</h2>
      <div className={s.todolists}>
        {todolists
          ?.filter(todo => todo.endDate)
          .map(todo => <Todolist id={todo.id} key={todo.id} title={todo.title} />)}
      </div>
    </div>
  )
}

Todolists.getLayout = getSidebarLayout
export default Todolists
