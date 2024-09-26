import { useEffect, useState } from 'react'

import { CreateTodolist } from '@/components/create-todolist/create-todolist'
import { Loader } from '@/components/loader/loader'
import { Todolist } from '@/components/todolist/todolist'
import { getSidebarLayout } from '@/layouts/sidebar-layout/sidebar-layout'
import { useGetTodoListsQuery } from '@/service/todolists/todolists-api'
import { useTheme } from 'next-themes'

import s from './index.module.scss'

function Todolists() {
  const { data: todolists, isLoading: isTodoLoading } = useGetTodoListsQuery()

  return (
    <div>
      {isTodoLoading && <Loader />}

      <div className={s.createTodoWrapper}>
        <h1>Тудулисты:</h1>
        <CreateTodolist />
      </div>
      <div className={s.todolists}>
        {todolists?.map(todo => <Todolist id={todo.id} key={todo.id} title={todo.title} />)}
      </div>
    </div>
  )
}

Todolists.getLayout = getSidebarLayout
export default Todolists
