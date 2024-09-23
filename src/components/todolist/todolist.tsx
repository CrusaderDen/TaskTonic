import { Tasks } from '@/components/todolist/tasks/tasks'
import { Title } from '@/components/todolist/title/title'
import { TitleChanger } from '@/components/todolist/title-changer/title-changer'

import s from './todolist.module.scss'

type TodolistProps = {
  id: string
  title: string
}
export const Todolist = ({ id, title }: TodolistProps) => {
  return (
    <div className={s.wrapper} key={id}>
      <Title id={id} title={title} />
      <TitleChanger id={id} />
      <Tasks id={id} />
    </div>
  )
}
