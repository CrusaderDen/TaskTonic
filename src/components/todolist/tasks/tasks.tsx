import { ChangeEvent, useState } from 'react'

import { Task } from '@/components/todolist/tasks/task/task'
import { useCreateTaskMutation, useGetTasksQuery } from '@/service/tasks/tasks-api'
import { CreateTaskArgs } from '@/service/tasks/tasks-api-types'
import { Button } from '@/shared/lib/ui/button/button'
import { Input } from '@/shared/lib/ui/input/input'

import s from './tasks.module.scss'

type TasksProps = {
  id: string
}
export const Tasks = ({ id }: TasksProps) => {
  const { data: tasks } = useGetTasksQuery(id)
  const [createTask] = useCreateTaskMutation()
  const [taskTitle, setTaskTitle] = useState('')

  const handleCreateTask = async () => {
    const model: CreateTaskArgs = {
      deadline: '',
      description: '',
      id,
      order: 0,
      priority: 0,
      startDate: '',
      status: 0,
      title: taskTitle,
    }

    await createTask(model).unwrap()

    setTaskTitle('')
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => setTaskTitle(e.currentTarget.value)

  return (
    <div className={s.wrapper}>
      <div className={s.title}> Таски</div>
      <div className={s.inputTask}>
        <Input onChange={handleInputChange} placeholder={'Введите задачу'} value={taskTitle} />
        <Button onClick={handleCreateTask} variant={'secondary'}>
          OK
        </Button>
      </div>
      <div className={s.tasksWrapper}>
        {tasks?.map(task => <Task id={id} key={task.id} taskId={task.id} title={task.title} />)}
      </div>
    </div>
  )
}
