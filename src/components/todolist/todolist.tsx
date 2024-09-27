import { Title } from '@/components/todolist/title/title'
import { todolistServerType } from '@/service/todolists/todolists-api-types'

import s from './todolist.module.scss'

type TodolistProps = {
  endDate?: string
  todo: todolistServerType
  withoutEditButtons?: true
}
export const Todolist = ({ endDate, todo, withoutEditButtons }: TodolistProps) => {
  return (
    <div className={s.wrapper} key={todo.id}>
      <Title endDate={endDate} todo={todo} withoutEditButtons={withoutEditButtons} />
      {/*<Tasks id={id} />*/}
    </div>
  )
}
