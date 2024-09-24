import { useDeleteTodolistMutation } from '@/service/todolists/todolists-api'
import { Button } from '@/shared/lib/ui/button/button'

import s from './title.module.scss'

type TitleProps = {
  id: string
  title: string
}
export const Title = ({ id, title }: TitleProps) => {
  const [deleteTodolist] = useDeleteTodolistMutation()

  const handleDeleteTodolist = async (id: string) => {
    await deleteTodolist(id).unwrap()
  }

  return (
    <div className={s.wrapper}>
      <h3>{title}</h3>
      <Button onClick={() => handleDeleteTodolist(id)} variant={'outlined'}>
        Удалить лист
      </Button>
    </div>
  )
}
