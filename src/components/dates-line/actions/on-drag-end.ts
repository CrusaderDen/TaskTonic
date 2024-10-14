import { DropResult } from '@hello-pangea/dnd'

export const onDragEnd = (
  result: DropResult,
  groupedTasks: any,
  setGroupedTasks: (tasks: any) => void,
  tasks: any,
  updateTodolist: (task: any) => void
) => {
  const { destination, source } = result

  if (!destination) {
    return
  }

  const sourceDate = source.droppableId
  const destinationDate = destination.droppableId
  const taskId = result.draggableId
  const sourceTasks = groupedTasks[sourceDate]

  // Вариант, когда перемещение в одной дате
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

  // Вариант, когда перемещение в дату, где еще не было создано задач
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

  // Вариант, когда перемещение из одной даты в другую, где уже были задачи
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
