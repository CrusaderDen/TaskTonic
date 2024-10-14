import { useEffect, useState } from 'react'

import { dateFormatter } from '@/shared/utils/dateFormatter'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { clsx } from 'clsx'

import s from './date-line.module.scss'

type GroupedTasks = {
  [key: string]: []
}

const generateDatesForNextMonth = () => {
  const dates = []
  const today = new Date()
  const month = today.getMonth()
  const year = today.getFullYear()

  for (let i = 0; i < 30; i++) {
    dates.push(new Date(year, month, today.getDate() + i).toISOString().split('T')[0])
  }

  return dates
}

export const TasksTimeline = ({ className, tasks, updateTodolist }: any) => {
  const [groupedTasks, setGroupedTasks] = useState<GroupedTasks>({})

  const dates = generateDatesForNextMonth()

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

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault()
    const scrollAmount = event.deltaY
    const container = document.querySelector(`.${s.taskTimelineContainer}`)

    if (container) {
      container.scrollLeft += scrollAmount
    }
  }

  useEffect(() => {
    const container = document.querySelector(`.${s.taskTimelineContainer}`)

    if (container) {
      container.addEventListener('wheel', handleWheel as any)
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel as any)
      }
    }
  }, [])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={clsx(s.taskTimelineContainer, className)}>
        {dates.map((date, datesIndex) => (
          <TimelineDate date={date} datesIndex={datesIndex} groupedTasks={groupedTasks} key={date} />
        ))}
      </div>
    </DragDropContext>
  )
}

const TimelineDate = ({ date, datesIndex, groupedTasks }: any) => {
  const yesterday = datesIndex === 0

  return (
    <Droppable droppableId={date}>
      {provided => (
        <div className={s.dateWrapper} ref={provided.innerRef} {...provided.droppableProps}>
          <h3>{yesterday ? `${dateFormatter(date)} (вчера)` : dateFormatter(date)}</h3>
          <div className={yesterday ? clsx(s.taskDate, s.taskDateYesterday) : s.taskDate}>
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
