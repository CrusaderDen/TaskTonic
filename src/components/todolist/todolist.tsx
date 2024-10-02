import { Title } from '@/components/todolist/title/title'
import { todolistServerType } from '@/service/todolists/todolists-api-types'

import s from './todolist.module.scss'

type TodolistProps = {
  endDate?: string
  hideCalendar?: true
  todo: todolistServerType
}
export const Todolist = ({ endDate, hideCalendar, todo }: TodolistProps) => {
  return (
    <div className={s.wrapper} key={todo.id}>
      <Title endDate={endDate} hideCalendar={hideCalendar} todo={todo} />
      {/*<Tasks id={todo.id} />*/}
    </div>
  )
}
