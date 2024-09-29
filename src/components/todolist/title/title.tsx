import { useCallback, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'

import { useDeleteTodolistMutation, useUpdateTodolistMutation } from '@/service/todolists/todolists-api'
import { todolistServerType } from '@/service/todolists/todolists-api-types'
import { Button } from '@/shared/lib/ui/button/button'
import { Input } from '@/shared/lib/ui/input/input'
import * as Popover from '@radix-ui/react-popover'
import { startOfToday, subDays } from 'date-fns'

import s from './title.module.scss'

type TitleProps = {
  addCalendar?: true
  endDate?: string
  todo: todolistServerType
}
export const Title = ({ addCalendar, endDate, todo }: TitleProps) => {
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [startDate, setStartDate] = useState(todo.endDate ? new Date(todo.endDate) : new Date())
  const [updateTodolist] = useUpdateTodolistMutation()
  const [deleteTodolist] = useDeleteTodolistMutation()

  const handleUpdateTodolistTitle = useCallback(async () => {
    const data = { ...todo, title: newTodoTitle }

    await updateTodolist(data).unwrap()
    setNewTodoTitle('')
    setEditMode(false)
  }, [newTodoTitle, todo, updateTodolist])

  const handleDeleteTodolist = async (id: string) => {
    if (!confirm('Удалить задачу?')) {
      return
    }

    await deleteTodolist(id).unwrap()
  }

  const handleReset = useCallback(() => {
    setEditMode(false)
    setNewTodoTitle('')
  }, [])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleReset()
      } else if (event.key === 'Enter' && editMode) {
        void handleUpdateTodolistTitle()
      }
    },
    [editMode, handleReset, handleUpdateTodolistTitle, todo.id]
  )

  const openCalendar = () => {
    setShowCalendar(true)
  }

  const handleDate = async (startDate: any) => {
    setShowCalendar(false)
    const parsedDate = new Date(startDate).toISOString()
    const data = { ...todo, endDate: parsedDate }

    await updateTodolist(data).unwrap()
  }

  const isDateAllowed = (date: any) => {
    const today = startOfToday()
    const yesterday = subDays(today, 1)

    return date >= yesterday
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [editMode, handleKeyDown, newTodoTitle])

  const calendar = (
    <div>
      <DatePicker
        dateFormat={'MMMM d, yyyy h:mm aa'}
        filterDate={isDateAllowed}
        inline
        onChange={(date: any) => {
          setStartDate(date)
        }}
        selected={startDate}
        // showTimeSelect
        // timeCaption={'time'}
        // timeFormat={'HH:mm'}
        // timeIntervals={15}
      />
      <Button fullWidth onClick={() => handleDate(startDate)}>
        Подтвердить время
      </Button>
    </div>
  )

  return (
    <div>
      {!editMode ? (
        <div className={s.commonWrapper}>
          <div className={s.titleWrapper}>
            <span>{todo.title}</span>
            <Button
              className={s.icon}
              onClick={() => setEditMode(true)}
              style={{ fontSize: '12px', left: '-10px', position: 'relative', top: '-7px' }}
              variant={'ghost'}
            >
              ✏️
            </Button>
          </div>
          <div className={s.btnWrapper}>
            <Popover.Root onOpenChange={() => setShowCalendar(!showCalendar)} open={showCalendar}>
              <Popover.Anchor asChild>
                <div>
                  <Popover.Trigger asChild>
                    <button className={s.btnCalendar} onClick={openCalendar} type={'button'}>
                      📅
                    </button>
                  </Popover.Trigger>
                </div>
              </Popover.Anchor>
              <Popover.Portal>
                <Popover.Content className={s.DialogContent} sideOffset={10}>
                  {calendar}
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
            <button className={s.btnTrash} onClick={() => handleDeleteTodolist(todo.id)} type={'button'}>
              🗑️
            </button>
          </div>
        </div>
      ) : (
        <div className={s.commonWrapper}>
          <Input
            onChange={e => setNewTodoTitle(e.target.value)}
            placeholder={'Новое название'}
            value={newTodoTitle}
          ></Input>
          <Button className={s.icon} onClick={handleReset} variant={'ghost'}>
            ❌
          </Button>
          <Button className={s.icon} disabled={!newTodoTitle} onClick={handleUpdateTodolistTitle} variant={'ghost'}>
            ✔️
          </Button>
        </div>
      )}
    </div>
  )
}
