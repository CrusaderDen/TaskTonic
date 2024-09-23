import { useEffect, useRef } from 'react'

import s from './video-background.module.scss'

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6
    }
  }, [])

  return (
    <>
      <div className={s.overlay} />
      <div>
        <video autoPlay className={s.video} loop muted ref={videoRef}>
          <source src={'/medium.mp4'} type={'video/mp4'} />
        </video>
      </div>
    </>
  )
}
