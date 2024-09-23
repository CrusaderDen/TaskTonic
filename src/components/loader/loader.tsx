import { BallTriangle } from 'react-loader-spinner'

export const Loader = () => (
  <div
    style={{ backgroundColor: 'rgba(0,0,0,0.6', bottom: 0, left: 0, position: 'fixed', right: 0, top: 0, zIndex: 100 }}
  >
    <BallTriangle
      ariaLabel={'ball-triangle-loading'}
      color={'blue'}
      height={400}
      radius={5}
      visible
      width={400}
      wrapperClass={''}
      wrapperStyle={{
        alignItems: 'center',
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
      }}
    />
  </div>
)
