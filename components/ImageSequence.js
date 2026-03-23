import { useEffect, useRef, useState } from 'react'

const TOTAL_FRAMES = 30

export default function ImageSequence() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const imagesRef = useRef([])
  const [loaded, setLoaded] = useState(false)
  const [motionEnabled, setMotionEnabled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mobile = window.innerWidth <= 768
    setIsMobile(mobile)
    const folder = mobile ? '/imgod-mobile' : '/imgod'
    const prefix = mobile ? 'god-three-dimension-two' : 'god-three-dimension'

    let loadedCount = 0
    const imgs = []
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = `${folder}/${prefix}${String(i).padStart(4, '0')}.png`
      img.onload = () => {
        loadedCount++
        if (loadedCount === TOTAL_FRAMES) setLoaded(true)
      }
      imgs.push(img)
    }
    imagesRef.current = mobile ? imgs.reverse() : imgs
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      const progress = Math.max(0, Math.min(1, e.clientX / window.innerWidth))
      const frame = Math.round(progress * (TOTAL_FRAMES - 1))
      setCurrentFrame(frame)
    }
    window.addEventListener('mousemove', handleMouseMove)

    const handleOrientation = (e) => {
      if (e.gamma == null) return
      const gamma = Math.max(-28, Math.min(28, e.gamma))
      const progress = (gamma + 28) / 56
      const frame = Math.round(progress * (TOTAL_FRAMES - 1))
      setCurrentFrame(frame)
    }

    if (motionEnabled) {
      window.addEventListener('deviceorientation', handleOrientation)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [motionEnabled])

  const requestMotion = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      const permission = await DeviceOrientationEvent.requestPermission()
      if (permission === 'granted') setMotionEnabled(true)
    } else {
      setMotionEnabled(true)
    }
  }

  return (
    <>
      <div
        className="image-sequence"
        style={{
          position: 'relative',
          borderRadius: '6px',
          overflow: 'hidden',
        }}
      >
        {loaded ? (
          <img
            src={imagesRef.current[currentFrame]?.src}
            alt=""
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              userSelect: 'none',
              filter: (isMobile && !motionEnabled) ? 'blur(10px)' : 'none',
              transition: 'filter 0.4s ease',
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Roboto Mono, monospace',
            fontSize: '0.8rem',
            color: '#999',
          }}>
            Loading...
          </div>
        )}
        {isMobile && !motionEnabled && loaded && (
          <button
            onClick={requestMotion}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: 'Roboto Mono, monospace',
              fontSize: '0.85rem',
              color: '#fff',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              zIndex: 1,
            }}
          >
            Enable tilt
          </button>
        )}
      </div>
      <style jsx>{`
        .image-sequence {
          width: 600px;
          height: 600px;
        }
        @media (max-width: 768px) {
          .image-sequence {
            width: 333px;
            height: 333px;
          }
        }
      `}</style>
    </>
  )
}
