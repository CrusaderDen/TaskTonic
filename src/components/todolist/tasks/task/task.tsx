import { ChangeEvent, useState } from 'react'

import { useDeleteTaskMutation, useUpdateTaskMutation } from '@/service/tasks/tasks-api'
import { Button } from '@/shared/lib/ui/button/button'
import { Input } from '@/shared/lib/ui/input/input'

import s from './task.module.scss'

type TaskProps = {
  id: string
  taskId: string
  title: string
}
export const Task = ({ id, taskId, title }: TaskProps) => {
  const [editMode, setEditMode] = useState(false)
  const [newTitle, setNewTitle] = useState(title)

  const [deleteTask] = useDeleteTaskMutation()
  const [updateTask] = useUpdateTaskMutation()

  const handleDeleteTask = async () => {
    await deleteTask({ id, taskId })
  }
  const handleUpdateTask = async (newTitle: string) => {
    const model = {
      deadline: '',
      description: '',
      id,
      order: 0,
      priority: 0,
      startDate: '',
      status: 0,
      taskId,
      title: newTitle,
    }

    await updateTask(model)
    setEditMode(false)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => setNewTitle(e.currentTarget.value)

  const onEditField = editMode ? (
    <Input className={s.editInput} onChange={handleInputChange} value={newTitle} />
  ) : (
    <div>{title}</div>
  )

  const onEditButton = editMode ? (
    <Button onClick={() => handleUpdateTask(newTitle)} variant={'outlined'}>
      Сохранить
    </Button>
  ) : (
    <Button onClick={() => setEditMode(!editMode)} variant={'outlined'}>
      Редактировать
    </Button>
  )

  return (
    <div>
      <div className={s.wrapper}>
        {onEditField}
        <div className={s.buttonsWrapper}>
          {onEditButton}
          <Button onClick={handleDeleteTask} variant={'secondary'}>
            Удалить
          </Button>
        </div>
      </div>
    </div>
  )
}
