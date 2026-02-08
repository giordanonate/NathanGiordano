'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import Head from 'next/head'

export async function getStaticProps() {
  const res = await fetch('https://delicate-credit-08df.giordanonate.workers.dev/')
  let media = await res.json()

  media = media
    .filter(url => url.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov)$/i))
    .sort(() => 0.5 - Math.random())
    .slice(0, 20)

  return {
    props: { media },
    revalidate: 60
  }
}

// Layer A is always on top (z-index 1), Layer B always on bottom (z-index 0).
// We alternate: fade A out to reveal B, then fade A in to cover B.
// After each fade, we load the next image into whichever layer is now hidden.
// Nothing ever "snaps" — the visible layer just stays visible.
export default function IndexPage({ media }) {
  const [srcA, setSrcA] = useState(media?.[0])
  const [srcB, setSrcB] = useState(media?.[1])
  const [aVisible, setAVisible] = useState(true)
  const [animating, setAnimating] = useState(false)
  const directionRef = useRef('out') // 'out' = next fade hides A, 'in' = next fade shows A
  const indexRef = useRef(1)
  const timerRef = useRef(null)
  const movementRef = useRef(0)
  const lastMouseRef = useRef({ x: 0, y: 0 })
  const busyRef = useRef(false)

  const isVideo = (url) => /\.(mp4|mov)$/i.test(url)

  const advance = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true
    setAnimating(true)

    if (directionRef.current === 'out') {
      setAVisible(false)
    } else {
      setAVisible(true)
    }

    timerRef.current = setTimeout(() => {
      indexRef.current = (indexRef.current + 1) % media.length
      const nextSrc = media[indexRef.current]

      if (directionRef.current === 'out') {
        setSrcA(nextSrc)
        directionRef.current = 'in'
      } else {
        setSrcB(nextSrc)
        directionRef.current = 'out'
      }
      setAnimating(false)
      busyRef.current = false
    }, 100)
  }, [media])

  // Mouse movement triggers faster changes
  useEffect(() => {
    const THRESHOLD = 100 // pixels of movement to trigger a change

    const handleMouseMove = (e) => {
      const dx = e.clientX - lastMouseRef.current.x
      const dy = e.clientY - lastMouseRef.current.y
      lastMouseRef.current = { x: e.clientX, y: e.clientY }

      const dist = Math.sqrt(dx * dx + dy * dy)
      movementRef.current += dist

      if (movementRef.current >= THRESHOLD && !busyRef.current) {
        movementRef.current = 0
        advance()
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [advance])

  // Base timer for when mouse is idle
  useEffect(() => {
    if (!media || media.length < 2) return
    const interval = setInterval(() => {
      if (!busyRef.current) {
        movementRef.current = 0
        advance()
      }
    }, 10000)
    return () => {
      clearInterval(interval)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [media, advance])

  const handleEnter = (e) => {
    if (e) e.stopPropagation()
    window.dispatchEvent(
      new CustomEvent('start-transition', { detail: '/home' })
    )
  }

  // Mobile tap to change image (not navigate)
  const handleWrapperClick = (e) => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      advance()
    }
  }

  // Keyboard Enter key to navigate
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') handleEnter()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
    <Head>
      <title>nathangiordano.com</title>
    </Head>
    <div onClick={handleWrapperClick} style={wrapperStyle}>
      {/* Layer B — always on bottom */}
      <div className="kb-layer-b" style={{ ...layerStyle, zIndex: 0 }}>
        {srcB && (isVideo(srcB) ? (
          <video src={srcB} autoPlay muted loop playsInline style={mediaStyle} />
        ) : (
          <img src={srcB} alt="" style={mediaStyle} />
        ))}
      </div>

      {/* Layer A — always on top, fades in/out */}
      <div className="kb-layer-a" style={{
        ...layerStyle,
        zIndex: 1,
        opacity: aVisible ? 1 : 0,
        transition: animating ? 'opacity 0.02s ease-in-out' : 'none',
      }}>
        {srcA && (isVideo(srcA) ? (
          <video src={srcA} autoPlay muted loop playsInline style={mediaStyle} />
        ) : (
          <img src={srcA} alt="" style={mediaStyle} />
        ))}
      </div>

      {/* Enter button */}
      <h1 onClick={handleEnter} style={enterStyle}>Enter</h1>

      <style jsx global>{`
        .kb-layer-a {
          animation: kb-a 20s ease-in-out infinite alternate;
        }
        .kb-layer-b {
          animation: kb-b 18s ease-in-out infinite alternate;
        }
        @keyframes kb-a {
          0%   { transform: scale(1.0) translate(0%, 0%) }
          50%  { transform: scale(1.08) translate(-2%, 1%) }
          100% { transform: scale(1.0) translate(1%, -1.5%) }
        }
        @keyframes kb-b {
          0%   { transform: scale(1.05) translate(1%, -1%) }
          50%  { transform: scale(1.0) translate(-1%, 2%) }
          100% { transform: scale(1.1) translate(2%, -1%) }
        }
        @keyframes grain {
          0%, 100% { transform: translate(0, 0) }
          10% { transform: translate(-5%, -10%) }
          20% { transform: translate(-15%, 5%) }
          30% { transform: translate(7%, -25%) }
          40% { transform: translate(-5%, 25%) }
          50% { transform: translate(-15%, 10%) }
          60% { transform: translate(15%, 0%) }
          70% { transform: translate(0%, 15%) }
          80% { transform: translate(3%, 35%) }
          90% { transform: translate(-10%, 10%) }
        }
      `}</style>
    </div>
    </>
  )
}

const wrapperStyle = {
  position: 'fixed',
  inset: 0,
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: '#fff',
}

const layerStyle = {
  position: 'absolute',
  inset: 0,
}

const mediaStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  transform: 'scale(1.3)',
}

const grainStyle = {
  position: 'absolute',
  inset: '-50%',
  width: '200%',
  height: '200%',
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
  opacity: 0.08,
  pointerEvents: 'none',
  animation: 'grain 1.5s linear infinite',
  zIndex: 2,
}

const frameStyle = {
  position: 'absolute',
  inset: 0,
  border: '100px solid #fff',
  zIndex: 3,
  pointerEvents: 'none',
}

const enterStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '2rem',
  fontFamily: 'Roboto Mono, monospace',
  color: '#fff',
  userSelect: 'none',
  zIndex: 4,
  letterSpacing: '0.1em',
  margin: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  padding: '16px 32px',
  borderRadius: '6px',
  cursor: 'pointer',
}
