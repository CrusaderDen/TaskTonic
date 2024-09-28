import { Tasks } from '@/components/todolist/tasks/tasks'
import { Title } from '@/components/todolist/title/title'
import { todolistServerType } from '@/service/todolists/todolists-api-types'

import s from './todolist.module.scss'

type TodolistProps = {
  addCalendar?: true
  endDate?: string
  todo: todolistServerType
}
export const Todolist = ({ addCalendar, endDate, todo }: TodolistProps) => {
  return (
    <div className={s.wrapper} key={todo.id}>
      <Title addCalendar={addCalendar} endDate={endDate} todo={todo} />
      {/*<Tasks id={todo.id} />*/}
    </div>
  )
}
