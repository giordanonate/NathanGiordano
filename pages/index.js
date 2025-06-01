'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const EarthCanvas = dynamic(() => import('../components/EarthCanvas'), { ssr: false })

export default function IndexPage() {
  const router = useRouter()

  useEffect(() => {
    const handleEarthClick = () => router.push('/home')
    window.addEventListener('earth-click', handleEarthClick)
    return () => window.removeEventListener('earth-click', handleEarthClick)
  }, [router])

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <EarthCanvas />
    </div>
  )
}
