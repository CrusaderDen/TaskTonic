import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { useCreateTodolistMutation } from '@/service/todolists/todolists-api'
import { Input } from '@/shared/lib/ui/input/input'

import s from './create-todolist.module.scss'

export const CreateTodolist = () => {
  const [todoTitle, setTodoTitle] = useState('')
  const [createTodolist] = useCreateTodolistMutation()
  const { handleSubmit } = useForm()

  const handleCreateTodolist = async () => {
    const data = { order: 0, title: todoTitle }

    await createTodolist(data).unwrap()
    setTodoTitle('')
  }

  return (
    <form className={s.wrapper} onSubmit={handleSubmit(handleCreateTodolist)}>
      <Input
        className={s.input}
        onChange={e => setTodoTitle(e.target.value)}
        placeholder={'Создать задачу'}
        value={todoTitle}
      />
      <button className={s.btn} type={'submit'}>
        +
      </button>
    </form>
  )
}
