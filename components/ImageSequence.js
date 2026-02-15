import { useEffect, useRef, useState } from 'react'

const TOTAL_FRAMES = 45

export default function ImageSequence() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const imagesRef = useRef([])
  const [loaded, setLoaded] = useState(false)
  const [motionEnabled, setMotionEnabled] = useState(false)

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

    // Mobile: device tilt
    const handleOrientation = (e) => {
      if (e.gamma == null) return
      const gamma = Math.max(-45, Math.min(45, e.gamma))
      const progress = (gamma + 45) / 90
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
      {!motionEnabled && (
        <button
          onClick={requestMotion}
          className="motion-btn"
          style={{
            display: 'none',
            background: 'none',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '0.4rem 0.8rem',
            fontFamily: 'Roboto Mono, monospace',
            fontSize: '0.75rem',
            color: '#555',
            cursor: 'pointer',
          }}
        >
          Enable tilt
        </button>
      )}
      <style jsx>{`
        .image-sequence {
          width: 600px;
          height: 600px;
        }
        .motion-btn {
          display: none !important;
        }
        @media (max-width: 768px) {
          .image-sequence {
            width: 300px;
            height: 300px;
          }
          .motion-btn {
            display: inline-block !important;
          }
        }
      `}</style>
    </>
  )
}
