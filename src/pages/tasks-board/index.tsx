import { useEffect, useState } from 'react'

import { DatesLine } from '@/components/dates-line/dates-line'
import { getSidebarLayout } from '@/layouts/sidebar-layout/sidebar-layout'
import { useGetTodoListsQuery, useUpdateTodolistMutation } from '@/service/todolists/todolists-api'

import s from './dashboard.module.scss'

const addDateKey = (todos: any) => {
  return todos
    .filter((todo: any) => todo.endDate && todo.status !== 1)
    .map((todo: any) => {
      const date = todo.endDate.split('T')[0]

      return {
        ...todo,
        date: date,
      }
    })
}

function TasksBoard() {
  const { data: todolists } = useGetTodoListsQuery()
  const [updateTodolist] = useUpdateTodolistMutation()
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (todolists) {
      setTasks(addDateKey(todolists))
    }
  }, [todolists])

  return (
    <div>
      <h2 className={s.title}>Задачи по датам:</h2>
      <DatesLine setTasks={setTasks} tasks={tasks} updateTodolist={updateTodolist} />
    </div>
  )
}

TasksBoard.getLayout = getSidebarLayout

export default TasksBoard
