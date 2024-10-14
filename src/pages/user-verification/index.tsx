import { useEffect } from 'react'

import { Loader } from '@/components/loader/loader'
import { useVerifyEmailMutation } from '@/service/auth/auth-api'
import { notifyError, notifySuccess } from '@/shared/utils/toastConfig'
import { useRouter } from 'next/router'

const UserVerification = () => {
  const router = useRouter()
  const key = router.query.code

  console.log(key)
  const [verifyEmail, { isError, isLoading, isSuccess }] = useVerifyEmailMutation()

  useEffect(() => {
    const verify = async () => {
      if (!key) {
        return
      }

      await verifyEmail(key as string).unwrap()
      void router.push('/login')
    }

    void verify()
  }, [key, router, verifyEmail])

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    notifyError('Invalid verification code.Try again later.')
    void router.push('/registration')
  }

  if (isSuccess) {
    notifySuccess('Email verification successfully.')
  }

  return <></>
}

export default UserVerification
