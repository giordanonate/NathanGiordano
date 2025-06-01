'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function TransitionOverlay() {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [nextRoute, setNextRoute] = useState(null)

  useEffect(() => {
    const start = (e) => {
      setNextRoute(e.detail)
      setVisible(true)
    }

    const end = () => {
      setTimeout(() => setVisible(false), 1000) // hold after load
    }

    window.addEventListener('start-transition', start)
    router.events.on('routeChangeComplete', end)
    router.events.on('routeChangeError', end)

    return () => {
      window.removeEventListener('start-transition', start)
      router.events.off('routeChangeComplete', end)
      router.events.off('routeChangeError', end)
    }
  }, [router])

  // Watch for full white fade-in
  useEffect(() => {
    if (visible && nextRoute) {
      const timeout = setTimeout(() => {
        router.push(nextRoute)
      }, 500) // match your overlay fade-in duration
      return () => clearTimeout(timeout)
    }
  }, [visible, nextRoute, router])

  return (
    <div className={`transition-overlay ${visible ? 'fade-in' : 'fade-out'}`} />
  )
}
