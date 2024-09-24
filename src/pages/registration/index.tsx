import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Loader } from '@/components/loader/loader'
import { VideoBackground } from '@/components/video-background/video-background'
import { useCreateUserMutation, useVerifyEmailMutation } from '@/service/auth/auth-api'
import { UserArgs } from '@/service/auth/auth-api-types'
import { Button } from '@/shared/lib/ui/button/button'
import { Input } from '@/shared/lib/ui/input/input'
import { notifyError } from '@/shared/utils/toastConfig'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { z } from 'zod'

import s from './index.module.scss'

type ServerError = {
  data: {
    data: string
    httpCode: number
    messages: string
    resultCode: number
  }
  status: number
}

const registrationSchema = z.object({
  confirmPassword: z.string(),
  email: z.string().email('Invalid email address'),
  login: z.string().min(3, 'The login must be longer than three characters.'),
  password: z.string().min(1, 'Password cannot be empty'),
})

type registrationSchemaData = z.infer<typeof registrationSchema>

export default function Registration() {
  const router = useRouter()
  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<registrationSchemaData>({ resolver: zodResolver(registrationSchema) })
  const [createUser, { isLoading }] = useCreateUserMutation()
  const [verifyEmail] = useVerifyEmailMutation()
  const [verificationCode, setVerificationCode] = useState('')
  const onSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        message: 'Both passwords must match.',
        type: 'manual',
      })

      return
    }

    try {
      const userData: UserArgs = { ...data, name: 'some_name', surname: 'some_surname' }

      await createUser(userData)
      alert('Please check your email, we have already sent you a verification code.')
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error) {
        if (error.status === 409) {
          notifyError('This email is already registered. Please use a different email address.')
        } else if (error.status === 400) {
          notifyError(`Please, check your data. ${(error as ServerError).data.messages}`)
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

  const handleVerifyEmail = async () => {
    if (!verificationCode) {
      return
    }
    await verifyEmail(verificationCode)
    void router.push('/login')
  }

  return (
    <div data-styles={'default'}>
      {isLoading && <Loader />}
      <div className={s.formWrapper}>
        <Button className={s.btnBack} onClick={() => router.push('/')} variant={'secondary'}>
          Go back
        </Button>
        <h3 className={s.title}>Registration Page</h3>
        <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={s.fieldWrapper}>
            <Input label={'Login'} placeholder={''} type={'text'} {...register('login')} />
            {errors.login && <span className={s.errorMsg}>{errors.login.message}</span>}
          </div>
          <div className={s.fieldWrapper}>
            <Input label={'Email'} placeholder={''} type={'email'} {...register('email')} />
            {errors.email && <p className={s.errorMsg}>{errors.email.message}</p>}
          </div>
          <div className={s.fieldWrapper}>
            <Input label={'Password'} placeholder={''} type={'password'} {...register('password')} />
            {errors.password && <p className={s.errorMsg}>{errors.password.message}</p>}
          </div>
          <div className={s.fieldWrapper}>
            <Input label={'Confirm Password'} placeholder={''} type={'password'} {...register('confirmPassword')} />
            {errors.confirmPassword && <p className={s.errorMsg}>{errors.confirmPassword.message}</p>}
          </div>

          <Button fullWidth onClick={handleSubmit(onSubmit)} style={{ marginTop: '15px' }} variant={'outlined'}>
            Send email
          </Button>
        </form>
        <div className={s.verificationWrapper}>
          <Input
            label={'Please enter the verification code from your email to complete this registration.'}
            onChange={e => {
              setVerificationCode(e.target.value)
            }}
            placeholder={''}
            value={verificationCode}
          />
          <Button onClick={handleVerifyEmail} variant={'ghost'}>
            OK
          </Button>
        </div>
      </div>
      <VideoBackground />
    </div>
  )
}
