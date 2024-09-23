import { ToastPosition, toast } from 'react-toastify'

const toastConfig = {
  autoClose: 3000,
  closeOnClick: true,
  draggable: true,
  hideProgressBar: true,
  icon: undefined,
  pauseOnHover: true,
  position: 'bottom-left' as ToastPosition,
  progress: undefined,
}

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    ...toastConfig,
    className: 'toast-success-custom',
  })
}

export const showErrorToast = (message: string) => {
  toast.error(message, {
    ...toastConfig,
    className: 'toast-error-custom',
  })
}
