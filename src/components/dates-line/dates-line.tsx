import { useEffect, useState } from 'react'

import { generateDatesForNextMonth } from '@/components/dates-line/actions/generate-dates'
import { onDragEnd } from '@/components/dates-line/actions/on-drag-end'
import { useWheelScroll } from '@/components/dates-line/actions/use-wheel-scroll'
import { DatesLineDate } from '@/components/dates-line/ui/dates-line-date/dates-line-date'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { clsx } from 'clsx'

import s from './dates-line.module.scss'

type GroupedTasks = {
  [key: string]: []
}

export const DatesLine = ({ className, tasks, updateTodolist }: any) => {
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

  const handleDragEnd = (result: DropResult) => {
    onDragEnd(result, groupedTasks, setGroupedTasks, tasks, updateTodolist)
  }

  useWheelScroll(`.${s.taskTimelineContainer}`)

  useEffect(() => {
    setGroupedTasks(groupedTasksFn(tasks))
  }, [tasks])

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={clsx(s.taskTimelineContainer, className)}>
        {dates.map((date, datesIndex) => (
          <DatesLineDate date={date} datesIndex={datesIndex} groupedTasks={groupedTasks} key={date} />
        ))}
      </div>
    </DragDropContext>
  )
}
