import { useEffect, useRef, useState } from 'react'

const TOTAL_FRAMES = 45

export default function ImageSequence() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const imagesRef = useRef([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let loadedCount = 0
    const imgs = []
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = `/imgod/god${String(i).padStart(4, '0')}.png`
      img.onload = () => {
        loadedCount++
        if (loadedCount === TOTAL_FRAMES) setLoaded(true)
      }
      imgs.push(img)
    }
    imagesRef.current = imgs
  }, [])

  useEffect(() => {
    // Desktop: mouse position
    const handleMouseMove = (e) => {
      const progress = Math.max(0, Math.min(1, e.clientX / window.innerWidth))
      const frame = Math.round(progress * (TOTAL_FRAMES - 1))
      setCurrentFrame(frame)
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Mobile: device tilt (gamma = left/right, -90 to 90)
    const handleOrientation = (e) => {
      if (e.gamma == null) return
      const gamma = Math.max(-45, Math.min(45, e.gamma))
      const progress = (gamma + 45) / 90
      const frame = Math.round(progress * (TOTAL_FRAMES - 1))
      setCurrentFrame(frame)
    }
    window.addEventListener('deviceorientation', handleOrientation)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  return (
    <div
      style={{
        width: '600px',
        height: '600px',
        position: 'relative',
        cursor: 'default',
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
    </div>
  )
}
