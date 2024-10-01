import { useEffect, useState } from 'react'

import { getSidebarLayout } from '@/layouts/sidebar-layout/sidebar-layout'
import { useGetTodoListsQuery, useUpdateTodolistMutation } from '@/service/todolists/todolists-api'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'

import s from './index.module.scss'

type GroupedTasks = {
  [key: string]: []
}

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

function Planning() {
  const { data: todolists } = useGetTodoListsQuery()
  const [updateTodolist] = useUpdateTodolistMutation()
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
      <TasksTimeline setTasks={setTasks} tasks={tasks} updateTodolist={updateTodolist} />
    </div>
  )
}

Planning.getLayout = getSidebarLayout

export default Planning

const TasksTimeline = ({ tasks, updateTodolist }: any) => {
  const [groupedTasks, setGroupedTasks] = useState<GroupedTasks>({})
  const generateDatesForNextMonth = () => {
    const dates = []
    const today = new Date()
    const month = today.getMonth()
    const year = today.getFullYear()

    for (let i = 0; i < 30; i++) {
      const date = new Date(year, month, today.getDate() + i)

      dates.push(date.toISOString().split('T')[0])
      // const day = date.getDate()
      // const monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
      // const monthName = monthNames[date.getMonth()]
      // const formattedDate = `${day} ${monthName}`
      //
      // dates.push(formattedDate)
    }

    return dates
  }

  const dates = generateDatesForNextMonth()

  // Группируем задачи каждый раз, когда tasks обновляется
  function groupedTasksFn(tasks: any) {
    return tasks.reduce((acc: any, task: any) => {
      const date = task.date

      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(task)

      return acc
    }, {})
  }

  useEffect(() => {
    setGroupedTasks(groupedTasksFn(tasks))
  }, [tasks])

  const onDragEnd = (result: any) => {
    const { destination, source } = result

    if (!destination) {
      return
    }

    const sourceDate = source.droppableId
    const destinationDate = destination.droppableId
    const taskId = result.draggableId
    const sourceTasks = groupedTasks[sourceDate]

    //вариант, когда перемещение в одной дате
    if (sourceDate === destinationDate) {
      const [removed] = sourceTasks.splice(source.index, 1)

      sourceTasks.splice(destination.index, 0, removed)
      const updatedTasks = sourceTasks.map((task: any, index: any) => ({
        ...task,
        order: index,
      }))

      setGroupedTasks({ ...groupedTasks, [sourceDate]: updatedTasks })

      updatedTasks.forEach((task: any) => {
        updateTodolist(task)
      })

      return
    }

    //вариант, когда перемещение в дату, где еще не было создано задач
    if (!Object.keys(groupedTasks).includes(destinationDate)) {
      const updatedSourceTasks = sourceTasks.splice(source.index, 1)

      setGroupedTasks({ ...groupedTasks, [destinationDate]: updatedSourceTasks, [sourceDate]: sourceTasks })
      const todoForUpdate = tasks.find((task: any) => task.id === taskId)

      updateTodolist({
        ...todoForUpdate,
        endDate: `${destinationDate}T11:29:05.350202+03:00`,
        order: destination.index,
      })

      return
    }

    //вариант, когда перемещение из одной даты в другую, где уже были задачи
    const [removed] = sourceTasks.splice(source.index, 1)
    const destinationTasks = groupedTasks[destinationDate]

    destinationTasks.splice(destination.index, 0, removed)
    const updatedDestinationTasks = destinationTasks.map((task: any, index: any) => ({
      ...task,
      endDate: `${destinationDate}T11:29:05.350202+03:00`,
      order: index,
    }))

    setGroupedTasks({ ...groupedTasks, [destinationDate]: updatedDestinationTasks, [sourceDate]: sourceTasks })

    updatedDestinationTasks.forEach((task: any) => {
      updateTodolist(task)
    })
    sourceTasks.forEach((task: any) => {
      updateTodolist(task)
    })
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
                groupedTasks[date]
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((task: any, index: number) => (
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
