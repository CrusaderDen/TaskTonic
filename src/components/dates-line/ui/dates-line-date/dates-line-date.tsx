import { DateTask } from '@/components/dates-line/ui/dates-line-date/date-task/date-task'
import { dateFormatter } from '@/shared/utils/dateFormatter'
import { Droppable } from '@hello-pangea/dnd'
import { clsx } from 'clsx'

import s from './dates-line-date.module.scss'

export const DatesLineDate = ({ date, datesIndex, groupedTasks }: any) => {
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
                  .map((task: any, index: number) => <DateTask index={index} key={task.id.toString()} task={task} />)
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
