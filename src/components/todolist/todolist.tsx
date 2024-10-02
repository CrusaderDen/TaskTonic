import { Title } from '@/components/todolist/title/title'
import { todolistServerType } from '@/service/todolists/todolists-api-types'

import s from './todolist.module.scss'

type TodolistProps = {
  hideCalendar?: true
  todo: todolistServerType
}
export const Todolist = ({ hideCalendar, todo }: TodolistProps) => {
  return (
    <div className={s.wrapper} key={todo.id}>
      <Title hideCalendar={hideCalendar} todo={todo} />
      {/*<Tasks id={todo.id} />*/}
    </div>
  )
}
