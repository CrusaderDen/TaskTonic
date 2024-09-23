import { useState } from 'react'

import { useUpdateTodolistMutation } from '@/service/todolists/todolists-api'
import { Button } from '@/shared/lib/ui/button/button'
import { Input } from '@/shared/lib/ui/input/input'

import s from './title-changer.module.scss'

type TitleChangerProps = {
  id: string
}
export const TitleChanger = ({ id }: TitleChangerProps) => {
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [updateTodolist] = useUpdateTodolistMutation()

  const handleUpdateTodolistTitle = async (id: string) => {
    const data = { id, order: 0, title: newTodoTitle }

    await updateTodolist(data).unwrap()
    setNewTodoTitle('')
  }

  return (
    <div className={s.wrapper}>
      <Input onChange={e => setNewTodoTitle(e.target.value)} placeholder={'changeTitle'} value={newTodoTitle}></Input>
      <Button onClick={() => handleUpdateTodolistTitle(id)} variant={'ghost'}>
        OK
      </Button>
    </div>
  )
}
