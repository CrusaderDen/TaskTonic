import { Tasks } from '@/components/todolist/tasks/tasks'
import { Title } from '@/components/todolist/title/title'
import { TitleChanger } from '@/components/todolist/title-changer/title-changer'

import s from './todolist.module.scss'

type TodolistProps = {
  id: string
  title: string
  withoutEditButtons?: true
}
export const Todolist = ({ id, title, withoutEditButtons }: TodolistProps) => {
  return (
    <div className={s.wrapper} key={id}>
      <Title id={id} title={title} withoutEditButtons={withoutEditButtons} />
      {/*<TitleChanger id={id} />*/}
      {/*<Tasks id={id} />*/}
    </div>
  )
}
