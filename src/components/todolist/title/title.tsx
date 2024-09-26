import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'

import { useDeleteTodolistMutation, useUpdateTodolistMutation } from '@/service/todolists/todolists-api'
import { Button } from '@/shared/lib/ui/button/button'
import { Input } from '@/shared/lib/ui/input/input'
import { CalendarIcon } from '@radix-ui/react-icons'
import * as Popover from '@radix-ui/react-popover'

import s from './title.module.scss'

type TitleProps = {
  id: string
  title: string
  withoutEditButtons?: true
}
export const Title = ({ id, title, withoutEditButtons }: TitleProps) => {
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [updateTodolist] = useUpdateTodolistMutation()
  const [deleteTodolist] = useDeleteTodolistMutation()

  const handleUpdateTodolistTitle = async (id: string) => {
    const data = { id, order: 0, title: newTodoTitle }

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

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleReset()
    } else if (event.key === 'Enter' && editMode) {
      void handleUpdateTodolistTitle(id)
    }
  }

  const openCalendar = () => {
    setShowCalendar(true)
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [editMode, newTodoTitle])

  const calendar = (
    <DatePicker
      dateFormat={'MMMM d, yyyy h:mm aa'}
      inline
      onChange={(date: any) => {
        setStartDate(date)
        alert(date)
      }}
      selected={startDate}
      showTimeSelect
      timeCaption={'time'}
      timeFormat={'HH:mm'}
      timeIntervals={15}
    />
  )

  return (
    <div>
      {!editMode ? (
        <div className={s.wrapper}>
          <span>{title}</span>
          {!withoutEditButtons ? (
            <div className={s.btnWrapper}>
              <Button className={s.icon} onClick={() => setEditMode(true)} variant={'ghost'}>
                ✏️
              </Button>
              <Button className={s.icon} onClick={() => handleDeleteTodolist(id)} variant={'ghost'}>
                🗑️
              </Button>
            </div>
          ) : (
            <Popover.Root>
              <Popover.Trigger asChild>
                <button onClick={openCalendar} style={{ backgroundColor: 'transparent', border: 'none' }}>
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
            onClick={() => handleUpdateTodolistTitle(id)}
            variant={'ghost'}
          >
            ✔️
          </Button>
        </div>
      )}
    </div>
  )
}
