import { useEffect } from 'react'

export const useWheelScroll = (containerSelector: string) => {
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      const scrollAmount = event.deltaY
      const container = document.querySelector(containerSelector)

      if (container) {
        container.scrollLeft += scrollAmount
      }
    }

    const container = document.querySelector(containerSelector)

    if (container) {
      container.addEventListener('wheel', handleWheel as any)
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel as any)
      }
    }
  }, [containerSelector])
}
