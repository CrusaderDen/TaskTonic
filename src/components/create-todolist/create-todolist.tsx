import { useState } from 'react'

import { useCreateTodolistMutation } from '@/service/todolists/todolists-api'
import { Button } from '@/shared/lib/ui/button/button'
import { Input } from '@/shared/lib/ui/input/input'

export const CreateTodolist = () => {
  const [todoTitle, setTodoTitle] = useState('')
  const [createTodolist] = useCreateTodolistMutation()

  const handleCreateTodolist = async () => {
    const data = { order: 0, title: todoTitle }

    await createTodolist(data).unwrap()
    setTodoTitle('')
  }

  return (
    <>
      <Input
        onChange={e => setTodoTitle(e.target.value)}
        placeholder={'Название'}
        style={{ width: '200px' }}
        value={todoTitle}
      />
      <Button onClick={handleCreateTodolist} variant={'outlined'}>
        Создать
      </Button>
    </>
  )
}
