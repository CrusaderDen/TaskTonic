import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Loader } from '@/components/loader/loader'
import { VideoBackground } from '@/components/video-background/video-background'
import { useLoginMutation } from '@/service/auth/auth-api'
import { Button } from '@/shared/lib/ui/button/button'
import { Input } from '@/shared/lib/ui/input/input'
import { notifyError } from '@/shared/utils/toastConfig'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { z } from 'zod'

import 'react-toastify/dist/ReactToastify.css'

import s from './index.module.scss'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, "Password can't be empty"),
})

type FormData = z.infer<typeof loginSchema>

export default function Login() {
  const router = useRouter()
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormData>({ resolver: zodResolver(loginSchema) })
  const [getLogin, { isLoading }] = useLoginMutation()

  const onSubmit = async (data: any) => {
    try {
      await getLogin(data)
        .unwrap()
        .then(() => void router.push('/todolists'))
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error) {
        if (error.status === 400 || error.status === 404) {
          notifyError('Uncorrected password or email address')
        } else if (error.status === 500) {
          notifyError('Internal server error. Please try again later.')
        } else {
          notifyError('An unexpected error occurred. Please try again.')
        }
      } else {
        notifyError('An unexpected error occurred. Please try again.')
      }
    }
  }

  return (
    <div data-styles={'default'}>
      {isLoading && <Loader />}
      <Button className={s.btnBack} onClick={() => router.push('/')} variant={'secondary'}>
        Go back
      </Button>
      <div className={s.formWrapper}>
        <h3 className={s.title}>Login Page</h3>
        <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={s.fieldWrapper}>
            <Input label={'Email'} placeholder={''} type={'text'} {...register('email')} />
            {errors.email && <p className={s.errorMsg}>{errors.email.message}</p>}
          </div>
          <div className={s.fieldWrapper}>
            <Input label={'Password'} placeholder={''} type={'password'} {...register('password')} />
            {errors.password && <p className={s.errorMsg}>{errors.password.message}</p>}
          </div>

          <Button fullWidth style={{ marginTop: '15px' }} variant={'outlined'}>
            Login
          </Button>
        </form>
      </div>
      <VideoBackground />
    </div>
  )
}
