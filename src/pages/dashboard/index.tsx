import { useEffect, useState } from 'react'

import { getSidebarLayout } from '@/layouts/sidebar-layout/sidebar-layout'
import { useGetTodoListsQuery, useLazyGetTodoListsQuery } from '@/service/todolists/todolists-api'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'

import s from './index.module.scss'

const testDates = [
  { date: '2024-09-27', id: 1, title: 'Задача 1' },
  { date: '2024-09-27', id: 2, title: 'Задача 2' },
  { date: '2024-09-30', id: 3, title: 'Задача 3' },
  { date: '2024-09-30', id: 4, title: 'Задача 4' },
]

const testTodo = [
  {
    addedDate: '2024-09-27T22:05:43.736615+03:00',
    backgroundColor: '',
    endDate: '2024-09-29T15:40:27+03:00',
    id: '3dbba419-9d39-467a-82be-fa6700ebb801',
    order: 0,
    startDate: null,
    status: 1,
    textColor: '',
    title: 'Сгонять на дачу, слить воду',
  },
  {
    addedDate: '2024-09-27T11:50:40.756878+03:00',
    backgroundColor: '',
    endDate: '2024-10-11T11:50:41+03:00',
    id: '0a606a95-116f-4782-b13e-31829f4a01d6',
    order: 0,
    startDate: null,
    status: 0,
    textColor: '',
    title: 'Стать сеньером',
  },
  {
    addedDate: '2024-09-26T19:56:49.044365+03:00',
    backgroundColor: '',
    endDate: '2024-09-27T11:58:19+03:00',
    id: 'ef9df42c-b916-4b9d-a2d5-d56e59ecd2f5',
    order: 0,
    startDate: null,
    status: 0,
    textColor: '',
    title: 'Сделать понтовый селектор',
  },
]

const addDateKey = (todos: any) => {
  return todos.map((todo: any) => {
    const date = todo.endDate.split('T')[0]

    return {
      ...todo,
      date: date,
    }
  })
}

function Planning() {
  const { data: todolists, isLoading: isTodoLoading } = useGetTodoListsQuery()
  const [tasks, setTasks] = useState([])

  // const [tasks, setTasks] = useState(testDates)

  useEffect(() => {
    if (todolists) {
      setTasks(addDateKey(todolists))
    }
  }, [todolists])

  return (
    <div style={{ width: '5000px' }}>
      <h2 style={{ margin: '20px 0 20px 20px' }}>Таймлайн:</h2>
      <TasksTimeline setTasks={setTasks} tasks={tasks} />
    </div>
  )
}

Planning.getLayout = getSidebarLayout

export default Planning

const TasksTimeline = ({ setTasks, tasks }: any) => {
  const generateDatesForNextMonth = () => {
    const dates = []
    const today = new Date()
    const month = today.getMonth()
    const year = today.getFullYear()

    for (let i = 0; i < 30; i++) {
      const date = new Date(year, month, today.getDate() + i)

      dates.push(date.toISOString().split('T')[0])
    }

    return dates
  }

  const dates = generateDatesForNextMonth()

  // Группируем задачи каждый раз, когда tasks обновляется
  const groupedTasks = tasks.reduce((acc: any, task: any) => {
    const date = task.date

    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(task)

    return acc
  }, {})

  const onDragEnd = (result: any) => {
    const { destination, source } = result

    if (!destination) {
      return
    }

    const sourceDate = source.droppableId
    const destinationDate = destination.droppableId
    const taskId = result.draggableId

    const taskToMove = tasks.find((task: any) => task.id === taskId)

    if (sourceDate === destinationDate) {
      const [removed] = tasks.splice(source.index, 1)

      console.log(source.index)
      const newTasks = [...tasks]

      newTasks.splice(destination.index, 0, removed)
      setTasks(newTasks)

      return
    }

    const updatedSourceTasks = tasks.filter((task: any) => task.id !== taskId)
    const updatedDestinationTasks = { ...taskToMove, date: destinationDate }
    const newArr = [...updatedSourceTasks, updatedDestinationTasks]

    setTasks(newArr)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={s.taskTimelineContainer}>
        <div className={s.taskTimeline}>
          {dates.map(date => (
            <TimelineDate date={date} groupedTasks={groupedTasks} key={date} />
          ))}
        </div>
      </div>
    </DragDropContext>
  )
}

const TimelineDate = ({ date, groupedTasks }: any) => {
  return (
    <Droppable droppableId={date}>
      {provided => (
        <div className={s.dateWrapper} ref={provided.innerRef} {...provided.droppableProps}>
          <h3>{date}</h3>
          <div className={s.taskDate}>
            <div className={s.taskList}>
              {groupedTasks[date] ? (
                groupedTasks[date].map((task: any, index: number) => (
                  <TimelineTodo index={index} key={task.id.toString()} task={task} />
                ))
              ) : (
                <div></div>
              )}
              {provided.placeholder}
            </div>
          </div>
        </div>
      )}
    </Droppable>
  )
}

const TimelineTodo = ({ index, task }: any) => {
  function getStyle(style: any, snapshot: any) {
    if (!snapshot.isDropAnimating) {
      return style
    }

    return {
      ...style,
      // cannot be 0, but make it super tiny
      transitionDuration: `0.001s`,
    }
  }

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          className={s.taskItem}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getStyle(provided.draggableProps.style, snapshot)}
        >
          {task.title}
        </div>
      )}
    </Draggable>
  )
}
