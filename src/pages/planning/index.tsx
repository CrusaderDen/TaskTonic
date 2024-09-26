import { Todolist } from '@/components/todolist/todolist'
import { getSidebarLayout } from '@/layouts/sidebar-layout/sidebar-layout'
import { useGetTodoListsQuery } from '@/service/todolists/todolists-api'

import s from '@/pages/todolists/index.module.scss'

function Planning() {
  const { data: todolists, isLoading: isTodoLoading } = useGetTodoListsQuery()

  return (
    <div className={s.wrapper}>
      <h2 style={{ margin: '20px 0 20px 20px' }}>Задачи на планирование: </h2>
      <div className={s.todolists}>
        {todolists
          ?.filter(todo => !todo.endDate)
          .map(todo => <Todolist id={todo.id} key={todo.id} title={todo.title} withoutEditButtons />)}
      </div>
    </div>
  )
}

Planning.getLayout = getSidebarLayout

export default Planning
