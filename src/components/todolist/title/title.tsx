import { useCallback, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'

import { useDeleteTodolistMutation, useUpdateTodolistMutation } from '@/service/todolists/todolists-api'
import { todolistServerType } from '@/service/todolists/todolists-api-types'
import { Button } from '@/shared/lib/ui/button/button'
import { Input } from '@/shared/lib/ui/input/input'
import { CalendarIcon } from '@radix-ui/react-icons'
import * as Popover from '@radix-ui/react-popover'

import s from './title.module.scss'

type TitleProps = {
  endDate?: string
  todo: todolistServerType
  withoutEditButtons?: true
}
export const Title = ({ endDate, todo, withoutEditButtons }: TitleProps) => {
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [updateTodolist] = useUpdateTodolistMutation()
  const [deleteTodolist] = useDeleteTodolistMutation()

  const handleUpdateTodolistTitle = async (id: string) => {
    const data = { ...todo, title: newTodoTitle }

    await updateTodolist(data).unwrap()
    setNewTodoTitle('')
    setEditMode(false)
  }

  const handleDeleteTodolist = async (id: string) => {
    await deleteTodolist(id).unwrap()
  }

  const handleReset = () => {
    setEditMode(false)
    setNewTodoTitle('')
  }

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleReset()
      } else if (event.key === 'Enter' && editMode) {
        void handleUpdateTodolistTitle(todo.id)
      }
    },
    [editMode, handleReset, handleUpdateTodolistTitle, todo.id]
  )

  const openCalendar = () => {
    setShowCalendar(true)
  }

  const handleDate = async (startDate: any) => {
    const parsedDate = new Date(startDate).toISOString()
    const data = { ...todo, endDate: parsedDate }

    await updateTodolist(data).unwrap()
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
        inline
        onChange={(date: any) => {
          setStartDate(date)
        }}
        selected={startDate}
        showTimeSelect
        timeCaption={'time'}
        timeFormat={'HH:mm'}
        timeIntervals={15}
      />
      <Button fullWidth onClick={() => handleDate(startDate)}>
        Подтвердить время
      </Button>
    </div>
  )

  return (
    <div>
      {!editMode ? (
        <div className={s.wrapper}>
          <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
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
          {!withoutEditButtons ? (
            <div className={s.btnWrapper}>
              <Button className={s.icon} onClick={() => handleDeleteTodolist(todo.id)} variant={'ghost'}>
                🗑️
              </Button>
            </div>
          ) : (
            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  onClick={openCalendar}
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                  type={'button'}
                >
                  <CalendarIcon />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content className={s.DialogContent}>{calendar}</Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          )}
        </div>
      ) : (
        <div className={s.wrapper}>
          <Input
            onChange={e => setNewTodoTitle(e.target.value)}
            placeholder={'Новое название'}
            value={newTodoTitle}
          ></Input>
          <Button className={s.icon} onClick={handleReset} variant={'ghost'}>
            ❌
          </Button>
          <Button
            className={s.icon}
            disabled={!newTodoTitle}
            onClick={() => handleUpdateTodolistTitle(todo.id)}
            variant={'ghost'}
          >
            ✔️
          </Button>
        </div>
      )}
    </div>
  )
}
